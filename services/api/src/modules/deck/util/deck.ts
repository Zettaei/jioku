import { DeckResponseHiddenColumn } from "../type/deck_dto.js";
import type { DeckRow } from "src/core/supabase/type.js";

/**
 * Removes hidden columns (like users_id) from a deck object.
 * Returns a new object without the specified hidden columns.
 */
function removeHiddenColumn(deck: DeckRow): Omit<DeckRow, DeckResponseHiddenColumn> {
    const { users_id, ...result } = deck;
    return result;
}


export { 
    removeHiddenColumn
};