import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { BadRequestError, ConnectionError, HttpError } from "$lib/errors/HttpError";
import type { CardRow } from "$lib/types/server/core/supabase/type";
import type { GetCardsByDeckIdRouteResponse } from "$lib/types/server/modules/deck/type/card_dto";
import type { GetDeckByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";

export async function fetchCardsByDeckId(deckId: string, page: number = 0, limit: number | undefined)
: Promise< GetCardsByDeckIdRouteResponse >
{
    if(!deckId) throw new BadRequestError("Missing deck id to fetching cards data");

    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/cards?page=${page}` + (limit ? `&limit=${limit}` : ''),
                // {
                //     credentials: "include",
                // }
            )
    
            if (!fetchData.ok) {
                throw new HttpError(fetchData.status);
            }
    
            return await fetchData.json() as GetCardsByDeckIdRouteResponse;
    
        } catch (err) {
            if (err instanceof HttpError) throw err;
    
            throw new ConnectionError();
        }
}


export async function fetchDeckByDeckId(deckId: string)
: Promise< GetDeckByIdRouteResponse >
{
    if(!deckId) throw new BadRequestError("Missing deck id to fetching cards data");

    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}`,
                // {
                //     credentials: "include",
                // }
            )
    
            if (!fetchData.ok) {
                throw new HttpError(fetchData.status);
            }
    
            return await fetchData.json();
    
        } catch (err) {
            if (err instanceof HttpError) throw err;
    
            throw new ConnectionError();
        }
}


export async function addCardToDeckId(deckId: string | undefined, cardData: Pick<CardRow, "data">)
: Promise<void>
{
    if(!deckId || !cardData) throw new BadRequestError("Missing deck id");

    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/cards`,
                {
                    method: "POST",
                    body: JSON.stringify(cardData)
                }
            )
    
            if (!fetchData.ok) {
                throw new HttpError(fetchData.status);
            }
    
            return;
    
        } catch (err) {
            if (err instanceof HttpError) throw err;
    
            throw new ConnectionError();
        }
}


export async function updateCard(deckId: string, cardId: string, cardData: Pick<CardRow, "data">)
: Promise<void>
{
    if(!deckId || !cardId || !cardData) throw new BadRequestError("Missing deck id, card id, or card data");

    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/cards/${cardId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(cardData)
                }
            )
    
            if (!fetchData.ok) {
                throw new HttpError(fetchData.status);
            }

            return;
    
        } catch (err) {
            if (err instanceof HttpError) throw err;
    
            throw new ConnectionError();
        }
}


export async function deleteCard(deckId: string, cardIds: Array<string>)
: Promise<void>
{
    if(!deckId || !cardIds) throw new BadRequestError("Missing deck id or card id");

    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/cards?` + (cardIds.map((cardId) => ("cardId="+cardId)).join('&')),
                {
                    method: "DELETE"
                }
            );
    
            if (!fetchData.ok) {
                throw new HttpError(fetchData.status);
            }

            return;
    
        } catch (err) {
            if (err instanceof HttpError) throw err;
    
            throw new ConnectionError();
        }
}