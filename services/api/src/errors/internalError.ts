import type { ContentfulStatusCode } from "hono/utils/http-status";

export class InternalError extends Error {
  status: ContentfulStatusCode;
  subMessage: string | undefined;

  constructor(message: string, subMessage: string | undefined, rawResponse?: unknown | undefined, statusCode: ContentfulStatusCode = 500) {
    super(message, { cause: rawResponse });
    this.subMessage = subMessage;
    this.status = statusCode
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SupabaseError extends InternalError {
  constructor(message: string, subMessage: string | undefined, rawResponse: unknown | undefined) {
    super(message, subMessage, rawResponse);
  }
}
export class RedisError extends InternalError {
  constructor(message: string, subMessage: string | undefined, rawResponse: unknown | undefined) {
    super(message, subMessage, rawResponse);
  }
}

export class ConnectionError extends InternalError {
  constructor(message: string, subMessage: string | undefined, rawResponse: unknown | undefined) {
    super(message, subMessage, rawResponse, 503);
  }
}