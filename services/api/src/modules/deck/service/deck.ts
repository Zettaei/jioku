import type { DeckInsert, DeckUpdate, DeckRow } from "src/core/supabase/type.js";
import * as repository from "../repository/deck.js";
import * as util from "../util.js";
import type { DeckResponseHiddenColumn, GetDeckStatusByIdRouteResponse, GetRetentionRateByDateRouteResponse } from "../type/deck_dto.js";
import type { PaginatedResponse } from "../type/dto.js";
import { InternalError } from "src/errors/internalError.js";
import type { Json } from "src/core/supabase/generatedType.js";

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


async function getDeckStatusById(userId: string, deckId: string, timezone: string | undefined = undefined)
: Promise<GetDeckStatusByIdRouteResponse>
{
    const data = await repository.getDeckStatusById(userId, deckId, timezone);
    return data;
}


async function getRetentionRateByDate(userId: string, deckId: string, timezone: string, from: string, to: string)
: Promise<GetRetentionRateByDateRouteResponse>
{
    const data = await repository.getRetentionRateByDate(userId, deckId, timezone, from, to);
    return data;
}


/**
 * convert the column Id uses in deck.headersData, deck.headerOrder and card.data(?)
 * @sideeffect mutate the object being passe as a parameter
 */
function convertDeckColumnId(deck: Pick<DeckInsert, "headersdata" | "headersorder">) 
: void
{
    const oldData = deck.headersdata as Record<string, string>;
    const oldOrder = deck.headersorder as Array<string>;

    const newData: Record<string, string> = {};
    const newOrder: Array<string> = [];

    const retryGenIdTimes = 3;

    for (const header of oldOrder) {
        // If it's a number(whic is a temp ID), generate a new ID
        let finalId = isNaN(Number(header)) ? header : util.generateColumnId();
        
        // if it somehow collide, very less likely tho
        for(let i = 1; newOrder.includes(finalId); ++i) {
            if(i === retryGenIdTimes) { 
                throw new InternalError("An Error occured", "") 
            }
            finalId = util.generateColumnId();
        }
        newOrder.push(finalId);
        
        if (header in oldData) {
            newData[finalId] = oldData[header]!;
        }
    }

    deck.headersorder = newOrder;
    deck.headersdata = newData;
}


async function createDeck(userId: string, newDeck: DeckInsert)
: Promise<Omit<DeckRow, DeckResponseHiddenColumn>> 
{
    const deck: DeckInsert = { ...newDeck, users_id: userId };

    convertDeckColumnId(deck);

    const data = await repository.createDeck(deck);
    return util.removeHiddenColumn(data);
}


async function updateDeck(userId: string, deckId: string, updates: DeckUpdate)
: Promise<Omit<DeckRow, DeckResponseHiddenColumn>> 
{
    convertDeckColumnId(updates);

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
    deleteDeck,
    getDeckStatusById,
    getRetentionRateByDate
}
