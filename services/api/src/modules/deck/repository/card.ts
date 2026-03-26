import * as Supabase from "src/core/supabase/index.js";
import type { CardRow, CardInsert, CardUpdate, DeckRow } from "src/core/supabase/type.js";
import { DECK_OPTIONS } from "src/config.js";
import * as util from "../util.js";
import type { PaginatedResponseWithTotalCount } from "../type/dto.js";

//
// OPTIMIZE: deal with this ugly double db calls, maybe using SQL RPC
//

async function getCardsByDeckId(userId: string, deckId: string, 
    page: number = 1, limit: number = DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT,
    search: string, sortby: keyof CardRow | (string & {}), sortasc: boolean
)
: Promise<PaginatedResponseWithTotalCount<CardRow>>
{
    const supabase = Supabase.getSupabaseAdminClient();

    const offset = (page - 1) * limit;

    // FIXME: search text is searching the entire json which include the key, "d" catches "rea'd'ing"
    const { data, error, count } = await supabase.rpc("get_cards", {
        param_decks_id: deckId,
        param_users_id: userId,
        param_searchtext: search,
        param_sortby: sortby,
        param_sortby_direction: sortasc ? "ASC" : "DESC",
        param_offset: offset,
        param_limit: limit
    }, {   
        count: 'exact'  
    });

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");

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
    const supabase = Supabase.getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("cards")
        .select(`*, decks!cards_decks_id_fkey!inner()`)
        .eq("id", cardId)
        .eq("decks_id", deckId)
        .eq("decks.users_id", userId)
        .maybeSingle();

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get card from Supabase");

    return data;
}

async function createCard(userId: string, deckId: string, newCardData: CardInsert)
: Promise<CardRow>
{
    const supabase = Supabase.getSupabaseAdminClient();
    const ERROR_MESSAGE = "Failed to create card in Supabase";
    const UNAUTHORIZED_MESSAGE = "Incorrect permissions or card/deck does not exist";

    {
        const { data, error } = await supabase
            .from("decks")
            .select("id")
            .eq("id", deckId)
            .eq("users_id", userId)
            .maybeSingle();

        Supabase.utils.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
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

        Supabase.utils.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);

        return data;
    }
}


async function updateCard(userId: string, cardId: string, deckId: string, updates: CardUpdate)
: Promise<CardRow>
{
    const supabase = Supabase.getSupabaseAdminClient();
    const ERROR_MESSAGE = "Failed to update card in Supabase";
    const UNAUTHORIZED_MESSAGE = "Incorrect permissions or card/deck does not exist";

    {
        const { data, error } = await supabase.rpc("update_card", {
            param_decks_id: deckId,
            param_cards_id: cardId,
            param_users_id: userId,
            param_updates: updates
        })

        Supabase.utils.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
        util.assertAuthorized(data, UNAUTHORIZED_MESSAGE);

        return data;
    }
}


async function deleteCards(userId: string, cardIds: Array<string>, deckId: string)
: Promise<void>
{
    const supabase = Supabase.getSupabaseAdminClient();
    const ERROR_MESSAGE = "Failed to delete cards in Supabase";
    const UNAUTHORIZED_MESSAGE = "Incorrect permissions or card/deck does not exist";

    {
        const { data, error } = await supabase
            .from("decks")
            .select("id")
            .eq("id", deckId)
            .eq("users_id", userId)
            .maybeSingle();


        Supabase.utils.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
        util.assertAuthorized(data, UNAUTHORIZED_MESSAGE);
    }
    {
        const { data, error } = await supabase
            .from("cards")
            .delete()
            .eq("decks_id", deckId)
            .in("id", cardIds)
            .select();


        Supabase.utils.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
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