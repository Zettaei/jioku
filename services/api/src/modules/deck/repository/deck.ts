import { getSupabaseAdminClient } from "core/supabase/supabase.js";
import type { DeckInsert, DeckRow, DeckUpdate } from "src/core/supabase/type.js";
import { SupabaseError } from "src/core/errors/internalError.js";
import { DECK_OPTIONS } from "src/config.js";


async function getDecksByUserId(userId: string): Promise<Array<DeckRow>> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("users_id", userId)
        .order("name", { ascending: false})
        .limit(DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT);

    if (error) {
        throw new SupabaseError("Failed to get decks from Supabase", "", error);
    }

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

    if (error) {
        throw new SupabaseError("Failed to get deck from Supabase", "", error);
    }

    return data;
}


async function createDeck(deck: DeckInsert): Promise<DeckRow> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .insert(deck)
        .select()
        .maybeSingle();

    if (error) {
        throw new SupabaseError("Failed to create decks in Supabase", "", error);
    }

    return data;
}


async function updateDeck(deckId: string, userId: string, updates: DeckUpdate): Promise<DeckRow> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .update(updates)
        .eq("id", deckId)
        .eq("users_id", userId)
        .select()
        .maybeSingle();

    if (error) {
        throw new SupabaseError("Failed to update deck in Supabase", "", error);
    }

    return data;
}


async function deleteDeck(deckId: string, userId: string): Promise<void> {
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
        .from("decks")
        .delete()
        .eq("id", deckId)
        .eq("users_id", userId);

    if (error) {
        throw new SupabaseError("Failed to delete deck in Supabase", "", error);
    }
}


export {
    getDecksByUserId,
    getDeckById,
    createDeck,
    updateDeck,
    deleteDeck
}