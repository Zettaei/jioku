
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

export async function load() {

    if (getCookie("is_loggedin") === "true") {
        try {
            const result = await tokenCheck();
            console.log(result)
            userStore.set({ username: result.username, role: "member", timezone: result.timezone });
        } catch {
            clearAuth()
        }
    } else {
        clearAuth()
    }

}