import { Hono } from "hono";
import * as services from "./service.js";

const routes = new Hono();

// BUG: only english image filename work for now, might fix later
// OPTIMIZE: resize photo before sending (probably should be OCR job tho)
routes.post("/", async (c) => {
    
    const result = services.processOCR(c);
    return c.json(result);
});

export { routes };