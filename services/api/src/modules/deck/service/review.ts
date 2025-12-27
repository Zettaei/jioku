import type { ReviewInsert, ReviewRow } from "src/core/supabase/type.js";
import * as repository from "../repository/index.js";
import type { PaginatedResponse } from "../type/dto.js";
import { calculateSuperMemo2 } from "./algorithm.js";


async function getReviewsByCardId(userId: string, deckId: string, cardId: string, page: number | undefined, limit: number | undefined)
: Promise<PaginatedResponse<ReviewRow>>
{
    const data = await repository.getReviewsByCardId(userId, deckId, cardId, page, limit);

    return {
        result: data.result,
        pagination: data.pagination
    };
}


// async function createReview(userId: string, deckId: string, cardId: string, newReviewData: ReviewInsert)
// : Promise<ReviewRow> 
// {
//     const { review, card } = await repository.createReview(userId, deckId, cardId, newReviewData);

//     // const sm2Result = calculateSuperMemo2({
//     //     quality: newReviewData.quality,
//     //     easefactor: card.easefactor,
//     //     interval: card.interval,
//     //     repetition: card.repetition
//     // });

//     await repository.updateCard(userId, cardId, deckId, {
//         status: sm2Result.status,
//         due: sm2Result.due,
//         easefactor: sm2Result.easefactor,
//         interval: sm2Result.interval,
//         repetition: sm2Result.repetition,
//     });
    
//     return review;
// }



export {
    getReviewsByCardId,
    // createReview
}
