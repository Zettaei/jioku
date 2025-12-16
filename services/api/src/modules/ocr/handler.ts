import * as services from "./service.js";
import * as repository from "./repository.js";
import * as util from "./util.js";
import type { OcrResult } from "./type/model.js";
import sharp, { type Sharp } from "sharp";
import { OcrRouteResponseSource, type OcrRouteHandler, type OcrRouteResponse } from "./type/dto.js";

async function ocrRouteHandler(req: OcrRouteHandler): Promise<OcrRouteResponse> {
    const image = req.image;
    const { force, nocache } = req.query;

    util.validateImageFile(image);

    const img: Sharp = sharp(Buffer.from(await image.arrayBuffer()));

    let ocrResult: OcrResult | null = null;

    const resizedImg = sharp(await util.resizeImageForOCR(img).toBuffer());
    const hash = util.checksumImageBuffer( await resizedImg.toBuffer() );

    // force ocr / ignore  
    if(!force) {
        try {
            ocrResult = await repository.getCacheOcrResult(hash);
        } 
        catch(err) { console.warn("Redis cache reading failed, skipping:", err); }

        if(ocrResult) {
            return {
                hash: hash,
                source: OcrRouteResponseSource.cache,
                result: ocrResult
            };
        }
    }

    ocrResult = await services.processOCR(resizedImg, image.name);

    // cache data
    if(!nocache) {
        try {
            await repository.setCacheOcrResult(hash, ocrResult);
        }
        catch(err) { console.warn("Redis cache writing failed, skipping:", err); }
    }

    return {
        hash: hash,
        source: OcrRouteResponseSource.ocr,
        result: ocrResult
    }
}


export {
    ocrRouteHandler
}