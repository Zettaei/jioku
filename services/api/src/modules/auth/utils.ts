import { verify } from "argon2";

export async function verifyPassword(storedHash: string, providedPassword: string): Promise<boolean> {
    try {
        return await verify(storedHash, providedPassword);

    } catch (error) {
        return false;
    }
}
