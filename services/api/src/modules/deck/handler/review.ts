import * as service from "../service/review.js";
import type {
    GetReviewsByCardIdRouteHandler,
    GetReviewsByCardIdRouteResponse,
    CreateReviewRouteHandler,
    CreateReviewRouteResponse,
} from "../type/review_dto.js";


async function getReviewsByCardIdRouteHandler(req: GetReviewsByCardIdRouteHandler)
: Promise<GetReviewsByCardIdRouteResponse>
{
    const pageNum = Number(req.page);
    const limitNum = Number(req.limit);

    const safePage =
        Number.isInteger(pageNum) && pageNum > 0 ? pageNum : undefined;

    const safeLimit =
        Number.isInteger(limitNum) && limitNum > 0 ? limitNum : undefined;
    
    return await service.getReviewsByCardId(req.userId, req.deckId, req.cardId, safePage, safeLimit);
}


// async function createReviewRouteHandler(req: CreateReviewRouteHandler)
// : Promise<CreateReviewRouteResponse>
// {
//     const review = await service.createReview(req.userId, req.deckId, req.cardId, req.data);
//     return review;
// }


// async function deleteReviewRouteHandler(req: DeleteReviewRouteHandler)
// : Promise<DeleteReviewRouteResponse>
// {
//     await service.deleteReview(req.userId, req.deckId, req.cardId);
//     return {};
// }


export {
    getReviewsByCardIdRouteHandler,
    // createReviewRouteHandler,
    // deleteReviewRouteHandler
}
