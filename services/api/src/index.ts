
import { Hono } from "hono";
import { serve } from "@hono/node-server" 
import { cors } from "hono/cors";
import { HttpError } from "core/errors/httpError.js";
import { InternalError } from "core/errors/internalError.js";
import * as utils from "core/utils/index.js";
import * as ocr from "modules/ocr/index.js";
import * as dict from "modules/dict/index.js";
import * as deck from "modules/deck/index.js";

import { ENV_VARS } from "./config.js";
import { setupShutdown } from "./shutdown.js";
// utils.env.validateEnvironment();

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

setupShutdown();

const HOST = "localhost";
const PORT = 8787;
serve({
    fetch: app.fetch,
    hostname: HOST,
    port: PORT,
});
console.log("Server running on " + `http://${HOST}:${PORT}/`);