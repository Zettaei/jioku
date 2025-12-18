import { Hono } from "hono";
import { userIdMiddleware } from "core/middleware/index.js";
import {
    getDecksRouteHandler,
    getDeckByIdRouteHandler,
    createDeckRouteHandler,
    updateDeckRouteHandler,
    deleteDeckRouteHandler
} from "../handler/deck.js";
import type {
    GetDecksRouteResponse,
    GetDeckByIdRouteResponse,
    CreateDeckRouteResponse,
    UpdateDeckRouteResponse,
    DeleteDeckRouteResponse
} from "../type/deck_dto.js";

const routes = new Hono();

routes.use(userIdMiddleware);

routes.get("/decks", async (c) => {
    const userId = c.get("userId");

    const result = await getDecksRouteHandler({ userId });

    return c.json<GetDecksRouteResponse>(result);
});

routes.get("/decks/:deckId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");

    const result = await getDeckByIdRouteHandler({ userId, deckId });
    
    
    return c.json<GetDeckByIdRouteResponse>(result);
});

routes.post("/decks", async (c) => {
    const userId = c.get("userId");
    const data = await c.req.json();

    const result = await createDeckRouteHandler({ userId, data });

    return c.json<CreateDeckRouteResponse>(result);
});

routes.put("/decks/:deckId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const data = await c.req.json();

    const result = await updateDeckRouteHandler({ userId, deckId, data });

    return c.json<UpdateDeckRouteResponse>(result);
});

routes.delete("/decks/:deckId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");

    const result = await deleteDeckRouteHandler({ userId, deckId });

    return c.json<DeleteDeckRouteResponse>(result);
});

export { routes };