import { Hono } from "hono";
import type { RegisterData, LoginData, Email, Password } from "./type.js";

const routes = new Hono();

// TODO: obviously not finish, continue the postgres
routes.post("/auth/login", async (c) => {
    let data: LoginData | null = null;
    try {
        data = await c.req.json();
    }
    catch(err) {

    }

    if(!data || !data.email || !data.password || typeof(data.email) !== "string" || typeof(data.password) !== "string") {
        return c.text("Incorrect or missing credential data", 400);
    }

});

routes.post("/auth/register", async (c) => {

});

export default routes;