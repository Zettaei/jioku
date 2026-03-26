import { BadRequestError, ConflictError, UnauthorizedError } from "src/errors/httpError.js";
import { SupabaseError } from "src/errors/internalError.js";

function throwIfErrorBasic(error: any): void {
    if (error) {
        if (error.status === 400 || error.status === 401) {
            throw new UnauthorizedError("Invalid email or password");
        }
        if (error.status === 422) {
            throw new BadRequestError("Invalid email or password format");
        }
        throw new SupabaseError(error.message ?? "Unexpected Supabase error", error.message, error);
    }
}

function throwIfErrorRegister(error: any, titleMessage: string): void {
    if (error) {
        throwIfErrorBasic(error);
        if (error.message?.toLowerCase().includes("already registered")) {
            throw new ConflictError("An account with this email already exists");
        }
        throw new SupabaseError(titleMessage, error.message, error);
    }
}

export {
    throwIfErrorBasic,
    throwIfErrorRegister
}
