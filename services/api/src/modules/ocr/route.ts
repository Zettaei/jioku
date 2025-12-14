import { Hono } from "hono";
import * as services from "./service.js";
import * as repository from "./repository.js";
import { utils } from "./index.js";
import type { OcrResult } from "./type.js";
import sharp, { type Sharp } from "sharp";
import type { OcrRouteResponse } from "./apiType.js";


const routes = new Hono();

// BUG: only english image filename work for now, might fix later
// OPTIMIZE: store reqId in redis and have frontend poll for that reqId every 2-3s until it finished, maybe 30s timeout
routes.post("/", async (c) => {
    const file = (await c.req.parseBody())["file"];
    const force = (c.req.query("force") === "true");          // force doing OCR for this, ignore cache result
    const nocache = (c.req.query("nocache") === "true");      // don't cache this result

    utils.validateImageFile(file);

    const img: Sharp = sharp(Buffer.from(await file.arrayBuffer()));

    let ocrResult: OcrResult | null = null;

    const resizedImg = sharp(await utils.resizeImageForOCR(img).toBuffer());
    const hash = utils.checksumImageBuffer( await resizedImg.toBuffer() );

    if(!force) {
        try {
            ocrResult = await repository.getCacheOcrResult(hash);
        } 
        catch(err) { console.warn("Redis cache reading failed, skipping:", err); }

        if(ocrResult) {
            return c.json<OcrRouteResponse>({
                hash: hash,
                source: "cache",
                result: ocrResult
            });
        }
    }

    ocrResult = await services.sendImgToOCR(resizedImg, file.name);

    if(!nocache) {
        try {
            await repository.setCacheOcrResult(hash, ocrResult);
        }
        catch(err) { console.warn("Redis cache writing failed, skipping:", err); }
    }


    return c.json<OcrRouteResponse>({
        hash: hash,
        source: "ocr",
        result: ocrResult
    });
});

export { routes };