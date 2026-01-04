import { getTimeZones } from "@vvo/tzdb";

export const timeZones = getTimeZones().map(tz => tz.name);