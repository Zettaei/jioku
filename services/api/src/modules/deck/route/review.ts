import { Hono } from "hono";
import { userIdMiddleware } from "core/middleware/index.js";
import {
    getReviewsByCardIdRouteHandler,
    createReviewRouteHandler,
} from "../handler/review.js";
import type {
    GetReviewsByCardIdRouteResponse,
    CreateReviewRouteResponse,
} from "../type/review_dto.js";
import { BadRequestError } from "src/core/errors/httpError.js";


const routes = new Hono();

routes.use(userIdMiddleware);

routes.get("/decks/:deckId/cards/:cardId/reviews", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");
    const pageQuery = c.req.query("page");
    const limitQuery = c.req.query("limit");

    const result = await getReviewsByCardIdRouteHandler({ deckId, cardId, userId,
        page: pageQuery,
        limit: limitQuery
    });

    return c.json<GetReviewsByCardIdRouteResponse>(result);
});

routes.post("/decks/:deckId/cards/:cardId/reviews", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param("deckId");
    const cardId = c.req.param("cardId");
    let data;

    try {
        data = await c.req.json();
    } catch (err) { throw new BadRequestError("Invalid JSON") };

    const result = await createReviewRouteHandler({ deckId, cardId, userId, data });

    return c.json<CreateReviewRouteResponse>(result);
});

export { routes };
