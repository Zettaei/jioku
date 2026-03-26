import type { UserStore } from "$lib/types/user";
import { writable } from "svelte/store";

export const userStore = writable<UserStore | null>(null);

// true after the initial tokencheck is completed (no matter what outcome)
export const authInitialized = writable<boolean>(false);
