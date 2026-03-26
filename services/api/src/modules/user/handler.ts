import * as service from "./service.js";
import type { LoginRouteHandler, LoginRouteResponse, RegisterRouteHandler, RegisterRouteResponse, TokenCheckRouteResponse } from "./type/dto.js";
import { BadRequestError } from "src/errors/httpError.js";

async function loginRouteHandler(req: LoginRouteHandler)
: Promise<{ username: string, timezone: string, accesstoken: string, refreshtoken: string }>
{
    if (!req.email || !req.password) {
        throw new BadRequestError("Email and password are required");
    }

    return await service.login(req.email, req.password);
}

async function registerRouteHandler(req: RegisterRouteHandler)
: Promise<RegisterRouteResponse>
{
    if (!req.username || !req.email || !req.password) {
        throw new BadRequestError("Username, email, and password are required");
    }

    if (req.password.length < 8) {
        throw new BadRequestError("Password must be at least 8 characters");
    }

    if (!req.timezone) {
        throw new BadRequestError("Timezone is required");
    }

    return await service.register(req.username, req.email, req.password, req.timezone);
}

async function tokenCheckRouteHandler(userId: string)
: Promise<TokenCheckRouteResponse>
{
    if (!userId) {
        throw new BadRequestError("User ID is required");
    }

    return await service.tokenCheck(userId);
}

export { loginRouteHandler, registerRouteHandler, tokenCheckRouteHandler };
