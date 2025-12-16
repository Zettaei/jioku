import type { OcrItem, OcrResult } from "./type/model.js"
import * as utils from "./util.js";
import type { Sharp } from "sharp";
import { ENV_VARS } from "src/config.js";
import { BadRequestError } from "src/core/errors/httpError.js";
import { InternalError } from "src/core/errors/internalError.js";

async function processOCR(image: Sharp, filename: string)
: Promise<OcrResult>
{
    const formData = await utils.createForwardingFormData(image, filename);

    let response;
    try {
        response = await fetch(ENV_VARS.OCR_URL.value + "/ocr", {
            method: 'POST',
            headers: {
                "X-API-KEY": ENV_VARS.OCR_API_KEY.value,
            },
            body: formData
        });

    }
    catch(err) {
        throw new InternalError("Cannot connect to OCR server", "", err);
    }

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
    processOCR,
};