import { Pool } from "core/postgres/index.js";
import type { User } from "core/type.js";
import { DatabaseError } from "core/errors/internalErrors.js";

export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const result = await Pool.query<User>(
            "SELECT id, password FROM users WHERE email = $1",
            [email]
        );

        if(!result.rows[0])
            return null;

        return result.rows[0];
        
    } catch (err) {
        throw new DatabaseError("Database error fetching user", err);
    }
}