// #region Imports
import chalk from 'chalk';
import { getUserWorklogsForRange } from './check-worklogs.js';
import { env } from './helpers/environment-variables.js';
import { postToTeams } from './notify/teams.js';
import {
  formatHM,
  getMonthToDateRange,
  getTodayRange,
  getYesterdayRange,
} from './helpers/utilities.js';
// #endregion

// #region Indentation Helper
const indent = (str: string) => '    ' + str;
// #endregion

// #region Run
async function run(): Promise<void> {
  const today = new Date();
  const isLastDay =
    today.getDate() ===
    new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const [yStart, yEnd] = getYesterdayRange();
  const [mStart, mEnd] = getMonthToDateRange();

  const month = [];
  const yesterday = [];

  if (isLastDay) {
    month.push(...(await getUserWorklogsForRange(mStart, mEnd)));
    console.log(chalk.bold.yellow('\nMonthly Summary:'));

    for (const u of month) {
      console.log(
        `• ${chalk.cyan(u.displayName)}: ${chalk.green(
          formatHM(u.totalSeconds)
        )}`
      );
      for (const e of u.entries) {
        console.log(
          indent(`${e.issueKey}: ${e.summary} - ${formatHM(e.seconds)}`)
        );
      }
    }
  } else {
    yesterday.push(...(await getUserWorklogsForRange(yStart, yEnd)));

    console.log(chalk.bold.underline.blue(`📊 Time Summary (${env.TZ})`));
    console.log(chalk.bold.yellow('\nYesterday:'));
    for (const u of yesterday) {
      console.log(
        `• ${chalk.cyan(u.displayName)}: ${chalk.green(
          formatHM(u.totalSeconds)
        )}`
      );
      for (const e of u.entries) {
        console.log(
          indent(`${e.issueKey}: ${e.summary} - ${formatHM(e.seconds)}`)
        );
      }
    }
  }

  if (env.MS_TEAMS_WEBHOOK_URL) {
    const title = `📊 Time Summary (${env.TZ})`;

    await postToTeams(
      env.MS_TEAMS_WEBHOOK_URL,
      title,
      yesterday,
      month,
      isLastDay
    );
  }
}

async function getMyTimeToday() {
  const [start, end] = getTodayRange();

  const worklogs = await getUserWorklogsForRange(start, end);
  const myWorklog = worklogs.find((u) => u.accountId === env.JIRA_ACCOUNT_ID);

  if (myWorklog) {
    console.log(
      `You worked ${chalk.green(formatHM(myWorklog.totalSeconds))} today.`
    );

    for (const e of myWorklog.entries) {
      console.log(
        indent(`${e.issueKey}: ${e.summary} - ${formatHM(e.seconds)}`)
      );
    }
  } else {
    console.log(chalk.red('No worklogs found for today.'));
  }
}

try {
  await run();

  if (env.NODE_ENV === 'local') {
    console.log(chalk.bold.blue('\nChecking your worklogs for today...'));
    await getMyTimeToday();
  }
} catch (error) {
  console.error('Error occurred while checking worklogs:', error);
  process.exit(1);
}
// #endregion
