// #region Developer Information
/*
 ********************************************
  Author: Andrew Laychak
  Email: ALaychak@HarrisComputer.com

  Created At: 07-25-2025 03:44:56 PM
  Last Modified: 07-25-2025 03:45:07 PM
  Last Updated By: Andrew Laychak

  Description: Function to get user worklogs for a specified date range.

  References:
    - None
 ********************************************
*/
// #endregion

// #region Imports
import { createJiraClient } from './jira-client.js';
import { env } from './helpers/environment-variables.js';
import { loadUserDirectory } from './user-directory.js';
import { formatInTimeZone } from 'date-fns-tz';
import { isInRange } from './helpers/utilities.js';
// #endregion

// #region Types
type MissingLog = {
  accountId: string;
  jql: string;
  displayName: string;
  emailAddress?: string;
};

type UserTotal = {
  accountId: string;
  displayName: string;
  seconds: number;
};

type IssueEntry = {
  issueKey: string;
  summary: string;
  seconds: number;
};

type UserWorklogReport = {
  accountId: string;
  displayName: string;
  totalSeconds: number;
  entries: IssueEntry[];
};
// #endregion

// #region Get User Worklogs for Range
async function getUserWorklogsForRange(
  start: Date,
  end: Date
): Promise<UserWorklogReport[]> {
  const client = createJiraClient();
  const directory = await loadUserDirectory(client, env.TEAM_ACCOUNT_IDS);

  const fmt = (d: Date) => formatInTimeZone(d, env.TZ, 'yyyy-MM-dd');
  const startStr = fmt(start);
  const endStr = fmt(end);

  const reports: UserWorklogReport[] = [];

  for (const accountId of env.TEAM_ACCOUNT_IDS) {
    const jql = `worklogAuthor = ${accountId} AND worklogDate >= "${startStr}" AND worklogDate <= "${endStr}"`;
    const search = await client.issueSearch.searchForIssuesUsingJql({
      jql,
      maxResults: 1000,
      fields: ['key', 'summary'],
    });

    // map issueKey -> { summary, seconds }
    const issueMap: Record<string, { summary: string; seconds: number }> = {};

    for (const issue of search.issues ?? []) {
      const key = issue.key;
      const sumry = ((issue as any).fields.summary as string) || '';
      const worklogs = await client.issueWorklogs.getIssueWorklog({
        issueIdOrKey: key,
        startAt: 0,
        maxResults: 1000,
      });

      for (const wl of worklogs.worklogs ?? []) {
        if (
          wl.author?.accountId === accountId &&
          wl.timeSpentSeconds &&
          wl.started
        ) {
          if (isInRange(wl.started, startStr, endStr, env.TZ)) {
            issueMap[key] = issueMap[key] || { summary: sumry, seconds: 0 };
            issueMap[key].seconds += wl.timeSpentSeconds;
          }
        }
      }
    }

    const entries: IssueEntry[] = Object.entries(issueMap).map(
      ([issueKey, { summary, seconds }]) => ({ issueKey, summary, seconds })
    );

    const totalSeconds = entries.reduce((acc, e) => acc + e.seconds, 0);

    reports.push({
      accountId,
      displayName: directory[accountId]?.displayName ?? accountId,
      totalSeconds,
      entries,
    });
  }

  return reports;
}
// #endregion

// #region Exports
export { getUserWorklogsForRange };
export type { MissingLog, UserTotal, IssueEntry, UserWorklogReport };
// #endregion
