import type { OcrItem, OcrResult } from "./type.js"
import type { Context } from "hono";
import * as utils from "./utils.js";

async function processOCR(c: Context): Promise<OcrResult> {
    const file = (await c.req.parseBody())["file"];

    utils.isValidImageFile(file);

    const formData = utils.createForwardingFormData(file);

    const OCR_URL = new URL(process.env["OCR_HOST"] + "/ocr");
    const result = await utils.sendImgToOCR(OCR_URL, formData);
    return result;
}

export { 
    processOCR
};