import type { CardInsert, CardUpdate, CardRow } from "src/core/supabase/type.js";
import * as repository from "../repository/card.js";


async function getCardsByDeckId(deckId: string): Promise<CardRow[]> {
    return await repository.getCardsByDeckId(deckId);
}


async function getCardById(cardId: string, deckId: string): Promise<CardRow | null> {
    return await repository.getCardById(cardId, deckId);
}


async function createCard(deckId: string, card: Omit<CardInsert, "decks_id">): Promise<CardRow> {
    const cardWithDeckId: CardInsert = {
        ...card,
        decks_id: deckId
    };
    return await repository.createCard(cardWithDeckId);
}


async function updateCard(cardId: string, deckId: string, updates: CardUpdate): Promise<CardRow> {
    return await repository.updateCard(cardId, deckId, updates);
}


async function deleteCard(cardId: string, deckId: string): Promise<void> {
    return await repository.deleteCard(cardId, deckId);
}


export {
    getCardsByDeckId,
    getCardById,
    createCard,
    updateCard,
    deleteCard
}
