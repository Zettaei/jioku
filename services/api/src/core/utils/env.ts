
import { ENV_VARS } from "src/config.js";
type EnvVarKeys = keyof typeof ENV_VARS;

/**
 * Validate environment variables at startup.
 *
 * This function checks every entry in `ENV_VARS` (from `src/config.ts`) and ensures
 * that all variables marked `isRequired: true` are present (after trimming). It logs
 * a summary and will call `process.exit(1)` if any required variables are missing.
 *
 * Behavior:
 * - Uses `trimOrUndefined` to normalize values before checking.
 * - Logs an error showing how many required variables are missing, then exits.
 * - Returns `true` if validation passes (all required variables are present).
 *
 * Side effects:
 * - Writes status lines to stdout/stderr.
 * - May terminate the process with `process.exit(1)` when required variables are missing.
 *
 * @returns {boolean} true when all required environment variables are present
 */
function validateEnvironment(): boolean {
    // FOLLOW .env.example too!!!

    let missingRequiredVarsCount = 0;

    console.log("================================");
    console.log("\nChecking Environment Variables:");

    for (const name of Object.keys(ENV_VARS) as EnvVarKeys[]) {

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