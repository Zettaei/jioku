
import { ENV_VARS } from "src/config.js";
type EnvVarKeys = keyof typeof ENV_VARS;

/**
 * Validate environment variables at startup.
 *
 * This function checks every entry in `ENV_VARS` (from `src/config.ts`) and ensures
 * that all variables marked `isRequired: true` are present (after trimming). It logs
 * a summary and will call `process.exit(1)` if any required variables are missing.
 *
 * @returns {boolean} true when all required environment variables are present
 */
function validateEnvironment(): boolean {
    // FOLLOW .env.example too!!!

    let missingRequiredVarsCount = 0;

    console.log("================================");
    console.log("\nChecking Environment Variables:");

    for (const name of Object.keys(ENV_VARS) as EnvVarKeys[]) {
        console.log(ENV_VARS[name].value);
        if(ENV_VARS[name].isRequired === true && !ENV_VARS[name].value) {
            ++missingRequiredVarsCount
        }
    }

    let isExit = false;
    if(missingRequiredVarsCount > 0) {
        console.error("[ERROR] Missing " + missingRequiredVarsCount + " required environment variable(s), please refer src/config.ts for more detail");
        isExit = true;
    }

    if(isExit) {
        process.exit(1);
    }
    console.log("[OK] All required environment variables are set");
    console.log("================================\n");
    return true;
}

export { validateEnvironment };