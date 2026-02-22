import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { BadRequestError, ConnectionError, HttpError } from "$lib/errors/HttpError";
import type { GetDeckStatusByIdRouteResponse, GetRetentionRateByDateRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";


export async function fetchStatus(deckId: string, timezone: string)
: Promise<GetDeckStatusByIdRouteResponse> 
{
    if(!deckId) {
        throw new BadRequestError("Missing deckId");
    }

    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/status?timezone=${timezone}`,
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

export async function fetchRetentionRateByDate(deckId: string, timezone: string, from?: string | undefined, to?: string | undefined)
: Promise<GetRetentionRateByDateRouteResponse> 
{
    if(!deckId) {
        throw new BadRequestError("Missing deckId");
    }
    if(!timezone) {
        throw new BadRequestError("Missing timezone");
    }
    
    const optional = from ? `&from=${from}` : '' + to ? `&to=${to}` : '';

    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/deck/decks/${deckId}/status/retentionrate?timezone=${timezone}` + optional,
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