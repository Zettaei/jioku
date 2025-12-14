import type { OcrItem, OcrResult } from "./type.js"
import * as utils from "./utils.js";
import type { Sharp } from "sharp";
import { ENV_VARS } from "src/config.js";
import { BadRequestError } from "src/core/errors/httpErrors.js";
import { InternalError } from "src/core/errors/internalErrors.js";

async function sendImgToOCR(image: Sharp, filename: string)
: Promise<OcrResult>
{
    const formData = await utils.createForwardingFormData(image, filename);

    const response = await fetch(ENV_VARS.OCR_URL.value + "/ocr", {
        method: 'POST',
        headers: {
            "X-API-KEY": ENV_VARS.OCR_API_KEY.value,
        },
        body: formData
    });
 
    const body = await response.json();
    if(!response.ok) {
        if(response.status === 400) {
            throw new BadRequestError("Rejected request from OCR server");
        }
        else {
            throw new InternalError(
                "Failed request from OCR server", 
                (body as { detail: string | undefined }).detail, 
                {
                    status: response.status,
                    headers: response.headers
                }
            );
        }
    }
    
    const data = body as OcrResult;
    return data;
}


export { 
    sendImgToOCR
};