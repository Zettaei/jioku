import { goto } from "$app/navigation";
import { getCookie } from "$lib/utils/cookie";

export function load() {
    if (getCookie("is_loggedin") !== "true") {
        goto("/login");
    }
}