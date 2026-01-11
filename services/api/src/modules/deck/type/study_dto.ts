import type { CardRow, DeckRow } from "src/core/supabase/type.js";
import type { PaginatedResponse, PaginatedResponseWithTotalCount } from "./dto.js";
import type { CardStatusType } from "./model.js";

export type GetStudyCardsBlock = {
  status: keyof typeof CardStatusType;
  status_code: CardStatusType;
  items: Array<CardRow>;
  total: number;
  offset: number;
};

////////////////////////////////////////////// GET DECKS STUDY
export interface GetDecksStudyRouteHandler {
    userId: string;
    page: string | undefined;
    limit: string | undefined;
    timezone: string | undefined;
}

export type GetDecksStudyRouteResponse = PaginatedResponseWithTotalCount<DeckRow & {
    today_dues: Array<{ status: CardStatusType, count: number }>
}>;

////////////////////////////////////////////// GET STUDY CARDS BY DECK ID
export interface GetStudyCardsByDeckIdRouteHandler {
    userId: string;
    deckId: string;
    timezone: string | undefined;
    limit: string | undefined;
    offset: string | undefined;
}

export type GetStudyCardsByDeckIdRouteResponse = Array<GetStudyCardsBlock>;

////////////////////////////////////////////// GET STUDY CARDS BY STATUS AND DECK ID
export interface GetStudyCardsByStatusAndDeckIdRouteHandler {
    userId: string;
    deckId: string;
    status: string;
    timezone: string | undefined;
    limit: string | undefined;
    offset: string | undefined;
}

export type GetStudyCardsByStatusAndDeckIdRouteResponse = GetStudyCardsBlock;

////////////////////////////////////////////// UPDATE CARD AND ADD REVIEW

export interface UpdateCardAndReviewRouteHandler {
    userId: string;
    deckId: string;
    cardId: string;
    timeSpent: number;
    quality: number;
}

export type UpdateCardAndReviewRouteResponse = CardRow;