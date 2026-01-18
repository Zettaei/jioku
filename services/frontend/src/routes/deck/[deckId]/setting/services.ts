import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { BadRequestError, ConnectionError, HttpError } from "$lib/errors/HttpError";
import type { DeckEditableData } from "$lib/types/deck";

// NOTE: make it actually delete the key instead of just leave it there
export async function updateDeck(deckId: string, deckData: DeckEditableData)
: Promise<void>
{
    if(!deckData.headersdata || !deckData.headersorder || !deckData.name) {
        throw new BadRequestError("Missing atleast one input");
    }

    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}`,
            {
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


export async function deleteDeck(deckId: string) {
    if(!deckId) {
        throw new BadRequestError("Missing deckId");
    }

    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}`,
            {
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