import { DECK_OPTIONS } from "src/config.js";
import * as service from "../service/deck.js";
import type { GetDecksRouteHandler, GetDecksRouteResponse, GetDeckByIdRouteHandler, GetDeckByIdRouteResponse, GetDeckStatusByIdRouteHandler, GetDeckStatusByIdRouteResponse, GetRetentionRateByDateRouteHandler, GetRetentionRateByDateRouteResponse, CreateDeckRouteHandler,
CreateDeckRouteResponse, UpdateDeckRouteHandler, UpdateDeckRouteResponse, DeleteDeckRouteHandler, DeleteDeckRouteResponse } from "../type/deck_dto.js";
import { BadRequestError } from "src/errors/httpError.js";
import * as util from "../util.js";

async function getDecksRouteHandler(req: GetDecksRouteHandler)
: Promise<GetDecksRouteResponse> 
{
    const pageNum = Number(req.page);
    const limitNum = Number(req.limit);

    const safePage =
            (Number.isInteger(pageNum) && pageNum > 0 && pageNum)
            ? pageNum : undefined;
    
        const safeLimit =
            (Number.isInteger(limitNum) && limitNum > 0 && limitNum <= DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT)
            ? limitNum : undefined;

    return await service.getDecksByUserId(req.userId, safePage, safeLimit);
}


async function getDeckByIdRouteHandler(req: GetDeckByIdRouteHandler)
: Promise<GetDeckByIdRouteResponse> 
{
    const deck = await service.getDeckById(req.userId, req.deckId);
    if (!deck) return null;
    return deck;
}


async function getDeckStatusByIdRouteHandler(req: GetDeckStatusByIdRouteHandler)
: Promise<GetDeckStatusByIdRouteResponse> 
{
    const timezoneStr = req.timezone;

    if (!timezoneStr || typeof timezoneStr !== "string" || timezoneStr.length === 0) {
        throw new BadRequestError("Missing or invalid timezone parameter");
    }

    const deck = await service.getDeckStatusById(req.userId, req.deckId, timezoneStr);
    return deck;
}


async function getRetentionRateByDateRouteHandler(req: GetRetentionRateByDateRouteHandler)
: Promise<GetRetentionRateByDateRouteResponse> 
{
    const timezoneStr = req.timezone;
    const dateStr = req.date;

    if (!timezoneStr || typeof timezoneStr !== "string" || timezoneStr.length === 0) {
        throw new BadRequestError("Missing or invalid timezone parameter");
    }

    if (!dateStr || typeof dateStr !== "string" || dateStr.length !== 10) {
        throw new BadRequestError("Missing dateoffset parameter");
    }

    const result = await service.getRetentionRateByDate(req.userId, req.deckId, timezoneStr, dateStr);
    return result;
}


async function createDeckRouteHandler(req: CreateDeckRouteHandler)
: Promise<CreateDeckRouteResponse> 
{
    const deck = await service.createDeck(req.userId, req.data);
    return deck;
}


async function updateDeckRouteHandler(req: UpdateDeckRouteHandler)
: Promise<UpdateDeckRouteResponse> 
{
    const deck = await service.updateDeck(
        req.userId, 
        req.deckId, 
        req.data);
    return deck;
}


async function deleteDeckRouteHandler(req: DeleteDeckRouteHandler)
: Promise<DeleteDeckRouteResponse> 
{
    await service.deleteDeck(req.userId, req.deckId);
    return {};
}


export {
    getDecksRouteHandler,
    getDeckByIdRouteHandler,
    getDeckStatusByIdRouteHandler,
    getRetentionRateByDateRouteHandler,
    createDeckRouteHandler,
    updateDeckRouteHandler,
    deleteDeckRouteHandler
}
