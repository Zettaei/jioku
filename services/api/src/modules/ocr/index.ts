import { Hono } from "hono";
import routes from "./route.js";
import { sendImgToOCR } from "./service.js";



export type { OcrItem, OcrResult } from "./type.js";
export default {
    routes,
    sendImgToOCR
};
