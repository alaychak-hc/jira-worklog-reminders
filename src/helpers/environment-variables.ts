// #region Developer Information
/*
 ********************************************
  Author: Andrew Laychak
  Email: ALaychak@HarrisComputer.com

  Created At: 05-10-2024 12:00:42 AM
  Last Modified: 07-25-2025 11:21:36 AM
  Last Updated By: Andrew Laychak

  Description: Helper file that validates environment variables.

  References:
    - Envalid: https://github.com/af/envalid
 ********************************************
*/
// #endregion

// #region Imports
import { cleanEnv, json, port, str } from 'envalid';
// #endregion

// #region Environment Variables
const env = cleanEnv(process.env, {
  // #region Environment
  NODE_ENV: str({
    choices: ['local', 'development', 'test', 'production'],
    default: 'production',
  }),
  // #endregion

  // #region JIRA
  JIRA_BASE_URL: str(),
  JIRA_EMAIL: str(),
  JIRA_API_TOKEN: str(),
  TEAM_ACCOUNT_IDS: json<string[]>(),
  TZ: str(),
  MS_TEAMS_WEBHOOK_URL: str({
    default: undefined,
  }),
  // #endregion
});
// #endregion

// #region Exports
export { env };
// #endregion
