import type { CardRow, CardInsert, CardUpdate } from "src/core/supabase/type.js";

export interface CardsPaginatedResponse<T> {
    result: Array<T>;
    pagination: {
        page: number,
        limit: number,
        hasNext: boolean
    }
}

////////////////////////////////////////////// GET CARDS BY DECK ID
export interface GetCardsByDeckIdRouteHandler {
    deckId: string;
    userId: string;
    page: string | undefined;
    limit: string | undefined;
}

export type GetCardsByDeckIdRouteResponse = CardsPaginatedResponse<CardRow>;


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

export type DeleteCardRouteResponse = Record<string, never>;
