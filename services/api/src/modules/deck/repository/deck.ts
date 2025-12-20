import { getSupabaseAdminClient } from "core/supabase/supabase.js";
import type { DeckInsert, DeckRow, DeckUpdate } from "src/core/supabase/type.js";
import { DECK_OPTIONS } from "src/config.js";
import * as util from "../util.js";

async function getDecksByUserId(userId: string): Promise<Array<DeckRow>> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("users_id", userId)
        .order("name", { ascending: false})
        .limit(DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT);

    util.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");

    return data || [];
}


async function getDeckById(userId: string, deckId: string): Promise<DeckRow | null> {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", deckId)
        .eq("users_id", userId)
        .maybeSingle();
        
    util.throwSupabaseErrorIfExist(error, "Failed to get deck from Supabase");

    return data;
}


async function createDeck(newDeckData: DeckInsert): Promise<DeckRow> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .insert(newDeckData)
        .select("*")
        .maybeSingle();

    util.throwSupabaseErrorIfExist(error, "Failed to create decks in Supabase");

    return data;
}


async function updateDeck(deckId: string, userId: string, updatedDeckData: DeckUpdate): Promise<DeckRow> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .update(updatedDeckData)
        .eq("id", deckId)
        .eq("users_id", userId)
        .select("*")
        .maybeSingle();

    util.throwSupabaseErrorIfExist(error, "Failed to update deck in Supabase");
    util.assertAuthorized(data, "Incorrect permissions or deck does not exist");

    return data;
}


async function deleteDeck(deckId: string, userId: string): Promise<void> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .delete()
        .eq("id", deckId)
        .eq("users_id", userId)
        .select("*")
        .maybeSingle();

    util.throwSupabaseErrorIfExist(error, "Failed to delete deck in Supabase");
    util.assertAuthorized(data, "Incorrect permissions or deck does not exist");
        
    return;
}
export {
    getDecksByUserId,
    getDeckById,
    createDeck,
    updateDeck,
    deleteDeck
}