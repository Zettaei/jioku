
import { Hono } from "hono";
import { serve } from "@hono/node-server" 
import { cors } from "hono/cors";
import { HttpError } from "src/errors/httpError.js";
import { InternalError } from "src/errors/internalError.js";
import * as ocr from "modules/ocr/index.js";
import * as dict from "modules/dict/index.js";
import * as deck from "modules/deck/index.js";
import * as user from "src/modules/user/index.js";

import { ENV_VARS } from "./config.js";
import { setupShutdown } from "./shutdown.js";
import { validateEnvironment } from "./core/utils/env.js";
validateEnvironment();
setupShutdown();

const app = new Hono().basePath("/");
app.use(
    "*",
    cors({
        credentials: true,
        origin: (origin) => {
            return origin === ENV_VARS.FRONTEND_URL.value!
            ? origin
            : null;
        }
}));


app.route("/ocr", ocr.routes);
app.route("/dict", dict.routes);
app.route("/deck", deck.routes);
app.route("/user", user.routes);


app.onError((err, c) => {
    try {
        if (err instanceof HttpError) {
            console.error(err.status, err.message);
            return c.text(err.message, err.status);
        }

        if (err instanceof InternalError) {
            console.error(err.status, err.message);
            return c.text("Internal Server Error", err.status);
        }

        console.error("Unexpected Error:", err);
        return c.text("Internal Server Error", 500);
    }
    catch(err2) {
        console.error("Unhandled Rejected Error:", err2);
        return c.text("Internal Server Error", 500)
    }
});

// setupShutdown();

const PROTOCOL = "http"
const HOST = "0.0.0.0";
const PORT = 8787;
const server = serve({
    fetch: app.fetch,
    hostname: HOST,
    port: PORT,
});
console.log("Server is now running.");