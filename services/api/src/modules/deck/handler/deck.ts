import * as service from "../service/deck.js";
import type {
    GetDecksRouteHandler,
    GetDecksRouteResponse,
    GetDeckByIdRouteHandler,
    GetDeckByIdRouteResponse,
    CreateDeckRouteHandler,
    CreateDeckRouteResponse,
    UpdateDeckRouteHandler,
    UpdateDeckRouteResponse,
    DeleteDeckRouteHandler,
    DeleteDeckRouteResponse
} from "../type/deck_dto.js";


async function getDecksRouteHandler(
    req: GetDecksRouteHandler
): Promise<GetDecksRouteResponse> {
    return await service.getDecksByUserId(req.userId);
}


async function getDeckByIdRouteHandler(
    req: GetDeckByIdRouteHandler
): Promise<GetDeckByIdRouteResponse> {
    return await service.getDeckById(req.userId, req.deckId);
}


async function createDeckRouteHandler(
    req: CreateDeckRouteHandler
): Promise<CreateDeckRouteResponse> {
    return await service.createDeck(req.userId, req.data);
}


async function updateDeckRouteHandler(
    req: UpdateDeckRouteHandler
): Promise<UpdateDeckRouteResponse> {
    return await service.updateDeck(req.userId, req.deckId, req.data);
}


async function deleteDeckRouteHandler(
    req: DeleteDeckRouteHandler
): Promise<DeleteDeckRouteResponse> {
    await service.deleteDeck(req.userId, req.deckId);
    return {};
}


export {
    getDecksRouteHandler,
    getDeckByIdRouteHandler,
    createDeckRouteHandler,
    updateDeckRouteHandler,
    deleteDeckRouteHandler
}
