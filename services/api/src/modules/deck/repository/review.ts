import { getSupabaseAdminClient } from "core/supabase/supabase.js";
import type { ReviewRow, ReviewInsert, CardRow } from "src/core/supabase/type.js";
import { DECK_OPTIONS } from "src/config.js";
import * as util from "../util.js";
import type { PaginatedResponse } from "../type/dto.js";


// OPTIMIZE: make it batch insert with Redis Queue or Redis Streams, it's only adding process so likely no Race Condition

async function getReviewsByCardId(userId: string, deckId: string, cardId: string, page: number = 1, limit: number = DECK_OPTIONS.REVIEW_RESULT_FETCH_LIMIT)
: Promise<PaginatedResponse<ReviewRow>>
{
    const supabase = getSupabaseAdminClient();

    const offset = (page - 1) * limit;

    const { data, error } = await supabase
        .from("reviews")
        .select(`*, cards!reviews_cards_id_fkey!inner(decks!cards_decks_id_fkey!inner())`)
        .eq("cards_id", cardId)
        .eq("cards.decks_id", deckId)
        .eq("cards.decks.users_id", userId)
        .order("createdat", { ascending: false })
        .range(offset, offset + limit);

    util.throwSupabaseErrorIfExist(error, "Failed to get reviews from Supabase");

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


// async function createReview(userId: string, deckId: string, cardId: string, newReviewData: ReviewInsert)
// : Promise<{ review: ReviewRow }>
// {
//     const supabase = getSupabaseAdminClient();
//     const ERROR_MESSAGE = "Failed to create review in Supabase";
//     const UNAUTHORIZED_MESSAGE = "Incorrect permissions or card/deck does not exist";

//     {
//         const { data, error } = await supabase
//             .from("cards")
//             .select("id, easefactor, interval, repetition, decks!cards_decks_id_fkey!inner()")
//             .eq("id", cardId)
//             .eq("decks.id", deckId)
//             .eq("decks.users_id", userId)
//             .maybeSingle();

//         util.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);
//         util.assertAuthorized(data, UNAUTHORIZED_MESSAGE);
//     }
//     console.log()
//     {
//         const { data, error } = await supabase
//             .from("reviews")
//             .insert({
//                 decks_id: deckId,
//                 cards_id: cardId,
//                 ...newReviewData
//             })
//             .select("*")
//             .single();

//         util.throwSupabaseErrorIfExist(error, ERROR_MESSAGE);

//         return { review: data };
//     }
// }



export {
    getReviewsByCardId,
    // createReview,
}
