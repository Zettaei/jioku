import { env } from "$env/dynamic/public"

export const ENV_VARS = {
    PUBLIC_BACKEND_URL: env.PUBLIC_BACKEND_URL || ""
}