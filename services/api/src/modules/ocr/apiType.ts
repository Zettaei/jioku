import type { OcrResult } from "./type.js";

export interface OcrRouteResponse {
    hash: string;
    source: "cache" | "ocr";
    result: OcrResult;
}