import { Hono } from "hono";
import type { Context } from "hono/jsx";
import type { Variables } from "hono/types";
import { userIdMiddleware } from "src/core/middleware/accessToken.js";

const routes = new Hono<{ Variables: Variables }>();

routes.use(userIdMiddleware);


routes.get("/deck", async (c) => {

});

routes.post("/deck", async (c: Context<{ userId: string }>) => {
    const userId = c.get("userId");
});

routes.put("/deck", async (c) => {

});

routes.delete("/deck", async (c) => {

});