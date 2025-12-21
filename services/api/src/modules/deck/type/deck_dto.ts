import type { DeckRow, DeckInsert, DeckUpdate } from "src/core/supabase/type.js";
import type { PaginatedResponse } from "./dto.js";

export const DeckResponseHiddenColumn = { "users_id": "users_id" } as const;
export type DeckResponseHiddenColumn = typeof DeckResponseHiddenColumn[keyof typeof DeckResponseHiddenColumn];

////////////////////////////////////////////// GET DECKS
export interface GetDecksRouteHandler {
    userId: string;
    page: string | undefined;
    limit: string | undefined;
}

export type GetDecksRouteResponse = PaginatedResponse<Omit<DeckRow, DeckResponseHiddenColumn>>;


////////////////////////////////////////////// GET DECK BY ID
export interface GetDeckByIdRouteHandler {
    userId: string;
    deckId: string;
}

export type GetDeckByIdRouteResponse = Omit<DeckRow, DeckResponseHiddenColumn> | null;


////////////////////////////////////////////// CREATE DECK
export interface CreateDeckRouteHandler {
    userId: string;
    data: DeckInsert;
}

export type CreateDeckRouteResponse = Omit<DeckRow, DeckResponseHiddenColumn>;


////////////////////////////////////////////// UPDATE DECK
export interface UpdateDeckRouteHandler {
    userId: string;
    deckId: string;
    data: DeckUpdate;
}

export type UpdateDeckRouteResponse = Omit<DeckRow, DeckResponseHiddenColumn>;


////////////////////////////////////////////// DELETE DECK
export interface DeleteDeckRouteHandler {
    userId: string;
    deckId: string;
}

export type DeleteDeckRouteResponse = {};