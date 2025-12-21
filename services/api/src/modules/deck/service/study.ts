import type { CardRow } from "src/core/supabase/type.js";
import * as repository from "../repository/study.js";
import type { PaginatedResponse } from "../type/dto.js";


async function getStudyCardsByDeckId(userId: string, deckId: string, page: number | undefined, limit: number | undefined, status: number | undefined)
: Promise<PaginatedResponse<CardRow>>
{
    const data = await repository.getStudyCardsByDeckId(userId, deckId, page, limit, status);

    return {
        result: data.result,
        pagination: data.pagination
    };
}


export {
    getStudyCardsByDeckId
}
