import { Hono } from "hono";
import type { RegisterData, LoginData } from "./type.js";
import { validateLogin } from "./service.js";
import { BadRequestError } from "src/core/errors/httpErrors.js"

const routes = new Hono();

// TODO: obviously not finish, continue the postgres
routes.post("/auth/login", async (c) => {

    const data = await c.req.json() as LoginData;
    if(!data) {
        throw new BadRequestError("Email and Password must be a non-empty string")
    }

    const email = data.email;
    const password = data.password;

    const userId: string = await validateLogin(email, password);
    return c.json({ userId }, 200);

});

routes.post("/auth/register", async (c) => {

});

export default routes;