import { Hono } from "hono";
import type { RegisterData, LoginData } from "./type.js";
import { createAccessToken, createRefreshToken, validateLogin, validateRegister } from "./service.js";
import { setCookie, setSignedCookie } from "hono/cookie";
import { ENV_VARS, REFRESHTOKENS_COOKIE_CONF } from "src/config.js";


const routes = new Hono();

// TODO: obviously not finish, continue the postgres
routes.post("login", async (c) => {

    const data = await c.req.json() as LoginData;

    const userId: string = await validateLogin(data);
    const refreshToken: string = await createRefreshToken(userId);
    const accessToken: string = createAccessToken(userId);

    await setSignedCookie(c, "refreshTokens", refreshToken, ENV_VARS.API_COOKIE_SECRET.value, {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge: REFRESHTOKENS_COOKIE_CONF.maxAge,
    })

    return c.json({ message: "Tokens set in cookies" }, 200);
});

routes.post("register", async (c) => {
    const data = await c.req.json() as RegisterData;

    await validateRegister(data);
    return c.json({ message: "User registered successfully" }, 201);
});

export default routes;