import type { ContentfulStatusCode } from "hono/utils/http-status";

export class InternalError extends Error {
    status: ContentfulStatusCode = 500;
    originalMsg: unknown;

    constructor(message: string, originalMsg: unknown) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class DatabaseError extends InternalError {
    constructor(message: string, originalMsg: unknown) {
        super(message, originalMsg);
    }
}