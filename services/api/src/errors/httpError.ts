import type { ContentfulStatusCode } from "hono/utils/http-status";

export class HttpError extends Error {
    status: ContentfulStatusCode;

    constructor(message: string, status: ContentfulStatusCode) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class ForbiddenError extends HttpError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class ConflictError extends HttpError {
    constructor(message: string) {
        super(message, 409);
    }
}