import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { BadRequestError, ConnectionError, HttpError } from "$lib/errors/HttpError";
import type { CardUpdate } from "$lib/types/server/core/supabase/type";
import type { GetCardsByDeckIdRouteResponse } from "$lib/types/server/modules/deck/type/card_dto";

export async function fetchCardsByDeckId(
    deckId: string, page: number = 1, limit: number | undefined, 
    search: string | undefined, sortBy: string | undefined, sortAsc: boolean | undefined
): Promise< GetCardsByDeckIdRouteResponse >
{
    if(!deckId) throw new BadRequestError("Missing deck id to fetching cards data");

    const optionalParams = (limit ? `&limit=${limit}` : '') + 
                        (search ? `&search=${search}` : '') +
                        (sortBy ? `&sortby=${sortBy}` : '') +
                        (sortAsc !== undefined ? `&sortasc=${sortAsc}` : '');

    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/cards?page=${page}` + optionalParams,
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

export async function addCardToDeckId(deckId: string | undefined, card: Record<string, string>)
: Promise<void>
{
    if(!deckId || !card) throw new BadRequestError("Missing deck id");

    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/cards`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        card
                    })
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


export async function updateCard(deckId: string, cardId: string, card: CardUpdate, deckHeaderOrder: Array<string>)
: Promise<void>
{
    if(!deckId || !cardId || !card || !deckHeaderOrder) throw new BadRequestError("Missing deck id, card id, or card data");

    try {
            const fetchData = await fetch(
                `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/cards/${cardId}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        card,
                        deckHeaderOrder
                    })
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