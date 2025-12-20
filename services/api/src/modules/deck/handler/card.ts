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
    DeleteCardRouteHandler,
    DeleteCardRouteResponse
} from "../type/card_dto.js";


async function getCardsByDeckIdRouteHandler(req: GetCardsByDeckIdRouteHandler)
: Promise<GetCardsByDeckIdRouteResponse>
{
    const pageNum = Number(req.page);
    const limitNum = Number(req.limit);

    const safePage =
        Number.isInteger(pageNum) && pageNum > 0 ? pageNum : undefined;

    const safeLimit =
        Number.isInteger(limitNum) && limitNum > 0 ? limitNum : undefined;
    
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
    const card = await service.createCard(req.userId, req.deckId, req.data);
    return card;
}


async function updateCardRouteHandler(req: UpdateCardRouteHandler)
: Promise<UpdateCardRouteResponse>
{
    const card = await service.updateCard(req.userId, req.cardId, req.deckId, req.data);
    return card;
}


async function deleteCardRouteHandler(req: DeleteCardRouteHandler)
: Promise<DeleteCardRouteResponse>
{
    await service.deleteCard(req.userId, req.cardId, req.deckId);
    return {};
}


export {
    getCardsByDeckIdRouteHandler,
    getCardByIdRouteHandler,
    createCardRouteHandler,
    updateCardRouteHandler,
    deleteCardRouteHandler
}
