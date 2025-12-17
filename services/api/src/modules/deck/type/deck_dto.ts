import type { DeckRow, DeckInsert, DeckUpdate } from "src/core/supabase/type.js";

////////////////////////////////////////////// GET DECKS
export interface GetDecksRouteHandler {
    userId: string;
}

export type GetDecksRouteResponse = DeckRow[];


////////////////////////////////////////////// GET DECK BY ID
export interface GetDeckByIdRouteHandler {
    userId: string;
    deckId: string;
}

export type GetDeckByIdRouteResponse = DeckRow | null;


////////////////////////////////////////////// CREATE DECK
export interface CreateDeckRouteHandler {
    userId: string;
    data: Omit<DeckInsert, "users_id">;
}

export type CreateDeckRouteResponse = DeckRow;


////////////////////////////////////////////// UPDATE DECK
export interface UpdateDeckRouteHandler {
    userId: string;
    deckId: string;
    data: DeckUpdate;
}

export type UpdateDeckRouteResponse = DeckRow;


////////////////////////////////////////////// DELETE DECK
export interface DeleteDeckRouteHandler {
    userId: string;
    deckId: string;
}

export type DeleteDeckRouteResponse = Record<string, never>;