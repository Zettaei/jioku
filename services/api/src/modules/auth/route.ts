import { Hono } from "hono";
import type { RegisterData, LoginData } from "./type.js";
import { createRefreshToken, validateLogin, validateRegister } from "./service.js";

const routes = new Hono();

// TODO: obviously not finish, continue the postgres
routes.post("/auth/login", async (c) => {

    const data = await c.req.json() as LoginData;

    const userId: string = await validateLogin(data);
    const refreshToken: string = await createRefreshToken(userId);
    // add createAccessToken
    // attach refresh and access tokens to cookie

    return c.json({ /*Refresh Token*/ */ }, 200);
});

routes.post("/auth/register", async (c) => {
    const data = await c.req.json() as RegisterData;

    await validateRegister(data);
    return c.json({ message: "User registered successfully" }, 201);
});

export default routes;