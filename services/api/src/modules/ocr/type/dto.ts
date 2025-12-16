import type { OcrResult } from "./model.js";


export type OcrRouteHandlerQuery = {
        force: boolean | undefined;
        nocache: boolean | undefined;
}
export interface OcrRouteHandler {
    image: string | File | undefined;
    query:  OcrRouteHandlerQuery;
}


export const OcrRouteResponseSource = { cache: "cache", ocr: "ocr" } as const;
export type OcrRouteResponseSource = typeof OcrRouteResponseSource[keyof typeof OcrRouteResponseSource];

export interface OcrRouteResponse {
    hash: string;
    source: OcrRouteResponseSource;
    result: OcrResult;
}