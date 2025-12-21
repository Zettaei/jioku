import * as service from "../service/study.js";
import type {
    GetStudyCardsByDeckIdRouteHandler,
    GetStudyCardsByDeckIdRouteResponse
} from "../type/study_dto.js";


async function getStudyCardsByDeckIdRouteHandler(req: GetStudyCardsByDeckIdRouteHandler)
: Promise<GetStudyCardsByDeckIdRouteResponse>
{
    const pageNum = Number(req.page);
    const limitNum = Number(req.limit);
    const statusNum = Number(req.status);

    const safePage =
        Number.isInteger(pageNum) && pageNum > 0 ? pageNum : undefined;

    const safeLimit =
        Number.isInteger(limitNum) && limitNum > 0 ? limitNum : undefined;

    const safeStatus = 
        Number.isInteger(statusNum) && statusNum > 0 ? statusNum : undefined;
    
    return await service.getStudyCardsByDeckId(req.userId, req.deckId, safePage, safeLimit, safeStatus);
}


export {
    getStudyCardsByDeckIdRouteHandler
}
