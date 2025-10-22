export const getSafeDate = (dateString: string | undefined, fallback: Date = new Date()): Date => {
  if (!dateString) return fallback;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? fallback : date;
};