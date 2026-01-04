import type { ReviewInsert, ReviewRow } from "$lib/types/server/core/supabase/type.js";
import type { PaginatedResponse } from "./dto.js";

////////////////////////////////////////////// GET REVIEWS BY CARD ID
export interface GetReviewsByCardIdRouteHandler {
    userId: string;
    deckId: string;
    cardId: string;
    page: string | undefined;
    limit: string | undefined;
}

export type GetReviewsByCardIdRouteResponse = PaginatedResponse<ReviewRow>;


////////////////////////////////////////////// CREATE REVIEW
export interface CreateReviewRouteHandler {
    userId: string;
    deckId: string;
    cardId: string;
    data: ReviewInsert;
}

export type CreateReviewRouteResponse = ReviewRow;