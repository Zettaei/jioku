import type { ContentfulStatusCode } from "hono/utils/http-status";

export class InternalError extends Error {
    status: ContentfulStatusCode = 500;
    originalMsg: string | undefined;
    rawResponse: unknown | undefined;

    constructor(message: string, originalMsg: string | undefined, rawResponse: unknown | undefined = undefined) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class DatabaseError extends InternalError {
    constructor(message: string, originalMsg: string | undefined, rawResponse: unknown | undefined) {
        super(message, originalMsg);
    }
}