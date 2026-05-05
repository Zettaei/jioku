import { BadRequestError, ConnectionError, HttpError } from "$lib/errors/HttpError";
import { userStore } from "$lib/stores/auth";
import { get } from "svelte/store";
import type { DeckEditableData } from "$lib/types/deck";
import type { GetDeckByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
import type { GetDecksStudyRouteResponse } from "$lib/types/server/modules/deck/type/study_dto";
import { ENV_VARS } from "$lib/constant/env";


export async function fetchUserStudyDecks(
    page: number = 1, limit: number | undefined,
    search?: string | undefined, sortBy?: string | undefined, sortAsc?: boolean | undefined
): Promise< GetDecksStudyRouteResponse >
{
    const optionalParams = (limit ? `&limit=${limit}` : '') + 
                        (search ? `&search=${search}` : '') +
                        (sortBy ? `&sortby=${sortBy}` : '') +
                        (sortAsc !== undefined ? `&sortasc=${sortAsc}` : '');
    
    try {
            const fetchData = await fetch(
                `${ENV_VARS.PUBLIC_BACKEND_URL}/deck/study/decks?timezone=${get(userStore)?.timezone ?? "Asia/Bangkok"}&page=${page}` + optionalParams,
                {
                    credentials: "include"
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

export async function fetchUserDecksBareMinimum()
: Promise< GetDecksStudyRouteResponse >
{
    try {
            const fetchData = await fetch(
                `${ENV_VARS.PUBLIC_BACKEND_URL}/deck/decks`,
                {
                    credentials: "include"
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

export async function fetchDeckByDeckId(deckId: string)
: Promise< GetDeckByIdRouteResponse >
{
    if(!deckId) throw new BadRequestError("Missing deck id to fetching cards data");

    try {
        const fetchData = await fetch(
            `${ENV_VARS.PUBLIC_BACKEND_URL}/deck/decks/${deckId}`,
            {
                credentials: "include"
            }
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

export async function createDeck(deckData: DeckEditableData)
: Promise<void>
{
    if(!deckData.headersdata || !deckData.headersorder || !deckData.name) {
        throw new BadRequestError("Missing atleast one input");
    }

    try {
        const fetchData = await fetch(
            `${ENV_VARS.PUBLIC_BACKEND_URL}/deck/decks`,
            {
                credentials: "include",
                method: "POST",
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