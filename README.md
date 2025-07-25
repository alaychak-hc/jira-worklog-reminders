# JIRA - Worklog Reminders

Sends reminders for logging work at the end of the day.

## Setup

- Create a `.env` file in the root directory with the following variables:

   ```plaintext
   JIRA_BASE_URL=https://your-jira-instance.atlassian.net
   JIRA_EMAIL=your_jira_email
   JIRA_API_TOKEN=your_api_token
   TEAM_ACCOUNT_IDS=["your_team_account_id"]
   TZ="your_timezone"
   MS_TEAMS_WEBHOOK_URL="your_teams_webhook_url"
   ```

- It's recommended to use [Dotenvx](https://www.npmjs.com/package/@dotenvx/dotenvx) to set the variables, as they will be encrypted.

## JIRA Notes

- To retrieve the IDs for `TEAM_ACCOUNT_IDS`, you can browse to a specific JIRA ticket, and hover over the`Assignee` or`Reporter` field. Click the `View Profile` button. The URL will contain the account ID, which looks like this: `https://your-jira-instance.atlassian.net/jira/people/5f3c2d3e-1234-5678-90ab-cdef12345678/profile`. The account ID is the last part of the URL.

- The `TZ` variable should be set to your local timezone. You can find a list of supported timezones [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). It should match the timezone used in your [JIRA profile settings](https://id.atlassian.com/manage-profile/account-preferences).

- The `JIRA_BASE_URL` should be the base URL of your JIRA instance, such as `https://your-jira-instance.atlassian.net`.

- The `JIRA_API_TOKEN` can be generated from your [Atlassian account](https://id.atlassian.com/manage-profile/security/api-tokens).

- The `MS_TEAMS_WEBHOOK_URL` is optional. If set, it will send the worklog summary to a Microsoft Teams channel.

## Microsoft Teams - Setup

If you want to receive notifications in Microsoft Teams, follow these steps:

- Create a new channel in your Microsoft Teams team.
- Click on the `...` (More options) next to the channel name, select `Manage Channel`, then select `Settings`, select `Connectors`, and then `Edit`.
- Search for `Incoming Webhook` and click `Add`.
- Configure the webhook and copy the generated URL.
- Set the `MS_TEAMS_WEBHOOK_URL` variable in your `.env` file to the copied URL.
