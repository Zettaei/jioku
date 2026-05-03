import { Hono } from "hono";
import { loginRouteHandler, registerRouteHandler, tokenCheckRouteHandler } from "./handler.js";
import type { LoginRouteResponse, RegisterRouteResponse, TokenCheckRouteResponse } from "./type/dto.js";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { USER_OPTIONS } from "src/config.js";
import { validateAccessToken, refreshAccessToken, updateUserSettings } from "./repository.js";
import { BadRequestError, UnauthorizedError } from "src/errors/httpError.js";

const routes = new Hono();

routes.post("/login", async (c) => {
    const body = await c.req.json();

    const result = await loginRouteHandler({
        email: body.email,
        password: body.password,
    });

    setCookie(c, USER_OPTIONS.ACCESS_TOKEN_COOKIE_NAME, result.accesstoken, {
        httpOnly: true,
        secure: USER_OPTIONS.COOKIE_SECURE,
        sameSite: "lax",
        path: "/",
        maxAge: USER_OPTIONS.ACCESS_TOKEN_EXPIREIN_SECONDS
    });
    setCookie(c, USER_OPTIONS.REFRESH_TOKEN_COOKIE_NAME, result.refreshtoken, {
        httpOnly: true,
        secure: USER_OPTIONS.COOKIE_SECURE,
        sameSite: "lax",
        path: "/",
        maxAge: USER_OPTIONS.REFRESH_TOKEN_EXPIREIN_SECONDS
    });
    setCookie(c, "is_loggedin", "true", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: USER_OPTIONS.REFRESH_TOKEN_EXPIREIN_SECONDS
    });

    return c.json<LoginRouteResponse>({ username: result.username, timezone: result.timezone }, 200);
});

routes.post("/register", async (c) => {
    const body = await c.req.json();

    const result = await registerRouteHandler({
        username: body.username,
        email: body.email,
        password: body.password,
        timezone: body.timezone,
    });

    return c.json<RegisterRouteResponse>(result, 201);
});

routes.get("/tokencheck", async (c) => {
    const token = getCookie(c, USER_OPTIONS.ACCESS_TOKEN_COOKIE_NAME);

    if (!token) {
        throw new UnauthorizedError("No access token found");
    }

    const { userId } = await validateAccessToken(token);
    const result = await tokenCheckRouteHandler(userId);

    return c.json<TokenCheckRouteResponse>(result, 200);
});

routes.post("/refresh", async (c) => {
    const refreshtoken = getCookie(c, USER_OPTIONS.REFRESH_TOKEN_COOKIE_NAME);

    if (!refreshtoken) {
        deleteCookie(c, USER_OPTIONS.ACCESS_TOKEN_COOKIE_NAME)
        deleteCookie(c, USER_OPTIONS.REFRESH_TOKEN_COOKIE_NAME)
        deleteCookie(c, USER_OPTIONS.REFRESH_TOKEN_COOKIE_NAME)
        throw new UnauthorizedError("No refresh token found");
    }

    const { accesstoken, refreshtoken: newRefreshtoken } = await refreshAccessToken(refreshtoken);

    setCookie(c, USER_OPTIONS.ACCESS_TOKEN_COOKIE_NAME, accesstoken, {
        httpOnly: true,
        secure: USER_OPTIONS.COOKIE_SECURE,
        sameSite: "lax",
        path: "/",
        maxAge: USER_OPTIONS.ACCESS_TOKEN_EXPIREIN_SECONDS
    })
    setCookie(c, USER_OPTIONS.REFRESH_TOKEN_COOKIE_NAME, newRefreshtoken, {
        httpOnly: true,
        secure: USER_OPTIONS.COOKIE_SECURE,
        sameSite: "lax",
        path: "/",
        maxAge: USER_OPTIONS.REFRESH_TOKEN_EXPIREIN_SECONDS
    })
    setCookie(c, "is_loggedin", "true", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: USER_OPTIONS.REFRESH_TOKEN_EXPIREIN_SECONDS
    });

    return c.json({ message: "Token refreshed" }, 200);
});

routes.post("/logout", async (c) => {

    deleteCookie(c, USER_OPTIONS.ACCESS_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: USER_OPTIONS.COOKIE_SECURE,
        sameSite: "lax",
        path: "/",
    });
    deleteCookie(c, USER_OPTIONS.REFRESH_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: USER_OPTIONS.COOKIE_SECURE,
        sameSite: "lax",
        path: "/",
    });
    deleteCookie(c, USER_OPTIONS.IS_LOGGEDIN_COOKIE_NAME, {
        httpOnly: false,
        secure: USER_OPTIONS.COOKIE_SECURE,
        sameSite: "lax",
        path: "/",
    });

    return c.json({ message: "Logged out" }, 200);
});

routes.patch("/settings", async (c) => {
    const token = getCookie(c, USER_OPTIONS.ACCESS_TOKEN_COOKIE_NAME);

    if (!token) {
        throw new UnauthorizedError("No access token found");
    }

    const { userId } = await validateAccessToken(token);
    const body = await c.req.json();

    if (!body.timezone) {
        throw new BadRequestError("Timezone is required");
    }

    await updateUserSettings(userId, { timezone: body.timezone });

    return c.json({ message: "Settings updated" }, 200);
});

export { routes };
