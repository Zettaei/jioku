import { ENV_VARS } from "$lib/constant/env";
import { userStore } from "$lib/stores/auth";
import { deleteCookie } from "./cookie";

/**
 * Wraps fetch to globally handle 401 Unauthorized responses.
 * On 401, attempts to refresh the token first.
 * If refresh succeeds, retries the original request.
 * If refresh fails, clears session and lets the 401 through.
 */
export function setupFetchInterceptor() {
    // Store original fetch before wrapping
    const originalFetch = window.fetch;
    let refreshFetch = originalFetch;

    window.fetch = (async (...args: Parameters<typeof fetch>) => {
        let response = await originalFetch(...args);

        // On 401, attempt to refresh token before giving up
        if (response.status === 401) {
            const refreshSucceeded = await attemptTokenRefresh(refreshFetch);
            
            if (refreshSucceeded) {
                // Refresh worked - retry the original request
                response = await originalFetch(...args);
            } else {
                // Refresh failed - session is truly invalid
                clearUserSession();
            }
        }

        return response;
    }) as typeof fetch;
}

/**
 * Attempts to refresh the access token using the refresh token.
 * Uses the original fetch passed in to avoid infinite loops.
 */
async function attemptTokenRefresh(refreshFetch: typeof fetch): Promise<boolean> {
    try {
        const res = await refreshFetch(`${ENV_VARS.PUBLIC_BACKEND_URL}/user/refresh`, {
            method: "POST",
            credentials: "include",
        });
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Clears the user session (triggers redirect to login in protected layouts).
 */
function clearUserSession(): void {
    deleteCookie("is_loggedin");
    userStore.set(null);
}