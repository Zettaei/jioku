import type { DeckInsert, DeckUpdate, DeckRow } from "src/core/supabase/type.js";
import * as repository from "../repository/deck.js";


async function getDecksByUserId(userId: string): Promise<DeckRow[]> {
    return await repository.getDecksByUserId(userId);
}


async function getDeckById(userId: string, deckId: string): Promise<DeckRow | null> {
    return await repository.getDeckById(userId, deckId);
}


async function createDeck(userId: string, deck: Omit<DeckInsert, "users_id">): Promise<DeckRow> {
    const deckWithUserId: DeckInsert = {
        ...deck,
        users_id: userId
    };
    return await repository.createDeck(deckWithUserId);
}


async function updateDeck(userId: string, deckId: string, updates: DeckUpdate): Promise<DeckRow> {
    return await repository.updateDeck(deckId, userId, updates);
}


async function deleteDeck(userId: string, deckId: string): Promise<void> {
    return await repository.deleteDeck(deckId, userId);
}


export {
    getDecksByUserId,
    getDeckById,
    createDeck,
    updateDeck,
    deleteDeck
}
