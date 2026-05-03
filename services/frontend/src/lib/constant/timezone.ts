import { getTimeZones } from "@vvo/tzdb";

function formatOffset(offsetInMinutes: number): string {
  const sign = offsetInMinutes >= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offsetInMinutes) / 60).toString().padStart(2, "0");
  return 'UTC' + sign + hours;
}

export const timeZoneOptions = getTimeZones().map(tz => ({
  name: tz.name,
  label: `(${formatOffset(tz.currentTimeOffsetInMinutes)}) ${tz.name}`,
}));

export const timeZones = timeZoneOptions.map(opt => opt.name);