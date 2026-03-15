import { OUTGOING_ACTION_COOLDOWN_MS } from "@/config/constants";

export const getCooldownRemainingMs = (lastActionAt:any) => {
  if (!lastActionAt) return 0;
  const cooldownMs = OUTGOING_ACTION_COOLDOWN_MS

  const nextAllowedAt = new Date(lastActionAt).getTime() + cooldownMs;
  return Math.max(0, nextAllowedAt - Date.now());
};

export const formatCooldownRemaining = (remainingMs:any) => {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts:any = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (hours === 0 && seconds > 0) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
};
