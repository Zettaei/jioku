
import { isLoggedInStore, userStore } from "$lib/stores/auth";
import { getCookie, deleteCookie } from "$lib/utils/cookie";
import { tokenCheck } from "./(auth)/services";

export const ssr = false;

function clearAuth() {
    // NOTE: Add logout here to remove any auth related cookie just in case
    deleteCookie("is_loggedin")
    userStore.set(null);
    isLoggedInStore.set(false);
}

// FIXME: somehow when restart server after a while the is_loggedin cookie is gone, refresh token still persist.
export async function load() {

    if (getCookie("is_loggedin") === "true") {
        try {
            const result = await tokenCheck();
            userStore.set({ username: result.username, role: "member", timezone: result.timezone });
        } catch {
            clearAuth()
        }
    } else {
        clearAuth()
    }

}