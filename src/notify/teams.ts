// #region Developer Information
/*
 ********************************************
  Author: Andrew Laychak
  Email: ALaychak@HarrisComputer.com

  Created At: 07-25-2025 03:42:17 PM
  Last Modified: 07-25-2025 03:42:23 PM
  Last Updated By: Andrew Laychak

  Description: Post to Microsoft Teams with worklog reports.

  References:
    - None
 ********************************************
*/
// #endregion

// #region Imports
import type { UserWorklogReport } from '../check-worklogs';
import { formatHM } from '../helpers/utilities.js';
// #endregion

// #region Types
type TeamsCard = {
  '@type': 'MessageCard';
  '@context': 'https://schema.org/extensions';
  themeColor: string;
  title: string;
  text: string;
};
// #endregion

// #region Post to Microsoft Teams
async function postToTeams(
  webhookUrl: string,
  title: string,
  yesterday: UserWorklogReport[],
  month: UserWorklogReport[],
  showMonth: boolean
): Promise<void> {
  const buildSection = (heading: string, reports: UserWorklogReport[]) => {
    let html = `<strong>${heading}:</strong><br/><ul>`;
    for (const u of reports) {
      html += `<li><strong>${u.displayName}: ${formatHM(
        u.totalSeconds
      )}</strong>`;

      if (u.entries.length) {
        html += `<ul>`;

        for (const e of u.entries) {
          html += `<li>${e.issueKey}: ${e.summary} – ${formatHM(
            e.seconds
          )}</li>`;
        }

        html += `</ul>`;
      }

      html += `</li>`;
    }

    html += `</ul><br/>`;

    return html;
  };

  let text = buildSection('Yesterday', yesterday);

  if (showMonth) {
    text += buildSection('Month to Date', month);
  }

  const card: TeamsCard = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    themeColor: '0076D7',
    title,
    text: `<br/>${text}`,
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Teams webhook failed (${res.status}): ${body}`);
  }
}
// #endregion

// #region Exports
export { postToTeams };
// #endregion
