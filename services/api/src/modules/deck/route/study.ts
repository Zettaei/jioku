import { Hono } from "hono";
import { userIdMiddleware } from "core/middleware/index.js";
import {
    getStudyCardsByDeckIdRouteHandler
} from "../handler/study.js";
import type {
    GetStudyCardsByDeckIdRouteResponse
} from "../type/study_dto.js";


const routes = new Hono();

routes.use(userIdMiddleware);

routes.get("/decks/:deckId/study", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const pageQuery = c.req.query("page");
    const limitQuery = c.req.query("limit");
    const statusQuery = c.req.query("status");

    const result = await getStudyCardsByDeckIdRouteHandler({ deckId, userId,
        page: pageQuery,
        limit: limitQuery,
        status: statusQuery
    });

    return c.json<GetStudyCardsByDeckIdRouteResponse>(result);
});

export { routes };
