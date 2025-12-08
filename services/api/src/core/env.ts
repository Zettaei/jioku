/**
 * Environment variable validation
 * Ensures all required env vars are present at startup
 */

import { ENV_VARS } from "src/config.js";
type EnvVarKeys = keyof typeof ENV_VARS;

export function validateEnvironment(): void {
    // FOLLOW .env.example too!!!

    let missingRequiredVarsCount = 0;

    console.log("================================");
    console.log("\nChecking Environment Variables:");

    for (const name of Object.keys(ENV_VARS) as EnvVarKeys[]) {

        if(ENV_VARS[name].isRequired === true && !ENV_VARS[name].value) {
            ++missingRequiredVarsCount
        }
    }

    if(missingRequiredVarsCount > 0) {
    console.error("[ERROR] Missing " + missingRequiredVarsCount + " required environment variables, please refer src/config.ts for more detail");
        process.exit(1);
    }
    else {.
        console.log("[OK] All required environment variables are set");
    }

    console.log("================================\n");
}
