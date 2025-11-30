import { Hono } from "hono";
import routes from "./route.js";

const ocr = new Hono();

ocr.route('/', routes);

export default ocr;