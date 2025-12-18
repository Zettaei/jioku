import { getSupabaseAdminClient } from "core/supabase/supabase.js";
import type { CardRow, CardInsert, CardUpdate } from "src/core/supabase/type.js";
import { SupabaseError } from "src/core/errors/internalError.js";


async function getCardsByDeckId(deckId: string): Promise<CardRow[]> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("decks_id", deckId)
        .order("due");

    if (error) {
        throw new SupabaseError("Failed to get cards from Supabase", "", error);
    }

    return data || [];
}


async function getCardById(cardId: string, deckId: string): Promise<CardRow | null> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", cardId)
        .eq("decks_id", deckId)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null; // Not found
        }
        throw new SupabaseError("Failed to get card from Supabase", "", error);
    }

    return data;
}


async function createCard(card: CardInsert): Promise<CardRow> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("cards")
        .insert(card)
        .select()
        .single();

    if (error) {
        throw new SupabaseError("Failed to create card in Supabase", "", error);
    }

    return data;
}


async function updateCard(cardId: string, deckId: string, updates: CardUpdate): Promise<CardRow> {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("cards")
        .update(updates)
        .eq("id", cardId)
        .eq("decks_id", deckId)
        .select()
        .single();

    if (error) {
        throw new SupabaseError("Failed to update card in Supabase", "", error);
    }

    return data;
}


async function deleteCard(cardId: string, deckId: string): Promise<void> {
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
        .from("cards")
        .delete()
        .eq("id", cardId)
        .eq("decks_id", deckId);

    if (error) {
        throw new SupabaseError("Failed to delete card in Supabase", "", error);
    }
}


export {
    getCardsByDeckId,
    getCardById,
    createCard,
    updateCard,
    deleteCard
}