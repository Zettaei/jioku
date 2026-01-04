import { getSupabaseAdminClient } from "core/supabase/supabase.js";
import type { CardRow } from "src/core/supabase/type.js";
import { DECK_OPTIONS } from "src/config.js";
import * as util from "../util.js"
import type { GetDecksStudyRouteResponse, GetStudyCardsByDeckIdRouteResponse, GetStudyCardsByStatusAndDeckIdRouteResponse } from "../type/study_dto.js";

//
// NOTE: parameters "timezone" and "status" type is maybe too flexible, MIGHT do something with it later
// TODO: pagination for deck
//
async function getStudyDecks(userId: string, page: number | undefined = 1, limit: number = DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT, timezone: string | undefined = undefined)
: Promise<GetDecksStudyRouteResponse>
{
    const supabase = getSupabaseAdminClient();

    const offset = (page - 1) * limit;

    const { data, error } = await supabase.rpc("get_decks_with_card_counts", {
        param_users_id: userId,
        param_timezone: timezone,
        param_offset: offset,
        param_limit: limit
    });

    util.throwSupabaseErrorIfExist(error, "Failed to get study decks from Supabase");

    return {
        result: data.decks,
        total: data.total_deck_count,
        pagination: {
            page,
            limit,
        }
    };
}

async function getStudyCardsByDeckId(userId: string, deckId: string, timezone: string | undefined ,limit: number = DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT, offset: number = 0)
: Promise<GetStudyCardsByDeckIdRouteResponse>
{
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.rpc("get_study_cards_initial", {
        param_decks_id: deckId,
        param_users_id: userId,
        param_timezone: timezone,

        param_new_limit: limit,
        param_new_offset: offset,

        param_due_limit: limit,
        param_due_offset: offset,

        param_retry_limit: limit,
        param_retry_offset: offset,
    });

    util.throwSupabaseErrorIfExist(error, "Failed to get study cards from Supabase");

    return data;
}

async function getStudyCardsByStatusAndDeckId(userId: string, deckId: string, timezone: string | undefined , status: number | undefined, limit: number = DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT, offset: number = 0)
: Promise<GetStudyCardsByStatusAndDeckIdRouteResponse>
{
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.rpc("get_study_cards_by_status", {
        param_decks_id: deckId,
        param_users_id: userId,
        param_timezone: timezone,
        param_status_code: status,
        param_limit: limit,
        param_offset: offset
    });
 
    util.throwSupabaseErrorIfExist(error, "Failed to get study cards from Supabase");

    return data;
}

async function updateCardAndReview(userId: string, deckId: string, cardId: string, timeSpent: number, quality: number)
: Promise<CardRow>
{
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.rpc("update_cards_and_add_review", {
        param_decks_id: deckId,
        param_cards_id: cardId,
        param_users_id: userId,
        param_timespent: timeSpent,
        param_quality: quality
    });

    util.throwSupabaseErrorIfExist(error, "Failed to update card and add review");

    return data;
}


export {
    getStudyDecks,
    getStudyCardsByDeckId,
    getStudyCardsByStatusAndDeckId,
    updateCardAndReview
}
