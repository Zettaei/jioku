import { BadRequestError } from "src/core/errors/httpError.js";
import * as service from "../service/study.js";
import type {
    GetDecksStudyRouteHandler,
    GetDecksStudyRouteResponse,
    GetStudyCardsByDeckIdRouteHandler,
    GetStudyCardsByStatusAndDeckIdRouteHandler,
    GetStudyCardsByDeckIdRouteResponse,
    GetStudyCardsByStatusAndDeckIdRouteResponse,
    UpdateCardAndReviewRouteHandler,
    UpdateCardAndReviewRouteResponse
} from "../type/study_dto.js";
import { DECK_OPTIONS } from "src/config.js";


async function getDecksStudyRouteHandler(req: GetDecksStudyRouteHandler)
: Promise<GetDecksStudyRouteResponse>
{
    const pageNum = Number(req.page);
    const limitNum = Number(req.limit);
    const timezoneStr = req.timezone;

    const safePage =
        (Number.isInteger(pageNum) && pageNum > 0 && pageNum)
        ? pageNum : undefined;
    
    const safeLimit =
        (Number.isInteger(limitNum) && limitNum > 0 && limitNum <= DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT)
        ? limitNum : undefined;

    const safeTimezone =
        typeof timezoneStr === "string" && timezoneStr.length > 0 ? timezoneStr : undefined;
    
    return await service.getStudyDecks(req.userId, safePage, safeLimit, safeTimezone);
}


async function getStudyCardsByDeckIdRouteHandler(req: GetStudyCardsByDeckIdRouteHandler)
: Promise<GetStudyCardsByDeckIdRouteResponse>
{
    const timezoneStr = req.timezone;
    const limitNum = Number(req.limit);
    const offsetNum = Number(req.offset);

    const safeTimezone =
        typeof timezoneStr === "string" && timezoneStr.length > 0 ? timezoneStr : undefined;

    const safeLimit =
        Number.isInteger(limitNum) && limitNum > 0 && limitNum <= DECK_OPTIONS.STUDY_CARD_FETCH_LIMIT ? limitNum : undefined;

    const safeOffset =
        Number.isInteger(offsetNum) && offsetNum >= 0 ? offsetNum : undefined;
    
    return await service.getStudyCardsByDeckId(req.userId, req.deckId, safeTimezone, safeLimit, safeOffset);
}

async function getStudyCardsByStatusDeckIdRouteHandler(req: GetStudyCardsByStatusAndDeckIdRouteHandler)
: Promise<GetStudyCardsByStatusAndDeckIdRouteResponse>
{
    const timezoneStr = req.timezone;
    const statusNum = Number(req.status);
    const limitNum = Number(req.limit);
    const offsetNum = Number(req.offset);

    const safeTimezone =
        typeof timezoneStr === "string" && timezoneStr.length > 0 ? timezoneStr : undefined;

    const safeStatus =
        Number.isInteger(statusNum) && statusNum >= 0 ? statusNum : undefined;

    const safeLimit =
        Number.isInteger(limitNum) && limitNum > 0 && limitNum <= DECK_OPTIONS.STUDY_CARD_FETCH_LIMIT ? limitNum : undefined;

    const safeOffset =
        Number.isInteger(offsetNum) && offsetNum >= 0 ? offsetNum : undefined;
    
    return await service.getStudyCardsByStatusAndDeckId(req.userId, req.deckId, safeTimezone, safeStatus, safeLimit, safeOffset);
}

async function updateCardAndReviewRouteHandler(req: UpdateCardAndReviewRouteHandler)
: Promise<UpdateCardAndReviewRouteResponse>
{
    const timeSpentNum = Number(req.timeSpent);
    const qualityNum = Number(req.quality);

    const safeTimeSpent =
        Number.isInteger(timeSpentNum) && timeSpentNum >= 0 ? timeSpentNum : undefined;

    const safeQuality =
        Number.isInteger(qualityNum) && qualityNum >= 0 && qualityNum <= 5 ? qualityNum : undefined;
    
    if(!safeTimeSpent) throw new BadRequestError("Missing or incorrect value for query 'timeSpent'");
    if(!safeQuality) throw new BadRequestError("Missing or incorrect value for query 'quality'");

    return await service.updateCardAndReview(
        req.userId,
        req.deckId,
        req.cardId,
        safeTimeSpent,
        safeQuality
    );
}


export {
    getDecksStudyRouteHandler,
    getStudyCardsByDeckIdRouteHandler,
    getStudyCardsByStatusDeckIdRouteHandler,
    updateCardAndReviewRouteHandler
}
