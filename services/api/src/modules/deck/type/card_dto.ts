import type { CardRow, CardInsert, CardUpdate } from "src/core/supabase/type.js";
import type { PaginatedResponse } from "./dto.js";

////////////////////////////////////////////// GET CARDS BY DECK ID
export interface GetCardsByDeckIdRouteHandler {
    userId: string;
    deckId: string;
    page: string | undefined;
    limit: string | undefined;
}

export type GetCardsByDeckIdRouteResponse = PaginatedResponse<CardRow>;


////////////////////////////////////////////// GET CARD BY ID
export interface GetCardByIdRouteHandler {
    userId: string;
    deckId: string;
    cardId: string;
}

export type GetCardByIdRouteResponse = CardRow | null;


////////////////////////////////////////////// CREATE CARD
export interface CreateCardRouteHandler {
    userId: string;
    deckId: string;
    data: CardInsert;
}

export type CreateCardRouteResponse = CardRow;


////////////////////////////////////////////// UPDATE CARD
export interface UpdateCardRouteHandler {
    userId: string;
    deckId: string;
    cardId: string;
    data: CardUpdate;
}

export type UpdateCardRouteResponse = CardRow;


////////////////////////////////////////////// DELETE CARD
export interface DeleteCardRouteHandler {
    userId: string;
    deckId: string;
    cardId: string;
}

export type DeleteCardRouteResponse = {};
