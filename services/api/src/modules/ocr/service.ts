import type { OcrItem, OcrResult } from "./type.js"

const OCR_ENDPOINT = "/ocr";


export async function sendImgToOCR(formData: FormData): Promise<OcrResult>
{
    const response = await fetch(process.env["OCR_HOST"] + OCR_ENDPOINT, {
        method: 'POST',
        headers: {
            "X-API-KEY": process.env["OCR_API_KEY"]
        },
        body: formData
    });

    if(!response.ok) 
        throw new Error("OCR server returned " + response.status);

    const data = await response.json() as OcrResult;
    return data;
}