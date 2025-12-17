import * as service from "../service/deck.js";
import * as repository from "../repository/deck.js";
import type {
    GetDecksRouteHandler,
    GetDecksRouteResponse,
    GetDeckByIdRouteHandler,
    GetDeckByIdRouteResponse,
    CreateDeckRouteHandler,
    CreateDeckRouteResponse,
    UpdateDeckRouteHandler,
    UpdateDeckRouteResponse,
    DeleteDeckRouteHandler,
    DeleteDeckRouteResponse
} from "../type/deck_dto.js";
import type { DeckRow } from "src/core/supabase/type.js";


async function getDecksRouteHandler(req: GetDecksRouteHandler): Promise<Array<DeckRow>> {
    const userId = req.userId;
    return await repository.getDecksByUserId(userId);
}


async function getDeckByIdRouteHandler(req: GetDeckByIdRouteHandler): Promise<DeckRow | null> {
    const userId = req.userId;
    const deckId = req.deckId;
    return await repository.getDeckById(userId, deckId);
}


async function createDeckRouteHandler(userId: string, deck: Omit<DeckInsert, "users_id">): Promise<DeckRow> {
    const deckWithUserId: DeckInsert = {
        ...deck,
        users_id: userId
    };
    return await repository.createDeck(deckWithUserId);
}


async function updateDeckRouteHandler(userId: string, deckId: string, updates: DeckUpdate): Promise<DeckRow> {
    return await repository.updateDeck(deckId, userId, updates);
}


async function deleteDeckRouteHandler(userId: string, deckId: string): Promise<void> {
    return await repository.deleteDeck(deckId, userId);
}


export {
    getDecksRouteHandler,
    getDeckByIdRouteHandler,
    createDeckRouteHandler,
    updateDeckRouteHandler,
    deleteDeckRouteHandler
}
