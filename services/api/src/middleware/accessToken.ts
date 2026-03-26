import { createMiddleware } from "hono/factory";
import { validateAccessToken, refreshAccessToken } from "src/modules/user/repository.js";
import { UnauthorizedError } from "src/errors/httpError.js";
import { getCookie, setCookie } from "hono/cookie";
import { USER_OPTIONS } from "src/config.js";

declare module "hono" {
    interface ContextVariableMap {
        userId: string;
    }
}

const userIdMiddleware = createMiddleware(async (c, next) => {
    let accesstoken = getCookie(c, USER_OPTIONS.ACCESS_TOKEN_COOKIE_NAME);

    let validationResult = accesstoken ? await validateAccessToken(accesstoken).catch(() => null) : null;

    // If access token is missing or invalid/expired, try to refresh
    if (!validationResult) {
        const refreshtoken = getCookie(c, USER_OPTIONS.REFRESH_TOKEN_COOKIE_NAME);

        if (!refreshtoken) {
            throw new UnauthorizedError("Missing access token and refresh token");
        }

        const refreshResult = await refreshAccessToken(refreshtoken);
        accesstoken = refreshResult.accesstoken;

        // Update the access token cookie in the response
        setCookie(c, USER_OPTIONS.ACCESS_TOKEN_COOKIE_NAME, accesstoken, {
            httpOnly: true,
            secure: USER_OPTIONS.COOKIE_SECURE,
            sameSite: "lax",
            path: "/",
            maxAge: USER_OPTIONS.ACCESS_TOKEN_EXPIREIN_SECONDS
        });
        setCookie(c, USER_OPTIONS.REFRESH_TOKEN_COOKIE_NAME, refreshResult.refreshtoken, {
            httpOnly: true,
            secure: USER_OPTIONS.COOKIE_SECURE,
            sameSite: "lax",
            path: "/",
            maxAge: USER_OPTIONS.REFRESH_TOKEN_EXPIREIN_SECONDS
        });
        // Reset the is_loggedin indicator cookie so the frontend knows the session is still alive
        setCookie(c, "is_loggedin", "true", {
            httpOnly: false,
            secure: USER_OPTIONS.COOKIE_SECURE,
            sameSite: "lax",
            path: "/",
            maxAge: USER_OPTIONS.REFRESH_TOKEN_EXPIREIN_SECONDS
        });

        // Validate the new token
        validationResult = await validateAccessToken(accesstoken);
    }

    c.set("userId", validationResult.userId);
    await next();
});

export {
    userIdMiddleware
};