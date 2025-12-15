import { createMiddleware } from "hono/factory";

// TODO: implement actual user ID extraction logic
declare module "hono" {
    interface ContextVariableMap {
        userId: string;
    }
}

const userIdMiddleware = createMiddleware( async (c, next) => {

    const userId = ""
    c.set("userId", userId);

    await next();
});

export { 
    userIdMiddleware 
};