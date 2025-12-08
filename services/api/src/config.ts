
export const ENV_VARS = {
    API_JWT_SECRET: { 
        value: process.env.API_JWT_SECRET, isRequired: true },
    API_JWT_EXPIRATION: { 
        value: process.env.API_JWT_EXPIRATION, isRequired: true },
    API_COOKIE_SECRET: { 
        value: process.env.API_COOKIE_SECRET, isRequired: true },
    PG_HOST: { 
        value: process.env.PG_HOST, isRequired: true },
    PG_USER: { 
        value: process.env.PG_USER, isRequired: true },
    PG_PASSWORD: { 
        value: process.env.PG_PASSWORD, isRequired: false },
    FRONTEND_HOST: { 
        value: process.env.FRONTEND_HOST, isRequired: true },
    OCR_HOST: { 
        value: process.env.OCR_HOST, isRequired: true },
    OCR_API_KEY: { 
        value: process.env.OCR_API_KEY, isRequired: false }
} as const;

export const REFRESHTOKENS_COOKIE_CONF = {
    maxAge: 30 * (24 * 60 * 60)         // 30 days
}