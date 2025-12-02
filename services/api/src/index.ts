import { Hono } from "hono";
import { serve } from "@hono/node-server" 
import { cors } from "hono/cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ocr from "./modules/ocr/index.js";
dotenv.config();

const app = new Hono().basePath("/");
app.use(cors({
    credentials: true,
    origin: process.env["FRONTEND_HOST"] ?? ""
}));


app.route("/ocr", ocr.routes);



app.onError((err, c) => {
    console.error(err);
    return c.text("Server Error", 500);
});


const HOST = "localhost";
const PORT = 8787;
serve({
    fetch: app.fetch,
    hostname: HOST,
    port: PORT,
});