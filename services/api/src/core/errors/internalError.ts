import type { ContentfulStatusCode } from "hono/utils/http-status";

export class InternalError extends Error {
  status: ContentfulStatusCode = 500;
  subMessage?: string;

  constructor(message: string, subMessage?: string, rawResponse?: unknown) {
    super(message, { cause: rawResponse });
    this.subMessage = subMessage;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class PostgresError extends InternalError {}
export class RedisError extends InternalError {}