import { Pool } from "core/postgres/index.js"
import { verifyPassword } from "./utils.js";
import { getUserByEmail } from "./repository.js";
import { BadRequestError, UnauthorizedError } from "src/core/errors/httpErrors.js";

export async function validateLogin(email: string, password: string) {

    if (typeof email !== "string" || email.trim() === "") {
        throw new BadRequestError("Email must be a non-empty string");
    }

    if (typeof password !== "string" || password.trim() === "") {
        throw new BadRequestError("Password must be a non-empty string");
    }

    const user = await getUserByEmail(email);

    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid: boolean = await verifyPassword(user.password, password);

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
    }

    return user.id;
}

export function validateRegister() {

}