import { Hono } from "hono";
import { userIdMiddleware } from "core/middleware/index.js";
import {
    getCardsByDeckIdRouteHandler,
    getCardByIdRouteHandler,
    createCardRouteHandler,
    updateCardRouteHandler,
    deleteCardRouteHandler
} from "../handler/card.js";
import type {
    GetCardsByDeckIdRouteResponse,
    GetCardByIdRouteResponse,
    CreateCardRouteResponse,
    UpdateCardRouteResponse,
    DeleteCardRouteResponse
} from "../type/card_dto.js";

const routes = new Hono();

routes.use(userIdMiddleware);

routes.get("/decks/:deckId/cards", async (c) => {
    const deckId = c.req.param("deckId");

    const result = await getCardsByDeckIdRouteHandler({ deckId });

    return c.json<GetCardsByDeckIdRouteResponse>(result);
});

routes.get("/decks/:deckId/cards/:cardId", async (c) => {
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");

    const result = await getCardByIdRouteHandler({ deckId, cardId });

    return c.json<GetCardByIdRouteResponse>(result);
});

routes.post("/decks/:deckId/cards", async (c) => {
    const deckId = c.req.param("deckId");
    const data = await c.req.json();

    const result = await createCardRouteHandler({ deckId, data });

    return c.json<CreateCardRouteResponse>(result);
});

routes.put("/decks/:deckId/cards/:cardId", async (c) => {
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");
    const data = await c.req.json();

    const result = await updateCardRouteHandler({ deckId, cardId, data });

    return c.json<UpdateCardRouteResponse>(result);
});

routes.delete("/decks/:deckId/cards/:cardId", async (c) => {
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");

    const result = await deleteCardRouteHandler({ deckId, cardId });

    return c.json<DeleteCardRouteResponse>(result);
});

export { routes };
