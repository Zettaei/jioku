import { createClient } from "@supabase/supabase-js";
import { ENV_VARS } from "src/config.js";

const supabaseAdmin = createClient(
    ENV_VARS.SUPABASE_URL.value!,
    ENV_VARS.SUPABASE_SERVICE_KEY.value!,
    {
        db: {
            schema: ENV_VARS.SUPABASE_DBNAME.value!
        },

    }
)


export default supabaseAdmin;
