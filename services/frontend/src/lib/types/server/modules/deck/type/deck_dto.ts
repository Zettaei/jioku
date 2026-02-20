import type { DeckRow, DeckInsert, DeckUpdate } from "../../../core/supabase/type.js" 
import type { PaginatedResponse } from "./dto.js";
import type { CardsDueDistribution, CardsMaturityDistribution, CardsOverdueTotal, CardsStatusDistribution, CardsTotal, ReviewRetentionRate } from "./model.js";

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


////////////////////////////////////////////// GET DECK STATUS BY ID
export interface GetDeckStatusByIdRouteHandler {
    userId: string;
    deckId: string;
    timezone: string | undefined;
}

export interface DeckStatus {
    date: string;
    cards_status_distribution: CardsStatusDistribution;
    cards_maturity_distribution: CardsMaturityDistribution;
    cards_due_distribution: CardsDueDistribution;
    cards_overdue_total: CardsOverdueTotal;
    review_retention_rate: ReviewRetentionRate;
    cards_total: CardsTotal;
}

export type GetDeckStatusByIdRouteResponse = DeckStatus | null;


////////////////////////////////////////////// GET RETENTION RATE BY DATE
export interface GetRetentionRateByDateRouteHandler {
    userId: string;
    deckId: string;
    timezone: string | undefined;
    from: string | undefined;
    to: string | undefined;
}

export type GetRetentionRateByDateRouteResponse = ReviewRetentionRate;


////////////////////////////////////////////// GET DISTRIBUTION BY DATE
export interface GetDueDistributionByDateRouteHandler{
    userId: string;
    deckId: string;
    timezone: string | undefined;
    ahead_days: number | undefined;
}

export type GetDueDistributionByDateRouteResponse = CardsDueDistribution;