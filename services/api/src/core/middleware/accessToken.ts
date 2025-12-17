import { createMiddleware } from "hono/factory";

// TODO: implement actual user ID extraction logic
declare module "hono" {
    interface ContextVariableMap {
        userId: string;
    }
}

const userIdMiddleware = createMiddleware( async (c, next) => {

    // FIXME: Placeholder user ID
    const userId = "1bf34483-06d8-4073-8e4e-e91257d167a8";
    c.set("userId", userId);

    await next();
});

export { 
    userIdMiddleware 
};