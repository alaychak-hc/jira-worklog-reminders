// #region Developer Information
/*
 ********************************************
  Author: Andrew Laychak
  Email: ALaychak@HarrisComputer.com

  Created At: 07-25-2025 03:46:59 PM
  Last Modified: 07-25-2025 03:47:05 PM
  Last Updated By: Andrew Laychak

  Description: Loads the user directory from JIRA.

  References:
    - None
 ********************************************
*/
// #endregion

// #region Imports
import { Version3Client } from 'jira.js';
// #endregion

// #region Types
type JiraUserInfo = {
  accountId: string;
  displayName: string;
  emailAddress?: string;
};
// #endregion

// #region Load User Directory
async function loadUserDirectory(
  client: Version3Client,
  accountIds: string[]
): Promise<Record<string, JiraUserInfo>> {
  const { values: users = [] } = await client.users.bulkGetUsers({
    accountId: accountIds,
  });

  const map: Record<string, JiraUserInfo> = {};
  for (const u of users) {
    map[u.accountId] = {
      accountId: u.accountId,
      displayName: u.displayName ?? '(Unknown)',
      emailAddress: (u as any).emailAddress,
    };
  }
  return map;
}
// #endregion

// #region Exports
export { loadUserDirectory };
export type { JiraUserInfo };
// #endregion
