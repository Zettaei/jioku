
export const ENV_VARS = {
    API_JWT_SECRET: { 
        value: process.env.API_JWT_SECRET, isRequired: true },
    API_JWT_EXPIRATION: { 
        value: process.env.API_JWT_EXPIRATION, isRequired: true },
    API_COOKIE_SECRET: { 
        value: process.env.API_COOKIE_SECRET, isRequired: true },
    SUPABASE_URL: { 
        value: process.env.SUPABASE_URL, isRequired: true },
    SUPABASE_SERVICE_KEY: { 
        value: process.env.SUPABASE_SERVICE_KEY, isRequired: true },
    SUPABASE_DBNAME: { 
        value: process.env.SUPABASE_DBNAME, isRequired: true },
    FRONTEND_HOST: { 
        value: process.env.FRONTEND_HOST, isRequired: true },
    OCR_HOST: { 
        value: process.env.OCR_HOST, isRequired: true },
    OCR_API_KEY: { 
        value: process.env.OCR_API_KEY, isRequired: false }
} as const;

// export const REFRESHTOKENS_COOKIE_CONF = {
//     maxAge: 30 * (24 * 60 * 60)         // 30 days
// }