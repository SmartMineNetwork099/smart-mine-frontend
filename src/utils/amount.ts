export const formatTo4 = (value:any) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "0.0000";
  return (Math.floor(num * 10000) / 10000).toFixed(4);
};

export const roundTo4 = (value:any) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return 0;
  return Math.floor(num * 10000) / 10000;
};