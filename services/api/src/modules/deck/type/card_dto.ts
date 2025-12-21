import type { CardRow, CardInsert, CardUpdate } from "src/core/supabase/type.js";
import type { PaginatedResponse } from "./dto.js";

////////////////////////////////////////////// GET CARDS BY DECK ID
export interface GetCardsByDeckIdRouteHandler {
    deckId: string;
    userId: string;
    page: string | undefined;
    limit: string | undefined;
}

export type GetCardsByDeckIdRouteResponse = PaginatedResponse<CardRow>;


////////////////////////////////////////////// GET CARD BY ID
export interface GetCardByIdRouteHandler {
    cardId: string;
    deckId: string;
    userId: string;
}

export type GetCardByIdRouteResponse = CardRow | null;


////////////////////////////////////////////// CREATE CARD
export interface CreateCardRouteHandler {
    deckId: string;
    userId: string;
    data: CardInsert;
}

export type CreateCardRouteResponse = CardRow;


////////////////////////////////////////////// UPDATE CARD
export interface UpdateCardRouteHandler {
    cardId: string;
    deckId: string;
    userId: string;
    data: CardUpdate;
}

export type UpdateCardRouteResponse = CardRow;


////////////////////////////////////////////// DELETE CARD
export interface DeleteCardRouteHandler {
    cardId: string;
    deckId: string;
    userId: string;
}

export type DeleteCardRouteResponse = {};
