import type { DeckInsert, DeckUpdate, DeckRow } from "src/core/supabase/type.js";
import * as repository from "../repository/deck.js";
import * as util from "../util.js";
import type { DeckResponseHiddenColumn } from "../type/deck_dto.js";
import type { PaginatedResponse } from "../type/dto.js";

async function getDecksByUserId(userId: string, page: number | undefined, limit: number | undefined)
: Promise<PaginatedResponse<Omit<DeckRow, DeckResponseHiddenColumn>>>
{
    const data = await repository.getDecksByUserId(userId, page, limit);

    return {
        result: data.result.map((deck) => util.removeHiddenColumn(deck)),
        pagination: data.pagination
    };
}


async function getDeckById(userId: string, deckId: string)
: Promise<Omit<DeckRow, DeckResponseHiddenColumn> | null>
{
    const data = await repository.getDeckById(userId, deckId);
    return data ? util.removeHiddenColumn(data) : null;
}


async function createDeck(userId: string, newDeck: DeckInsert)
: Promise<Omit<DeckRow, DeckResponseHiddenColumn>> 
{
    const deckWithUserId: DeckInsert = {
        ...newDeck,
        users_id: userId
    };
    const data = await repository.createDeck(deckWithUserId);
    
    return util.removeHiddenColumn(data);
}


async function updateDeck(userId: string, deckId: string, updates: DeckUpdate)
: Promise<Omit<DeckRow, DeckResponseHiddenColumn>> 
{
    const data = await repository.updateDeck(deckId, userId, updates);
    return util.removeHiddenColumn(data);
}


async function deleteDeck(userId: string, deckId: string)
: Promise<void> 
{
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
