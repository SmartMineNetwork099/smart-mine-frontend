export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
};
export const formatAmount = (value: any) => {
  // Step 1: Handle undefined / null / NaN
  let num = Number(value ?? 0);
  if (isNaN(num)) num = 0;
  // Step 2: Remove negative values
  if (num < 0) num = 0;
  // Step 3: Truncate (not round) to 2 decimals
  num = Math.trunc(num * 100) / 100;
  // Step 4: Always return as string with 2 decimals
  return num.toFixed(2);
}