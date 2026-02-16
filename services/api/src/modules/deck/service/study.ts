import * as repository from "../repository/study.js";
import * as cardRepository from "../repository/card.js";
import type { GetDecksStudyRouteResponse, GetStudyCardsByDeckIdRouteResponse, GetStudyCardsByStatusAndDeckIdRouteResponse, UpdateCardAndReviewRouteResponse } from "../type/study_dto.js";
import type { DeckRow } from "src/core/supabase/type.js";


async function getStudyDecks(userId: string, page: number | undefined, limit: number | undefined, timezone: string | undefined, search: string = "", sortby: keyof DeckRow | (string & {}), sortasc: boolean)
: Promise<GetDecksStudyRouteResponse>
{
    const data = await repository.getStudyDecks(userId, page, limit, timezone, search, sortby, sortasc);

    return data;
}


async function getStudyCardsByDeckId(userId: string, deckId: string, timezone: string | undefined, limit: number | undefined, offset: number | undefined)
: Promise<GetStudyCardsByDeckIdRouteResponse>
{
    const data = await repository.getStudyCardsByDeckId(userId, deckId, timezone, limit, offset);

    return data;
}

async function getStudyCardsByStatusAndDeckId(userId: string, deckId: string, timezone: string | undefined, status: number | undefined, limit: number | undefined, offset: number | undefined)
: Promise<GetStudyCardsByStatusAndDeckIdRouteResponse>
{
    const data = await repository.getStudyCardsByStatusAndDeckId(userId, deckId, timezone, status, limit, offset);

    return data;
}

async function updateCardAndReview(userId: string, deckId: string, cardId: string, timeSpent: number, quality: number)
: Promise<UpdateCardAndReviewRouteResponse>
{
    const data = await repository.updateCardAndReview(
        userId,
        deckId,
        cardId,
        timeSpent,
        quality
    );

    return data;
}


export {
    getStudyDecks,
    getStudyCardsByDeckId,
    getStudyCardsByStatusAndDeckId,
    updateCardAndReview
}
