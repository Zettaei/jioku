import type { CardRow, CardInsert, CardUpdate, DeckRow } from "src/core/supabase/type.js";
import type { PaginatedResponseWithTotalCount } from "./dto.js";

////////////////////////////////////////////// GET CARDS BY DECK ID
export interface GetCardsByDeckIdRouteHandler {
    userId: string;
    deckId: string;
    page: string | undefined;
    limit: string | undefined;
    search: string | undefined;
    sortby: string | undefined;
    sortasc: boolean;
}

export type GetCardsByDeckIdRouteResponse = PaginatedResponseWithTotalCount<CardRow>;


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
    body: {
        card: CardInsert
    };
}

export type CreateCardRouteResponse = CardRow;


////////////////////////////////////////////// UPDATE CARD
export interface UpdateCardRouteHandler {
    userId: string;
    deckId: string;
    cardId: string;
    body: {
        card: CardInsert
        deckHeaderOrder: DeckRow["headersorder"]
    };
}

export type UpdateCardRouteResponse = CardRow;


////////////////////////////////////////////// DELETE CARDS
export interface DeleteCardsRouteHandler {
    userId: string;
    deckId: string;
    cardIds: Array<string>;
}

export type DeleteCardsRouteResponse = {};
