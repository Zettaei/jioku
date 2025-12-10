import { string } from "core/utils/index.js";

// all of these are string, probably
export const ENV_VARS = {
    API_JWT_SECRET: {
        value: string.trimOrUndefined(process.env.API_JWT_SECRET),
        isRequired: true,
    },
    API_JWT_EXPIRATION: {
        value: string.trimOrUndefined(process.env.API_JWT_EXPIRATION),
        isRequired: true,
    },
    API_COOKIE_SECRET: {
        value: string.trimOrUndefined(process.env.API_COOKIE_SECRET),
        isRequired: true,
    },
    FRONTEND_HOST: {
        value: string.trimOrUndefined(process.env.FRONTEND_HOST),
        isRequired: true,
    },
    OCR_HOST: {
        value: string.trimOrUndefined(process.env.OCR_HOST),
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
} as const;

// export const REFRESHTOKENS_COOKIE_CONF = {
//     maxAge: 30 * (24 * 60 * 60)         // 30 days
// }