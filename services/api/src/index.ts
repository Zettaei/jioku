import { Hono } from "hono";
import { serve } from "@hono/node-server" 
import { cors } from "hono/cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ocr from "modules/ocr/index.js";
import { HttpError } from "src/core/errors/httpErrors.js";
import { InternalError } from "./core/errors/internalErrors.js";
dotenv.config();

const app = new Hono().basePath("/");
app.use(cors({
    credentials: true,
    origin: process.env["FRONTEND_HOST"] ?? ""
}));


app.route("/ocr", ocr.routes);



app.onError((err, c) => {
    if (err instanceof HttpError) {
        console.error(err.name, err.message);
        return c.text(err.message, err.status);
    }

    if (err instanceof InternalError) {
        console.error(err.name, err.message, err.originalMsg);
        return c.text("Internal Server Error", err.status);
    }

    console.error("Unexpected error:", err);
    return c.text("Internal server error", 500);
});


const HOST = "localhost";
const PORT = 8787;
serve({
    fetch: app.fetch,
    hostname: HOST,
    port: PORT,
});