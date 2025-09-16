// #region Developer Information
/*
 ********************************************
  Author: Andrew Laychak
  Email: ALaychak@HarrisComputer.com

  Created At: 07-25-2025 03:41:17 PM
  Last Modified: 07-29-2025 11:33:59 PM
  Last Updated By: Andrew Laychak

  Description: Utilities for the application

  References:
    - None
 ********************************************
*/
// #endregion

// #region Imports
import { startOfDay, startOfMonth, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
// #endregion

// #region Format Time
function formatHM(seconds: number): string {
  if (seconds === 0) {
    return 'No time logged';
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
// #endregion

// #region Check if date is in range
function isInRange(
  wlDateIso: string,
  startStr: string,
  endStr: string,
  tz: string
): boolean {
  const d = new Date(wlDateIso);
  const day = formatInTimeZone(d, tz, 'yyyy-MM-dd');
  return day >= startStr && day <= endStr;
}
// #endregion

// #region Get Yesterday Range
function getYesterdayRange(): [Date, Date] {
  const today = new Date();
  const y = subDays(today, 1);
  return [y, y];
}
// #endregion

// #region Get Today Range
function getTodayRange(): [Date, Date] {
  const now = new Date();
  return [startOfDay(now), now];
}
// #endregion

// #region Get Month to Date Range
function getMonthToDateRange(): [Date, Date] {
  const today = new Date();
  return [startOfMonth(today), today];
}
// #endregion

// #region Exports
export {
  formatHM,
  isInRange,
  getYesterdayRange,
  getTodayRange,
  getMonthToDateRange,
};
// #endregion
