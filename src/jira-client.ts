// #region Developer Information
/*
 ********************************************
  Author: Andrew Laychak
  Email: ALaychak@HarrisComputer.com

  Created At: 07-25-2025 03:46:13 PM
  Last Modified: 07-25-2025 03:46:24 PM
  Last Updated By: Andrew Laychak

  Description: Creates the JIRA client for API interactions.

  References:
    - None
 ********************************************
*/
// #endregion

// #region Imports
import { Version3Client } from 'jira.js';
import { env } from './helpers/environment-variables.js';
// #endregion

// #region Create JIRA Client
function createJiraClient(): Version3Client {
  return new Version3Client({
    host: env.JIRA_BASE_URL,
    authentication: {
      basic: {
        email: env.JIRA_EMAIL,
        apiToken: env.JIRA_API_TOKEN,
      },
    },
  });
}
// #endregion

// #region Exports
export { createJiraClient };
// #endregion
