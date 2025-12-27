import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV_VARS } from "src/config.js";
import { InternalError } from "../errors/internalError.js";

let supabaseAdmin: SupabaseClient<any, any, string, any, any> | null = null;

/**
 * 
 * @returns an instance of already connected supabase service role client
 * @note if none has been init, it will start one
 */
function getSupabaseAdminClient(): SupabaseClient<any, any, string, any, any> {
    if (supabaseAdmin) return supabaseAdmin;

    // ENV vars are validated at server start;
    try {
        supabaseAdmin = createClient(
            ENV_VARS.SUPABASE_URL.value!,
            ENV_VARS.SUPABASE_SERVICE_KEY.value!,
            {
                db: {
                    schema: ENV_VARS.SUPABASE_DBNAME.value!
                },
            }
        );
    }catch (error) {
        throw new InternalError("Failed to connect to Supabase", "", error);
    }

    return supabaseAdmin;
}


export { getSupabaseAdminClient };
