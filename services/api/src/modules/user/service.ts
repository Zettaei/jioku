import * as repository from "./repository.js";
import type { LoginRouteResponse, RegisterRouteResponse, TokenCheckRouteResponse } from "./type/dto.js";

async function login(email: string, password: string)
: Promise<{ username: string, timezone: string, accesstoken: string, refreshtoken: string }>
{
    const data = await repository.loginWithEmailPassword(email, password);

    return data;
}

async function register(username: string, email: string, password: string, timezone: string)
: Promise<RegisterRouteResponse>
{
    const createdUsername = await repository.registerWithEmailPassword(username, email, password, timezone);

    return { username: createdUsername };
}

async function tokenCheck(userId: string)
: Promise<TokenCheckRouteResponse>
{
    const user = await repository.getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return { username: user.username, timezone: user.timezone };
}

async function updateSettings(userId: string, settings: { timezone: string }): Promise<void> {
    await repository.updateUserSettings(userId, settings);
}

export { login, register, tokenCheck, updateSettings };
