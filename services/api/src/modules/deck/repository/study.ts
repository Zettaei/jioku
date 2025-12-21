import { getSupabaseAdminClient } from "core/supabase/supabase.js";
import type { CardRow } from "src/core/supabase/type.js";
import { DECK_OPTIONS } from "src/config.js";
import * as util from "../util.js";
import type { PaginatedResponse } from "../type/dto.js";

//
// OPTIMIZE: deal with Race Condition and this ugly double db calls, maybe using SQL RPC
//

async function getStudyCardsByDeckId(userId: string, deckId: string, page: number = 1, limit: number = DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT, status: number | undefined = undefined)
: Promise<PaginatedResponse<CardRow>>
{
    const supabase = getSupabaseAdminClient();

    const offset = (page - 1) * limit;

    // TODO: use RPC to make it groupby-able so I can do that goddamn fetching for all status and stuff bruh

    // TODO: TIMEZONE stuff OMG, probably has to have user send timezone themselves or fetch for user timezone in profile (none for now)

    let query = supabase
        .from("cards")
        .select(`*, decks!inner()`)
        .eq("decks_id", deckId)
        .eq("decks.users_id", userId)
        .order("createdat", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    const { data, error } = await query.range(offset, offset + limit);

    util.throwSupabaseErrorIfExist(error, "Failed to get study cards from Supabase");

    const hasNext = (data?.length ?? 0) > limit;

    if(hasNext) data?.pop();

    return {
        result: data ?? [],
        pagination: {
            page,
            limit,
            hasNext
        }
    };
}


export {
    getStudyCardsByDeckId
}
