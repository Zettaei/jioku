import type { CardInsert, CardUpdate, CardRow } from "src/core/supabase/type.js";
import * as repository from "../repository/card.js";
import type { PaginatedResponseWithTotalCount } from "../type/dto.js";


async function getCardsByDeckId(userId: string, deckId: string, page: number | undefined, limit: number | undefined)
: Promise<PaginatedResponseWithTotalCount<CardRow>>
{
    const data = await repository.getCardsByDeckId(userId, deckId, page, limit);

    return data;
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


async function deleteCard(userId: string, cardIds: Array<string>, deckId: string)
: Promise<void> 
{
    return await repository.deleteCards(userId, cardIds, deckId);
}

export {
    getCardsByDeckId,
    getCardById,
    createCard,
    updateCard,
    deleteCard,
}
