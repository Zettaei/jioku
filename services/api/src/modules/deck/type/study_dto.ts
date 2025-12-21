import type { CardRow } from "src/core/supabase/type.js";
import type { PaginatedResponse } from "./dto.js";

////////////////////////////////////////////// GET STUDY CARDS BY DECK ID
export interface GetStudyCardsByDeckIdRouteHandler {
    deckId: string;
    userId: string;
    page: string | undefined;
    limit: string | undefined;
    status: string | undefined;
}

export type GetStudyCardsByDeckIdRouteResponse = PaginatedResponse<CardRow>;

