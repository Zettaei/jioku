import { DECK_OPTIONS } from "src/config.js";
import * as service from "../service/card.js";
import type {
    GetCardsByDeckIdRouteHandler,
    GetCardsByDeckIdRouteResponse,
    GetCardByIdRouteHandler,
    GetCardByIdRouteResponse,
    CreateCardRouteHandler,
    CreateCardRouteResponse,
    UpdateCardRouteHandler,
    UpdateCardRouteResponse,
    DeleteCardsRouteHandler,
    DeleteCardsRouteResponse
} from "../type/card_dto.js";
import { BadRequestError } from "src/core/errors/httpError.js";


async function getCardsByDeckIdRouteHandler(req: GetCardsByDeckIdRouteHandler)
: Promise<GetCardsByDeckIdRouteResponse>
{
    const pageNum = Number(req.page);
    const limitNum = Number(req.limit);

    const safePage =
        (Number.isInteger(pageNum) && pageNum > 0 && pageNum)
        ? pageNum : undefined;

    const safeLimit =
        (Number.isInteger(limitNum) && limitNum > 0 && limitNum <= DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT)
        ? limitNum : undefined;
    
    return await service.getCardsByDeckId(req.userId, req.deckId, safePage, safeLimit);
}


async function getCardByIdRouteHandler(req: GetCardByIdRouteHandler)
: Promise<GetCardByIdRouteResponse>
{
    const card = await service.getCardById(req.userId, req.cardId, req.deckId);
    if (!card) return null;
    return card;
}


async function createCardRouteHandler(req: CreateCardRouteHandler)
: Promise<CreateCardRouteResponse>
{
    if(!req.body.card) {
        throw new BadRequestError("Invalid JSON")
    }

    const card = await service.createCard(req.userId, req.deckId, req.body.card);
    return card;
}


async function updateCardRouteHandler(req: UpdateCardRouteHandler)
: Promise<UpdateCardRouteResponse>
{
    if(!req.body.card || !req.body.deckHeaderOrder) {
        throw new BadRequestError("Invalid JSON")
    }

    const card = await service.updateCard(req.userId, req.cardId, req.deckId, req.body.card, req.body.deckHeaderOrder);
    return card;
}


async function deleteCardsRouteHandler(req: DeleteCardsRouteHandler)
: Promise<DeleteCardsRouteResponse>
{
    await service.deleteCard(req.userId, req.cardIds, req.deckId);
    return {};
}


export {
    getCardsByDeckIdRouteHandler,
    getCardByIdRouteHandler,
    createCardRouteHandler,
    updateCardRouteHandler,
    deleteCardsRouteHandler,
}
