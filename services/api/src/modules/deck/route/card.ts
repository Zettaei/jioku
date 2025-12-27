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
import { BadRequestError } from "src/core/errors/httpError.js";


const routes = new Hono();

routes.use(userIdMiddleware);

routes.get("/decks/:deckId/cards", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const pageQuery = c.req.query("page");
    const limitQuery = c.req.query("limit");

    const result = await getCardsByDeckIdRouteHandler({ userId, deckId,
        page: pageQuery,
        limit: limitQuery
    });

    return c.json<GetCardsByDeckIdRouteResponse>(result);
});

routes.get("/decks/:deckId/cards/:cardId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");

    const result = await getCardByIdRouteHandler({ userId, deckId, cardId });

    return c.json<GetCardByIdRouteResponse>(result);
});

routes.post("/decks/:deckId/cards", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    let data;

    try {
        data = await c.req.json();
    } catch (err) { throw new BadRequestError("Invalid JSON") };

    const result = await createCardRouteHandler({ userId, deckId, data });

    return c.json<CreateCardRouteResponse>(result);
});

routes.put("/decks/:deckId/cards/:cardId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");
    let data;

    try {
        data = await c.req.json();
    } catch (err) { throw new BadRequestError("Invalid JSON") };

    const result = await updateCardRouteHandler({ userId, deckId, cardId, data });

    return c.json<UpdateCardRouteResponse>(result);
});

routes.delete("/decks/:deckId/cards/:cardId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");

    const result = await deleteCardRouteHandler({ userId, deckId, cardId });

    return c.json<DeleteCardRouteResponse>(result);
});

export { routes };
