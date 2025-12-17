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


async function getCardsByDeckIdRouteHandler(
    req: GetCardsByDeckIdRouteHandler
): Promise<GetCardsByDeckIdRouteResponse> {
    return await service.getCardsByDeckId(req.deckId);
}


async function getCardByIdRouteHandler(
    req: GetCardByIdRouteHandler
): Promise<GetCardByIdRouteResponse> {
    return await service.getCardById(req.cardId, req.deckId);
}


async function createCardRouteHandler(
    req: CreateCardRouteHandler
): Promise<CreateCardRouteResponse> {
    return await service.createCard(req.deckId, req.data);
}


async function updateCardRouteHandler(
    req: UpdateCardRouteHandler
): Promise<UpdateCardRouteResponse> {
    return await service.updateCard(req.cardId, req.deckId, req.data);
}


async function deleteCardRouteHandler(
    req: DeleteCardRouteHandler
): Promise<DeleteCardRouteResponse> {
    await service.deleteCard(req.cardId, req.deckId);
    return {};
}


export {
    getCardsByDeckIdRouteHandler,
    getCardByIdRouteHandler,
    createCardRouteHandler,
    updateCardRouteHandler,
    deleteCardRouteHandler
}
