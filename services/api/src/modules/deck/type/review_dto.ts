import type { ReviewRow, ReviewInsert } from "src/core/supabase/type.js";
import type { PaginatedResponse } from "./dto.js";

////////////////////////////////////////////// GET REVIEWS BY CARD ID
export interface GetReviewsByCardIdRouteHandler {
    cardId: string;
    deckId: string;
    userId: string;
    page: string | undefined;
    limit: string | undefined;
}

export type GetReviewsByCardIdRouteResponse = PaginatedResponse<ReviewRow>;


////////////////////////////////////////////// CREATE REVIEW
export interface CreateReviewRouteHandler {
    cardId: string;
    deckId: string;
    userId: string;
    data: ReviewInsert;
}

export type CreateReviewRouteResponse = ReviewRow;