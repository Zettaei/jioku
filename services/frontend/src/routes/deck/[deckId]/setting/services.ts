import { ENV_VARS } from "$lib/constant/env";
import { BadRequestError, ConnectionError, HttpError } from "$lib/errors/HttpError";
import type { DeckEditableData } from "$lib/types/deck";
import type { DeleteDeckRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";

export async function updateDeck(deckId: string, deckData: DeckEditableData)
: Promise<void>
{
    if(!deckData.headersdata || !deckData.headersorder || !deckData.name) {
        throw new BadRequestError("Missing atleast one input");
    }

    try {
        const fetchData = await fetch(
            `${ENV_VARS.PUBLIC_BACKEND_URL}/deck/decks/${deckId}`,
            {
                credentials: "include",
                method: "PUT",
                body: JSON.stringify(deckData)
            }
        );

        if (!fetchData.ok) {
            throw new HttpError(fetchData.status);
        }

        return await fetchData.json();

    } catch (err) {
        if (err instanceof HttpError) throw err;

        throw new ConnectionError();
    }
}


export async function deleteDeck(deckId: string)
: Promise<DeleteDeckRouteResponse>
{
    if(!deckId) {
        throw new BadRequestError("Missing deckId");
    }

    try {
        const fetchData = await fetch(
            `${ENV_VARS.PUBLIC_BACKEND_URL}/deck/decks/${deckId}`,
            {
                credentials: "include",
                method: "DELETE",
            }
        );

        if (!fetchData.ok) {
            throw new HttpError(fetchData.status);
        }

        return await fetchData.json();

    } catch (err) {
        if (err instanceof HttpError) throw err;

        throw new ConnectionError();
    }
}