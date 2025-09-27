// function seconds to h:m:s format
export const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs > 0 ? `${String(hrs).padStart(2, "0")}h : ` : ""}${String(mins).padStart(2, "0")}m : ${String(secs).padStart(2, "0")}s`;
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