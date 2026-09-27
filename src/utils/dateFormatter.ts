/**
 * Date and Time formatting utility helpers
 */

/**
 * Format ISO timestamp into user friendly date string
 * Example: "Oct 24, 2026"
 */
export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
};

/**
 * Format ISO timestamp into localized 12-hour time with seconds
 * Example: "09:30:15 AM"
 */
export const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
};

/**
 * Checks if two ISO timestamps belong to the same calendar day
 */
export const isSameDay = (dateString1: string, dateString2: string): boolean => {
  try {
    const d1 = new Date(dateString1);
    const d2 = new Date(dateString2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  } catch {
    return false;
  }
};

/**
 * Formats date into relative or readable display
 */
export const formatRelativeOrFullDate = (isoString: string): string => {
  const now = new Date();

  if (isSameDay(isoString, now.toISOString())) {
    return `Today at ${formatTime(isoString)}`;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(isoString, yesterday.toISOString())) {
    return `Yesterday at ${formatTime(isoString)}`;
  }

  return `${formatDate(isoString)} at ${formatTime(isoString)}`;
};
