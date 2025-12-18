import type { DeckRow, DeckInsert, DeckUpdate } from "src/core/supabase/type.js";

type DeckResponseHiddenColumn = Pick<DeckRow, "users_id">;
////////////////////////////////////////////// GET DECKS
export interface GetDecksRouteHandler {
    userId: string;
}

export type GetDecksRouteResponse = Array<Omit<DeckRow, keyof DeckResponseHiddenColumn>>;


////////////////////////////////////////////// GET DECK BY ID
export interface GetDeckByIdRouteHandler {
    userId: string;
    deckId: string;
}

export type GetDeckByIdRouteResponse = Omit<DeckRow, keyof DeckResponseHiddenColumn> | null;


////////////////////////////////////////////// CREATE DECK
export interface CreateDeckRouteHandler {
    userId: string;
    data: Omit<DeckInsert, "users_id">;
}

export type CreateDeckRouteResponse = Omit<DeckRow, keyof DeckResponseHiddenColumn>;


////////////////////////////////////////////// UPDATE DECK
export interface UpdateDeckRouteHandler {
    userId: string;
    deckId: string;
    data: DeckUpdate;
}

export type UpdateDeckRouteResponse = Omit<DeckRow, keyof DeckResponseHiddenColumn>;


////////////////////////////////////////////// DELETE DECK
export interface DeleteDeckRouteHandler {
    userId: string;
    deckId: string;
}

export type DeleteDeckRouteResponse = Record<string, never>;