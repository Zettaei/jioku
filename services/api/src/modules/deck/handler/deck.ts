import * as service from "../service/deck.js";
import type { GetDecksRouteHandler, GetDecksRouteResponse, GetDeckByIdRouteHandler, GetDeckByIdRouteResponse, CreateDeckRouteHandler,
CreateDeckRouteResponse, UpdateDeckRouteHandler, UpdateDeckRouteResponse, DeleteDeckRouteHandler, DeleteDeckRouteResponse } from "../type/deck_dto.js";
import * as util from "../util.js";

async function getDecksRouteHandler(req: GetDecksRouteHandler): Promise<GetDecksRouteResponse> {
    const decks = await service.getDecksByUserId(req.userId);
    return decks;
}


async function getDeckByIdRouteHandler(req: GetDeckByIdRouteHandler): Promise<GetDeckByIdRouteResponse> {
    const deck = await service.getDeckById(req.userId, req.deckId);
    if (!deck) return null;
    return deck;
}


async function createDeckRouteHandler(req: CreateDeckRouteHandler): Promise<CreateDeckRouteResponse> {
    const deck = await service.createDeck(req.userId, req.data);
    return deck;
}


async function updateDeckRouteHandler(req: UpdateDeckRouteHandler): Promise<UpdateDeckRouteResponse> {
    const deck = await service.updateDeck(
        req.userId, 
        req.deckId, 
        req.data);
    return deck;
}


async function deleteDeckRouteHandler(req: DeleteDeckRouteHandler): Promise<DeleteDeckRouteResponse> {
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
