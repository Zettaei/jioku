import { Hono } from "hono";
import { userIdMiddleware } from "core/middleware/index.js";
import * as repository from "./repository.js";

const routes = new Hono;

routes.use(userIdMiddleware);

routes.get("/decks", async (c) => {
    const userId = c.get("userId");

    const row = await repository.getDecksByUserId(userId);
});

routes.get("/decks/:deckId", async (c) => {
    const userId = c.get("userId");
    const deckId = c.req.param().deckId;

    const row = await repository.getDeckById(userId, deckId)
});

routes.post("/decks", async (c) => {
    const userId = c.get("userId");

});

routes.put("/decks", async (c) => {
    const userId = c.get("userId");

});

routes.delete("/decks", async (c) => {
    const userId = c.get("userId");

});