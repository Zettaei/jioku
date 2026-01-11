import { getSupabaseAdminClient } from "core/supabase/supabase.js";
import type { CardRow, CardInsert, CardUpdate } from "src/core/supabase/type.js";
import { DECK_OPTIONS } from "src/config.js";
import * as util from "../util.js";
import type { PaginatedResponseWithTotalCount } from "../type/dto.js";

//
// OPTIMIZE: deal with Race Condition and this ugly double db calls, maybe using SQL RPC
//

async function getCardsByDeckId(userId: string, deckId: string, page: number = 1, limit: number = DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT)
: Promise<PaginatedResponseWithTotalCount<CardRow>>
{
    const supabase = getSupabaseAdminClient();

    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
        .from("cards")
        .select(`
            *,
            decks!cards_decks_id_fkey!inner()
            `, 
            { count: "exact" }
        )
        .eq("decks_id", deckId)
        .eq("decks.users_id", userId)
        .order("createdat", { ascending: false })
        .range(offset, offset + (limit-1));

    util.throwSupabaseErrorIfExist(error, "Failed to get cards from Supabase");

    return {
        result: data ?? [],
        total: count ?? 0,
        pagination: {
            page,
            limit,
        }
    };
}


async function getCardById(userId: string, cardId: string, deckId: string)
: Promise<CardRow | null>
{
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("cards")
        .select(`*, decks!cards_decks_id_fkey!inner()`)
        .eq("id", cardId)
        .eq("decks_id", deckId)
        .eq("decks.users_id", userId)
        .maybeSingle();

    util.throwSupabaseErrorIfExist(error, "Failed to get card from Supabase");

    return data;
}

async function createCard(userId: string, deckId: string, newCardData: CardInsert)
: Promise<CardRow>
{
    const supabase = getSupabaseAdminClient();
    const ERROR_MESSAGE = "Failed to create card in Supabase";
    const UNAUTHORIZED_MESSAGE = "Incorrect permissions or card/deck does not exist";

    {
        const { data, error } = await supabase
            .from("decks")
            .select("id")
            .eq("id", deckId)
            .eq("users_id", userId)
            .maybeSingle();

        util.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
        util.assertAuthorized(data, UNAUTHORIZED_MESSAGE);
    }
    {
        const { data, error } = await supabase
            .from("cards")
            .insert({
                ...newCardData,
                decks_id: deckId,
            })
            .select("*")
            .single();

        util.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);

        return data;
    }
}


async function updateCard(userId: string, cardId: string, deckId: string, updates: CardUpdate)
: Promise<CardRow>
{
    const supabase = getSupabaseAdminClient();
    const ERROR_MESSAGE = "Failed to update card in Supabase";
    const UNAUTHORIZED_MESSAGE = "Incorrect permissions or card/deck does not exist";

    {
        const { data, error } = await supabase.rpc("update_card", {
            param_decks_id: deckId,
            param_cards_id: cardId,
            param_users_id: userId,
            param_updates: updates
        })

        util.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
        util.assertAuthorized(data, UNAUTHORIZED_MESSAGE);

        return data;
    }
}


async function deleteCards(userId: string, cardIds: Array<string>, deckId: string)
: Promise<void>
{
    const supabase = getSupabaseAdminClient();
    const ERROR_MESSAGE = "Failed to delete cards in Supabase";
    const UNAUTHORIZED_MESSAGE = "Incorrect permissions or card/deck does not exist";

    {
        const { data, error } = await supabase
            .from("decks")
            .select("id")
            .eq("id", deckId)
            .eq("users_id", userId)
            .maybeSingle();


        util.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
        util.assertAuthorized(data, UNAUTHORIZED_MESSAGE);
    }
    {
        const { data, error } = await supabase
            .from("cards")
            .delete()
            .eq("decks_id", deckId)
            .in("id", cardIds)
            .select();


        util.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
        util.assertAuthorized(data.length > 0 ? data : null, UNAUTHORIZED_MESSAGE);

        return;
    }
}


export {
    getCardsByDeckId,
    getCardById,
    createCard,
    updateCard,
    deleteCards
}