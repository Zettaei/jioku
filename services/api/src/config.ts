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
    },
    AZURE_TTS_URL: {
        value: string.trimOrUndefined(process.env.AZURE_TTS_URL),
        isRequired: true
    },
    AZURE_SPEECH_TOKEN_URL: {
        value: string.trimOrUndefined(process.env.AZURE_SPEECH_TOKEN_URL),
        isRequired: true
    },
    AZURE_SPEECH_KEY: {
        value: string.trimOrUndefined(process.env.AZURE_SPEECH_KEY),
        isRequired: true
    },
    AZURE_STT_URL: {
        value: string.trimOrUndefined(process.env.AZURE_STT_URL),
        isRequired: true
    }
} as const;

export const REDIS_OPTIONS = {
    RETRY_CONNECTION_MS: 10000
}

export const DECK_OPTIONS = {
    DECK_MAX_NAME_LENGTH: 100,
    DECK_MAX_DESCRIPTION_LENGTH: 500,
    DECK_RESULT_FETCH_LIMIT: 40,
    CARD_RESULT_FETCH_LIMIT: 40,
    REVIEW_RESULT_FETCH_LIMIT: 40,
    STUDY_CARD_FETCH_LIMIT: 40
}

export const DICT_OPTIONS = {
    INDEX_KEYNAME: "dict:entry_idx",
    MAX_QUERY_LENGTH: 300,
    RESULT_LIMIT: 20,
    AZURE_SPEECH_ACCESSTOKEN_KEY: "azure:speech:accesstoken",
    AZURE_SPEECH_ACCESSTOKEN_EXPIREIN_SECONDS: 60 * 10, // 10 mins (Azure Key last 10 mins)
}

export const OCR_OPTIONS = {
    MAX_IMAGE_WIDTH: 1920,
    MAX_IMAGE_HEIGHT: 1920,
    HASH_IMAGE_WIDTH: 256,
    HASH_IMAGE_HEIGHT: 256,
    IMAGE_CACHE_EXPIREIN_SECONDS: 60 * 60 * 6   // 6 hours 
}

const isDevelopment = process.env.NODE_ENV !== "production";

export const USER_OPTIONS = {
    ACCESS_TOKEN_EXPIREIN_SECONDS: 60 * 30, // 30 mins
    // ACCESS_TOKEN_EXPIREIN_SECONDS: 15, // 15 secs
    ACCESS_TOKEN_COOKIE_NAME: "accesstoken",
    REFRESH_TOKEN_EXPIREIN_SECONDS: 60 * 60 * 24 * 7, // 7 days
    // REFRESH_TOKEN_EXPIREIN_SECONDS: 120, // 120 secs
    REFRESH_TOKEN_COOKIE_NAME: "refreshtoken",
    COOKIE_SECURE: true,
    IS_LOGGEDIN_COOKIE_NAME: "is_loggedin"
}