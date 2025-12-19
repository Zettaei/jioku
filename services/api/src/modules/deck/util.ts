import { SupabaseError } from "src/core/errors/internalError.js";
import { DeckResponseHiddenColumn } from "./type/deck_dto.js";
import type { DeckRow } from "src/core/supabase/type.js";
import { PostgrestError } from "@supabase/supabase-js";
import { BadRequestError, UnauthorizedError } from "src/core/errors/index.js";

/**
 * Removes hidden columns (like users_id) from a deck object.
 * Returns a new object without the specified hidden columns.
 */
function removeHiddenColumn(deck: DeckRow): Omit<DeckRow, DeckResponseHiddenColumn> {
    const { users_id, ...result } = deck;
    return result;
}

/**
 * Asserts that no Supabase error occurred.
 * Throws SupabaseError if error is not null.
 */
function throwSupabaseErrorIfExist(error: PostgrestError | null, message: string): asserts error is null {
    if (!error) return;

    // check fields, not instanceof
    if ("code" in error && "message" in error) {
        switch (error.code) {
        case "22P02":
            throw new BadRequestError("Invalid UUID or type");
        case "23503":
            throw new BadRequestError("Foreign key does not exist");
        default:
            throw new SupabaseError(message, error.message, error);
        }
    }

    // fallback
    throw new SupabaseError(message, "Unknown error", error);
}

/**
 * Asserts that authorization check passed (data exists).
 * Throws UnauthorizedError if data is null/falsy.
 */
function assertAuthorized<T>(data: T | null, message: string): asserts data is T {
    if (!data) {
        throw new UnauthorizedError(message);
    }
}

export { 
    removeHiddenColumn,
    throwSupabaseErrorIfExist,
    assertAuthorized
};