import { Hono } from "hono";
import { userIdMiddleware } from "core/middleware/index.js";
import {
    getDecksStudyRouteHandler,
    getStudyCardsByDeckIdRouteHandler,
    getStudyCardsByStatusDeckIdRouteHandler,
    updateCardAndReviewRouteHandler
} from "../handler/study.js";
import type {
    GetDecksStudyRouteResponse,
    GetStudyCardsByDeckIdRouteResponse,
    GetStudyCardsByStatusAndDeckIdRouteResponse,
    UpdateCardAndReviewRouteResponse
} from "../type/study_dto.js";


const routes = new Hono();

routes.use(userIdMiddleware);

// NOTE: might be a good idea to return timedate NOW() from Database too

routes.get("/study/decks", async (c) => {
    const userId = c.get("userId");
    const pageQuery = c.req.query("page");
    const limitQuery = c.req.query("limit");
    const timezoneQuery = c.req.query("timezone");

    const result = await getDecksStudyRouteHandler({ userId, 
        page: pageQuery, 
        limit: limitQuery,
        timezone: timezoneQuery
    });

    return c.json<GetDecksStudyRouteResponse>(result);
});

routes.get("/study/decks/:deckId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const offsetQuery = c.req.query("offset");
    const limitQuery = c.req.query("limit");
    const timezoneQuery = c.req.query("timezone");

    const result = await getStudyCardsByDeckIdRouteHandler({ userId, deckId,
        timezone: timezoneQuery,
        limit: limitQuery,
        offset: offsetQuery
    });

    return c.json<GetStudyCardsByDeckIdRouteResponse>(result);
});

routes.get("/study/decks/:deckId/:status", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const status = c.req.param("status");
    const offsetQuery = c.req.query("offset");
    const limitQuery = c.req.query("limit");
    const timezoneQuery = c.req.query("timezone");

    const result = await getStudyCardsByStatusDeckIdRouteHandler({ userId, deckId,
        timezone: timezoneQuery,
        status: status,
        limit: limitQuery,
        offset: offsetQuery
    });

    return c.json<GetStudyCardsByStatusAndDeckIdRouteResponse>(result);
});

routes.post("/study/decks/:deckId/cards/:cardId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");
    const body = await c.req.json();

    const result = await updateCardAndReviewRouteHandler({
        userId,
        deckId,
        cardId,
        timeSpent: body.timeSpent,
        quality: body.quality
    });

    return c.json<UpdateCardAndReviewRouteResponse>(result);
});

export { routes };
