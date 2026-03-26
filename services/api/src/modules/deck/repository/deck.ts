import * as Supabase from "src/core/supabase/index.js";
import type { DeckInsert, DeckRow, DeckUpdate } from "src/core/supabase/type.js";
import { DECK_OPTIONS } from "src/config.js";
import * as util from "../util.js";
import type { DeckResponseHiddenColumn, GetDeckStatusByIdRouteResponse, GetDueDistributionByDateRouteResponse, GetRetentionRateByDateRouteResponse } from "../type/deck_dto.js";
import type { PaginatedResponse } from "../type/dto.js";

async function getDecksByUserId(userId: string, page: number = 1, limit: number = DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT)
: Promise<PaginatedResponse<DeckRow>> 
{
    const supabase = Supabase.getSupabaseAdminClient();

    const offset = (page - 1) * limit;

    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("users_id", userId)
        .order("name", { ascending: false })
        .order("id", { ascending: false })  // extra, in case of decks having the same name
        .range(offset, offset + limit)

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");

    const hasNext = (data?.length ?? 0) > limit;

    if(hasNext) data.pop();

    return {
        result: data ?? [],
        pagination: {
            page,
            limit,
            hasNext
        }
    };
}


async function getDeckById(userId: string, deckId: string)
: Promise<DeckRow | null> 
{
    const supabase = Supabase.getSupabaseAdminClient();
    
    const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", deckId)
        .eq("users_id", userId)
        .maybeSingle();
        
    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");

    return data;
}


async function createDeck(newDeckData: DeckInsert)
: Promise<DeckRow>
{
    const supabase = Supabase.getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .insert(newDeckData)
        .select("*")
        .maybeSingle();

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");

    return data;
}


async function updateDeck(deckId: string, userId: string, updatedDeckData: DeckUpdate)
: Promise<DeckRow> 
{
    const supabase = Supabase.getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .update(updatedDeckData)
        .eq("id", deckId)
        .eq("users_id", userId)
        .select("*")
        .maybeSingle();

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");
    util.assertAuthorized(data, "Incorrect permissions or deck does not exist");

    return data;
}


async function deleteDeck(deckId: string, userId: string)
: Promise<void> 
{
    const supabase = Supabase.getSupabaseAdminClient();

    const { data, error } = await supabase
        .from("decks")
        .delete()
        .eq("id", deckId)
        .eq("users_id", userId)
        .select("*")
        .maybeSingle();

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");
    util.assertAuthorized(data, "Incorrect permissions or deck does not exist");
        
    return;
}


async function getDeckStatusById(userId: string, deckId: string, timezone: string | undefined = undefined)
: Promise<GetDeckStatusByIdRouteResponse>
{
    const supabase = Supabase.getSupabaseAdminClient();

    const { data, error } = await supabase.rpc("get_deck_status", {
        param_decks_id: deckId,
        param_users_id: userId,
        param_timezone: timezone
    });

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");

    return data;
}


async function getRetentionRateByDate(userId: string, deckId: string, timezone: string, from: string | undefined, to: string | undefined)
: Promise<GetRetentionRateByDateRouteResponse>
{
    const supabase = Supabase.getSupabaseAdminClient();

    const { data, error } = await supabase.rpc("get_retention_rate_by_date", {
        param_decks_id: deckId,
        param_users_id: userId,
        param_timezone: timezone,
        param_from_date: from ?? null,
        param_to_date: to ?? null
    });

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");

    return data;
}


async function getDueDistributionByDate(userId: string, deckId: string, timezone: string, ahead_days: number | undefined)
: Promise<GetDueDistributionByDateRouteResponse>
{
    const supabase = Supabase.getSupabaseAdminClient();

    const { data, error } = await supabase.rpc("get_due_distribution_by_date", {
        param_decks_id: deckId,
        param_users_id: userId,
        param_timezone: timezone,
        param_ahead_days: ahead_days ?? null
    });

    Supabase.utils.throwSupabaseErrorIfExist(error, "Failed to get decks from Supabase");

    return data;
}

export {
    getDecksByUserId,
    getDeckById,
    createDeck,
    updateDeck,
    deleteDeck,
    getDeckStatusById,
    getRetentionRateByDate,
    getDueDistributionByDate
}