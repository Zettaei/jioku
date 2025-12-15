import { Hono, type Context, type MiddlewareHandler, type Next } from "hono";

// TODO: implement actual user ID extraction logic
const userIdMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {

    const userId = ""
    c.set("userId", userId);

    await next();
};

export { 
    userIdMiddleware 
};