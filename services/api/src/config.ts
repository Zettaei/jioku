import { string } from "core/utils/index.js";

// all of these are string, probably
// NOTE: it look kinda redundant and messy but I'll live with it for now
export const ENV_VARS = {
    FRONTEND_URL: {
        value: string.trimOrUndefined(process.env.FRONTEND_URL),
        isRequired: true,
    },
    OCR_URL: {
        value: string.trimOrUndefined(process.env.OCR_URL),
        isRequired: true,
    },
    OCR_API_KEY: {
        value: string.trimOrUndefined(process.env.OCR_API_KEY),
        isRequired: false,
    },
    REDISSTACK_URL: {
        value: string.trimOrUndefined(process.env.REDISSTACK_URL),
        isRequired: true,
    },
    REDISSTACK_USERNAME: {
        value: string.trimOrUndefined(process.env.REDISSTACK_USERNAME),
        isRequired: false,
    },
    REDISSTACK_PASSWORD: {
        value: string.trimOrUndefined(process.env.REDISSTACK_PASSWORD),
        isRequired: false,
    },
    SUPABASE_URL: {
        value: string.trimOrUndefined(process.env.SUPABASE_URL),
        isRequired: true,
    },
    SUPABASE_SERVICE_KEY: {
        value: string.trimOrUndefined(process.env.SUPABASE_SERVICE_KEY),
        isRequired: true,
    },
    SUPABASE_DBNAME: {
        value: string.trimOrUndefined(process.env.SUPABASE_DBNAME),
        isRequired: true,
    },
    AZURE_TRANSLATOR_URL: {
        value: string.trimOrUndefined(process.env.AZURE_TRANSLATOR_URL),
        isRequired: true
    },
    AZURE_TRANSLATOR_KEY: {
        value: string.trimOrUndefined(process.env.AZURE_TRANSLATOR_KEY),
        isRequired: true
    },
    AZURE_TRANSLATOR_REGION: {
        value: string.trimOrUndefined(process.env.AZURE_TRANSLATOR_REGION),
        isRequired: true
    }
} as const;

export const REDIS_OPTIONS = {
    RETRY_CONNECTION_MS: 10000
}


export const DICT_OPTIONS = {
        INDEX_KEYNAME: "dict:entry_idx",
        MAX_QUERY_LENGTH: 300,
        RESULT_LIMIT: 20
}

export const OCR_OPTIONS = {
    MAX_IMAGE_WIDTH: 1920,
    MAX_IMAGE_HEIGHT: 1920,
    HASH_IMAGE_WIDTH: 256,
    HASH_IMAGE_HEIGHT: 256,
    IMAGE_CACHE_EXPIREIN_SECONDS: 60 * 60 * 6   // 6 hours 
}