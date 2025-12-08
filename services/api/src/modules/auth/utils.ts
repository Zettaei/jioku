import { verify } from "argon2";
import { BadRequestError } from "src/core/errors/httpErrors.js";
import argon2 from "argon2";

export async function verifyPassword(storedHash: string, inputPassword: string): Promise<boolean> {
    try {
        return await verify(storedHash, inputPassword);

    } catch (error) {
        return false;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
        hashLength: 32,
        type: 1, // argon2id
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 1
    });
}

export async function hashRefreshToken(token: string): Promise<string> {
    return argon2.hash(token, {
        hashLength: 32,
        type: 1, // argon2id
        memoryCost: 16384, // 64 MB
        timeCost: 2,
        parallelism: 1
    });
}

export function validateNonEmptyString(value: unknown): boolean {
    return (typeof value === "string" && value.trim().length > 0);
}

