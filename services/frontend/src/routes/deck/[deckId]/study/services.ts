import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { STUDY_OPTIONS } from "$lib/constant/options";
import { BadRequestError, ConnectionError, HttpError } from "$lib/errors/HttpError";
import { userState } from "$lib/global/userState.svelte";
import type { CardStatusType } from "$lib/types/server/modules/deck/type/model";
import type { GetStudyCardsByDeckIdRouteResponse, GetStudyCardsByStatusAndDeckIdRouteResponse } from "$lib/types/server/modules/deck/type/study_dto";


// NOTE: I forgor to add resource to the route (/cards at the end, before the parameters)
export async function fetchCardsOnStart(deckId: string, timezone: string, offset: number = 0, limit: number = STUDY_OPTIONS.CARD_FETCH_LIMIT)
: Promise<GetStudyCardsByDeckIdRouteResponse> {
    if (!deckId) throw new BadRequestError("Missing deck id to fetching cards data");
    if (!timezone) throw new BadRequestError("Missing timezone parameter");

    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/deck/study/decks/${deckId}?timezone=${timezone}&offset=${offset}&limit=${limit}`,
            // {
            //     credentials: "include",
            // }
        );

        if (!fetchData.ok) {
            throw new HttpError(fetchData.status);
        }

        return await fetchData.json() as GetStudyCardsByDeckIdRouteResponse;

    } catch (err) {
        if (err instanceof HttpError) throw err;

        throw new ConnectionError();
    }
}


export async function fetchCardsByStatus(deckId: string, cardStatus: CardStatusType, timezone: string, offset: number = 0, limit: number = STUDY_OPTIONS.CARD_FETCH_LIMIT)
: Promise<GetStudyCardsByStatusAndDeckIdRouteResponse> {
    if (!deckId) throw new BadRequestError("Missing deck id to fetching cards data");
    if (!timezone) throw new BadRequestError("Missing timezone parameter");

    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/deck/study/decks/${deckId}/${cardStatus}?timezone=${timezone}&offset=${offset}&limit=${limit}`,
            // {
            //     credentials: "include",
            // }
        );

        if (!fetchData.ok) {
            throw new HttpError(fetchData.status);
        }

        return await fetchData.json() as GetStudyCardsByStatusAndDeckIdRouteResponse;

    } catch (err) {
        if (err instanceof HttpError) throw err;

        throw new ConnectionError();
    }
}


export async function submitCardReview(deckId: string, cardId: string, payload: { timeSpent: number, quality: number })
: Promise<void> {
    if (!deckId) throw new BadRequestError("Missing deck id for the card");
    if (!cardId) throw new BadRequestError("Missing card id to update");
    if (!payload) throw new BadRequestError("Missing payload");
    if(isNaN(Number(payload.timeSpent)) || isNaN(Number(payload.quality))) throw new BadRequestError("Incorrect payload") 

    try {
        const fetchData = await fetch(
            `${PUBLIC_BACKEND_URL}/deck/study/decks/${deckId}/cards/${cardId}`,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
            // {
            //     credentials: "include",
            // }
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