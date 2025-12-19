import type { DeckInsert, DeckUpdate, DeckRow } from "src/core/supabase/type.js";
import * as repository from "../repository/deck.js";
import * as util from "../util.js";
import type { DeckResponseHiddenColumn } from "../type/deck_dto.js";

async function getDecksByUserId(userId: string): Promise<Array<Omit<DeckRow, DeckResponseHiddenColumn>>> {
    const result = await repository.getDecksByUserId(userId);
    return result.map((deck) => util.removeHiddenColumn(deck));
}


async function getDeckById(userId: string, deckId: string): Promise<Omit<DeckRow, DeckResponseHiddenColumn> | null> {
    const result = await repository.getDeckById(userId, deckId);
    return result ? util.removeHiddenColumn(result) : null;
}


async function createDeck(userId: string, newDeck: DeckInsert): Promise<Omit<DeckRow, DeckResponseHiddenColumn>> {
    const deckWithUserId: DeckInsert = {
        ...newDeck,
        users_id: userId
    };
    const result = await repository.createDeck(deckWithUserId);
    
    return util.removeHiddenColumn(result);
}


async function updateDeck(userId: string, deckId: string, updates: DeckUpdate): Promise<Omit<DeckRow, DeckResponseHiddenColumn>> {
    const result = await repository.updateDeck(deckId, userId, updates);
    return util.removeHiddenColumn(result);
}


async function deleteDeck(userId: string, deckId: string): Promise<void> {
    await repository.deleteDeck(deckId, userId);
    return;
}


export {
    getDecksByUserId,
    getDeckById,
    createDeck,
    updateDeck,
    deleteDeck
}
