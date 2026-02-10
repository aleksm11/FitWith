/**
 * Timezone utilities for FitWith
 * Always uses Europe/Belgrade timezone for consistency
 */

const BELGRADE_TZ = "Europe/Belgrade";

/**
 * Get current day of week in Belgrade timezone
 * @returns 1-7 (Monday=1, Sunday=7)
 */
export function getCurrentDayOfWeekBelgrade(): number {
  const now = new Date();
  const belgradeDateStr = now.toLocaleString("en-US", { timeZone: BELGRADE_TZ });
  const belgradeDate = new Date(belgradeDateStr);
  const jsDay = belgradeDate.getDay(); // 0=Sunday, 6=Saturday
  // Convert to ISO weekday: Monday=1, Sunday=7
  return jsDay === 0 ? 7 : jsDay;
}

/**
 * Get weekday names in Serbian
 */
export const WEEKDAY_NAMES_SR = [
  "Ponedeljak",
  "Utorak",
  "Sreda",
  "Četvrtak",
  "Petak",
  "Subota",
  "Nedelja",
] as const;

/**
 * Get weekday names in English
 */
export const WEEKDAY_NAMES_EN = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/**
 * Get weekday names in Russian
 */
export const WEEKDAY_NAMES_RU = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
] as const;

/**
 * Get weekday name by locale
 */
export function getWeekdayName(dayOfWeek: number, locale: "sr" | "en" | "ru"): string {
  if (dayOfWeek < 1 || dayOfWeek > 7) return "";
  const index = dayOfWeek - 1;
  
  switch (locale) {
    case "sr":
      return WEEKDAY_NAMES_SR[index];
    case "en":
      return WEEKDAY_NAMES_EN[index];
    case "ru":
      return WEEKDAY_NAMES_RU[index];
    default:
      return WEEKDAY_NAMES_SR[index];
  }
}
