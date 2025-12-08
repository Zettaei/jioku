import { Pool } from "core/postgres/index.js";
import type { User } from "core/type.js";
import { DatabaseError } from "core/errors/internalErrors.js";
import { hash } from "argon2";
import type { RegisterData } from "./type.js";

export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const result = await Pool.query<User>(
            "SELECT id, password FROM users WHERE email = $1;",
            [email]
        );

        if(!result.rows[0])
            return null;

        return result.rows[0];
        
    } catch (err) {
        throw new DatabaseError("Database error fetching user", err);
    }
}

export async function createUser(user: RegisterData): Promise<string> {
    const hashedPassword = await hash(user.password, {
        hashLength: 32,
        type: 1, //argon2id
        memoryCost: 65536, // 64 MB
        timeCost: 3,
        parallelism: 1
    });

    const result = await Pool.query<{ id: string }>(`
        INSERT INTO users (email, password, settings)
        VALUES ($1, $2, $3)
        RETURNING id;
    `, [user.email, hashedPassword, {}]);

    return result.rows[0]!.id;
}