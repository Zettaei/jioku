import { updateSettings } from "../(auth)/services";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { ConnectionError, HttpError } from "$lib/errors/HttpError";
import { isLoggedInStore, userStore } from "$lib/stores/auth";

export async function saveTimezone(
    selectedTimezone: string,
    onSuccess: () => void,
    onError: (error: string) => void
): Promise<void> {
    try {
        await updateSettings({ timezone: selectedTimezone });
        onSuccess();
    } catch (err: any) {
        onError(err.message ?? "Failed to save timezone.");
    }
}

export async function logout(): Promise<void> {
    try {
        const res = await fetch(`${PUBLIC_BACKEND_URL}/user/logout`, {
            credentials: "include",
            method: "POST",
        });

        if (!res.ok) throw new HttpError(res.status);

        userStore.set(null);
        isLoggedInStore.set(false);

    } catch (err) {
        if (err instanceof HttpError) throw err;
        throw new ConnectionError();
    }
}
