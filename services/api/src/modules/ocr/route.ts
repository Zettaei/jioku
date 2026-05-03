import { Hono } from "hono";
import { type OcrRouteResponse } from "./type/dto.js";
import { ocrRouteHandler } from "./handler.js";


const routes = new Hono();

// NOTE: since only english image filename is accepted, I forced rename all the image files no matter the language to a generic english name
// OPTIMIZE: store reqId in redis and have frontend poll for that reqId every 2-3s until it finished, maybe 30s timeout
routes.post("/", async (c) => {
    const file = (await c.req.parseBody())["file"];
    const force = (c.req.query("force") === "true");          // force doing OCR for this, ignore cache result
    const nocache = (c.req.query("nocache") === "true");      // don't cache this result

    const result = await ocrRouteHandler({ 
        image: file,
        query: {
            force, nocache
        }
    });

    return c.json<OcrRouteResponse>(result);
});

export { routes };