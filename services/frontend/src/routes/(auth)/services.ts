import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { ConnectionError, HttpError } from "$lib/errors/HttpError";
import { isLoggedInStore } from "$lib/stores/auth";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    timezone: string;
}

export interface AuthResponse {
    username: string;
    timezone: string;
}

export interface TokenCheckResponse {
    username: string;
    timezone: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    try {
        const res = await fetch(`${PUBLIC_BACKEND_URL}/user/login`, {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new HttpError(res.status, message || "Login failed. Please check your credentials.");
        }

        isLoggedInStore.set(true);

        return await res.json();

    } catch (err) {
        if (err instanceof HttpError) throw err;
        throw new ConnectionError();
    }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
        const res = await fetch(`${PUBLIC_BACKEND_URL}/user/register`, {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const message = await res.text();
            throw new HttpError(res.status, message || "Registration failed. Please try again.");
        }

        return await res.json();

    } catch (err) {
        if (err instanceof HttpError) throw err;
        throw new ConnectionError();
    }
}

export async function tokenCheck(): Promise<TokenCheckResponse> {
    try {
        const res = await fetch(`${PUBLIC_BACKEND_URL}/user/tokencheck`, {
            credentials: "include",
            method: "GET",
        });

        if (!res.ok) throw new HttpError(res.status);

        return await res.json();

    } catch (err) {
        if (err instanceof HttpError) throw err;
        throw new ConnectionError();
    }
}

export async function updateSettings(settings: {}): Promise<void> {
    try {
        const res = await fetch(`${PUBLIC_BACKEND_URL}/user/settings`, {
            credentials: "include",
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
        });

        if (!res.ok) throw new HttpError(res.status);

    } catch (err) {
        if (err instanceof HttpError) throw err;
        throw new ConnectionError();
    }
}

/**
 * Attempts to refresh access token using the refresh token cookie.
 * Returns true if refresh succeeded, false otherwise.
 */
export async function refreshAccessToken(): Promise<boolean> {
    try {
        const res = await fetch(`${PUBLIC_BACKEND_URL}/user/refresh`, {
            credentials: "include",
            method: "POST",
        });

        return res.ok;
    } catch {
        return false;
    }
}
