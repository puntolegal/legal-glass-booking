// Helpers de fechas en zona horaria America/Santiago

export const toLocalYmd = (d: Date = new Date()): string => {
  const local = new Date(d.toLocaleString('en-US', { timeZone: 'America/Santiago' }));
  return local.toISOString().slice(0, 10);
};

export const addDaysLocalYmd = (days: number): string => {
  const nowLocal = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }));
  nowLocal.setDate(nowLocal.getDate() + days);
  return nowLocal.toISOString().slice(0, 10);
};

