import { supabaseAdmin } from "core/supabase/index.js";
import type { DeckInsert, DeckRow, DeckUpdate } from "src/core/supabase/type.js";
import { SupabaseError } from "src/core/errors/internalError.js";


async function getDecksByUserId(userId: string): Promise<DeckRow[]> {
    const { data, error } = await supabaseAdmin
        .from("decks")
        .select("*")
        .eq("users_id", userId)
        .order("name");

    if (error) {
        throw new SupabaseError("Failed to get decks from Supabase", "", error);
    }

    return data || [];
}


async function getDeckById(userId: string, deckId: string): Promise<DeckRow | null> {
    const { data, error } = await supabaseAdmin
        .from("decks")
        .select("*")
        .eq("id", deckId)
        .eq("users_id", userId)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null; // Not found
        }
        throw new SupabaseError("Failed to get deck from Supabase", "", error);
    }

    return data;
}


async function createDeck(deck: DeckInsert): Promise<DeckRow> {
    const { data, error } = await supabaseAdmin
        .from("decks")
        .insert(deck)
        .select()
        .single();

    if (error) {
        throw new SupabaseError("Failed to create decks in Supabase", "", error);
    }

    return data;
}


async function updateDeck(deckId: string, userId: string, updates: DeckUpdate): Promise<DeckRow> {
    const { data, error } = await supabaseAdmin
        .from("decks")
        .update(updates)
        .eq("id", deckId)
        .eq("users_id", userId)
        .select()
        .single();

    if (error) {
        throw new SupabaseError("Failed to update deck in Supabase", "", error);
    }

    return data;
}


async function deleteDeck(deckId: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
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