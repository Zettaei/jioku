export class HttpError extends Error {
    constructor(public status: number, message: string = "Server return an error") {
        super(message);
        this.name = "HttpError";
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string = "Resource not found") {
        super(400, message);
        this.name = "BadRequestError";
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string = "Resource not found") {
        super(404, message);
        this.name = "NotFoundError";
    }
}

export class ConnectionError extends HttpError {
    constructor(message: string = "Cannot connect to server") {
        super(503, message);
        this.name = "ConnectionError";
    }
}