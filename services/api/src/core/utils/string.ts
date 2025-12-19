import { type UUID } from "node:crypto";
import { BadRequestError } from "../errors/httpError.js";

/**
 * Trim and see if it's empty string.
 * If it is, just return undefined.
 *
 * @param str - The text in question
 * @returns trim version of it if it's not empty string, if it's an empty string ("") then return undefined
 */
function trimOrUndefined(str: string | undefined): string | undefined {
    return str?.trim() === "" ? undefined : str?.trim();
}


export { 
    trimOrUndefined,
}