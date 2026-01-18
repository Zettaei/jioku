import type { CardInsert, CardUpdate, CardRow, DeckRow } from "src/core/supabase/type.js";
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


/**
 * convert the column Id uses in deck.headersData, deck.headerOrder and card.data(?)
 * @sideeffect mutate "cardData" that being passed as a parameter
 */
function removePrunedCardColumn(cardData: CardUpdate, deckHeaderOrder: DeckRow["headersorder"]) 
: void
{
    const currentCardData = cardData as Record<string, string>;
    const newCardData: Record<string, string> = {};

    (deckHeaderOrder as Array<string>).forEach((headerKey) => {
        const val = currentCardData[headerKey];

        if(val === undefined) return;

        newCardData[headerKey] = val;
    })

    cardData = newCardData;
}

async function updateCard(userId: string, cardId: string, deckId: string, updatedCardData: CardUpdate, deckHeaderOrder: DeckRow["headersorder"])
: Promise<CardRow> 
{
    if(updatedCardData.data) {
        removePrunedCardColumn(updatedCardData, deckHeaderOrder);
    }
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
