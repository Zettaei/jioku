import type { CardInsert, CardUpdate, CardRow } from "src/core/supabase/type.js";
import * as repository from "../repository/card.js";
import type { PaginatedResponse } from "../type/dto.js";


async function getCardsByDeckId(userId: string, deckId: string, page: number | undefined, limit: number | undefined)
: Promise<PaginatedResponse<CardRow>>
{
    const data = await repository.getCardsByDeckId(userId, deckId, page, limit);

    return {
        result: data.result,
        pagination: data.pagination
    };
}


async function getCardById(userId: string, cardId: string, deckId: string)
: Promise<CardRow | null>
{
    return await repository.getCardById(userId, cardId, deckId);
}


async function createCard(userId: string, deckId: string, newCardData: CardInsert)
: Promise<CardRow> 
{
    return await repository.createCard(userId, deckId, newCardData);
}


async function updateCard(userId: string, cardId: string, deckId: string, updatedCardData: CardUpdate)
: Promise<CardRow> 
{
    return await repository.updateCard(userId, cardId, deckId, updatedCardData);

}


async function deleteCard(userId: string, cardId: string, deckId: string)
: Promise<void> 
{
    return await repository.deleteCard(userId, cardId, deckId);
}


export {
    getCardsByDeckId,
    getCardById,
    createCard,
    updateCard,
    deleteCard
}
