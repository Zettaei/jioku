import { Pool } from "core/postgres/index.js"
import { verifyPassword, validateNonEmptyString, hashRefreshToken } from "./utils.js";
import { createUser, getUserByEmail } from "./repository.js"; // Assuming createUser exists in repository.js
import { UnauthorizedError, BadRequestError, ConflictError } from "src/core/errors/httpErrors.js";
import type { User } from "src/core/type.js";
import type { LoginData, RegisterData } from "./type.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export async function createRefreshToken(userId: string): Promise<string> {
    const randomString = crypto.randomBytes(64).toString("hex");
    const hashedRefreshToken = await hashRefreshToken(randomString);
    return hashedRefreshToken;
}

export async function validateLogin(data: LoginData) {

    if(!data) {
        throw new BadRequestError("Email and Password must be a non-empty string")
    }
    if (!validateNonEmptyString(data.email)) {
        throw new BadRequestError("Email must be a non-empty string");
    }
    if (!validateNonEmptyString(data.password)) {
        throw new BadRequestError("Password must be a non-empty string");
    }

    const user: User | null = await getUserByEmail(data.email);

    // prevent timing attacks
    const password = user ? user.password : "randomstringforwhatever";
    const isPasswordValid: boolean = await verifyPassword(password, data.password);

    if (!user || !isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
    }

    return user.id;
}

export async function validateRegister(data: RegisterData): Promise<string> {
    if(!data) {
        throw new BadRequestError("Email and Password must be a non-empty string")
    }
    if (!validateNonEmptyString(data.email)) {
        throw new BadRequestError("Email must be a non-empty string");
    }
    if (!validateNonEmptyString(data.password)) {
        throw new BadRequestError("Password must be a non-empty string");
    }
    if (!validateNonEmptyString(data.confirmPassword)) {
        throw new BadRequestError("Confirm Password must be a non-empty string");
    }

    if(data.confirmPassword !== data.password) {
        throw new BadRequestError("Password and Confirm Password do not match");
    }

    const email = data.email;

    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    // Create the new user
    const newUserId: string = await createUser(data);

    return newUserId;
}