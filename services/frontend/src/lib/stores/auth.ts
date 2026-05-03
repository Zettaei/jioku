import type { UserStore } from "$lib/types/user";
import { writable } from "svelte/store";

export const userStore = writable<UserStore | null>(null);

export const isLoggedInStore = writable<boolean>(false);
