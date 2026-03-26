import { SupabaseError } from "src/errors/internalError.js";
import { DeckResponseHiddenColumn } from "./type/deck_dto.js";
import type { DeckRow } from "src/core/supabase/type.js";
import { BadRequestError, ConflictError, UnauthorizedError } from "src/errors/index.js";

/**
 * Removes hidden columns (like users_id) from a deck object.
 * Returns a new object without the specified hidden columns.
 */
function removeHiddenColumn(deck: DeckRow)
: Omit<DeckRow, DeckResponseHiddenColumn> 
{
    const { users_id, ...result } = deck;
    return result;
}

/**
 * Asserts that authorization check passed (data exists).
 * Throws UnauthorizedError if data is null/falsy.
 */
function assertAuthorized<T>(data: T | null, message: string)
: asserts data is T 
{
    if (!data) {
        throw new UnauthorizedError(message);
    }
}

const idCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function generateColumnId()
: string
{
    const len = 5;
    return Array.from({length: len}, () => idCharacters[Math.floor(Math.random() * idCharacters.length)]).join('');
}

export { 
    removeHiddenColumn,
    assertAuthorized,
    generateColumnId
};