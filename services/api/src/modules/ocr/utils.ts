import { BadRequestError } from "src/core/errors/httpErrors.js";
import { InternalError } from "src/core/errors/internalErrors.js";
import type { OcrResult } from "./type.js";

function isValidImageFile(file: string | File | undefined): boolean
{
    if(!file) {
        throw new BadRequestError("Missing image file");
    }

    return true;
}

function createForwardingFormData(file: string | File | undefined): FormData
{
    const formData = new FormData();
    formData.set("file", file);

    return formData;
}

async function sendImgToOCR(url: URL, formData: FormData): Promise<OcrResult>
{
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "X-API-KEY": process.env["OCR_API_KEY"]
        },
        body: formData
    });
 

    const body = await response.json();
    if(!response.ok) {
        throw new InternalError(
            "Failed request from OCR server", 
            (body as { detail: string | undefined }).detail, 
            {
                status: response.status,
                headers: response.headers
            }
        );
    }
    
    const data = body as OcrResult;
    return data;
}


export {
    isValidImageFile,
    createForwardingFormData,
    sendImgToOCR
}