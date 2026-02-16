import { getRedisClient } from "src/core/redisstack/redisstack.js";
import type { OcrResult } from "./type/model.js";
import { OCR_OPTIONS } from "src/config.js";

// NOTE: better to take this vvv to a yaml file or something
const REDIS_CACHE_KEY = "ocr:result:" as const;

async function getCacheOcrResult(imgHash: string)
: Promise<OcrResult | null> 
{
    const redis = await getRedisClient();
    const result = await redis.get(REDIS_CACHE_KEY + imgHash);

    if(!result) return null;
    
    return JSON.parse(result);
}

async function setCacheOcrResult(imgHash: string, ocrResult: OcrResult)
: Promise<string>
{
    const redis = await getRedisClient();
    await redis.set(REDIS_CACHE_KEY + imgHash, JSON.stringify(ocrResult), {
        expiration: {
            type: "EX", // seconds
            value: OCR_OPTIONS.IMAGE_CACHE_EXPIREIN_SECONDS
        }
    });
    
    return imgHash;
}

export {
    getCacheOcrResult,
    setCacheOcrResult
}