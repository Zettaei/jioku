import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ENV_VARS } from "src/config.js";

let supabaseAdmin: SupabaseClient<any, any, string, any, any> | null = null;

function getSupabaseAdminClient(): SupabaseClient<any, any, string, any, any> {
    if (supabaseAdmin) return supabaseAdmin;

    // ENV vars are validated at server start;
    supabaseAdmin = createClient(
        ENV_VARS.SUPABASE_URL.value!,
        ENV_VARS.SUPABASE_SERVICE_KEY.value!,
        {
            db: {
                schema: ENV_VARS.SUPABASE_DBNAME.value!
            },
        }
    );

    return supabaseAdmin;
}


export { getSupabaseAdminClient };
