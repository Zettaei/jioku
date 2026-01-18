import { SupabaseError } from "src/core/errors/internalError.js";
import { DeckResponseHiddenColumn } from "./type/deck_dto.js";
import type { DeckRow } from "src/core/supabase/type.js";
import { PostgrestError } from "@supabase/supabase-js";
import { BadRequestError, ConflictError, UnauthorizedError } from "src/core/errors/index.js";

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
 * Throws a typed error if a Supabase/PostgREST error exists.
 * Groups errors by SQLSTATE code prefix.
 */
function throwSupabaseErrorIfExist(error: PostgrestError | null, message: string)
: asserts error is null 
{
    if (!error) return;

    const code = error.code;

    if (code.startsWith("21")) {
        throw new BadRequestError(
            "Cardinality violation: expected single row, but multiple matched"
        );
    }

    // 22xxx → data exception / invalid input / type
    if (code.startsWith("22")) {
        switch (code) {
            case "22P02":
                throw new BadRequestError("Invalid input syntax for database type");

            case "22001":
                throw new BadRequestError("Value is too long");

            case "22003":
                throw new BadRequestError("Numeric value out of range");

            case "22007":
                throw new BadRequestError("Invalid date/time format");

            case "22012":
                throw new BadRequestError("Division by zero");

            default:
                if (code.startsWith("22")) {
                    throw new BadRequestError("Invalid data input");
                }
        }
    }

    // 23xxx → constraint violation (FK, unique)
    if (code.startsWith("23")) {
        if (code === "23503") {
            throw new SupabaseError("Foreign key does not exist", error.message, error);
        }
        if (code === "23505") {
            throw new SupabaseError("Duplicate key / unique constraint violation", error.message, error);
        }
        throw new SupabaseError(error.message || "Constraint violation", error.message, error);
    }

    // 28xxx → authorization / permission errors
    if (code.startsWith("28")) {
        throw new UnauthorizedError(error.message || "Permission denied");
    }

    // 42xxx → syntax / undefined column
    if (code.startsWith("42")) {
        throw new SupabaseError("Developer error: invalid query", error.message, error);
    }

    // 08xxx → connection / server errors
    if (code.startsWith("08")) {
        throw new SupabaseError("Database connection error", error.message, error);
    }

    // fallback for anything unexpected
    throw new SupabaseError(message, error.message, error);
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
    throwSupabaseErrorIfExist,
    assertAuthorized,
    generateColumnId
};