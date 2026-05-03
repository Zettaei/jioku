import { LocalStorageKey } from "$lib/localStorage";
import { writable } from "svelte/store";

function getSafeInitialValue()
: Array<string>
{
    if (typeof window === 'undefined') return [];

    try {
        const storedValue = localStorage.getItem(LocalStorageKey.SearchKeywordHistory);
        if (!storedValue) return [];

        const parsed = JSON.parse(storedValue);

        // Ensure it's an array, then force everything inside to be a string
        if (Array.isArray(parsed)) {
            return parsed
                .map(item => String(item)) // Force conversion (e.g., numbers to strings)
                .filter(item => typeof item === "string"); // Filter garbage
        }
        
        return [];
    } catch {
        return [];
    }
};

export const searchKeywordStore = writable<string[]>(getSafeInitialValue());

if (typeof window !== 'undefined') {
    searchKeywordStore.subscribe((value) => {
        localStorage.setItem(LocalStorageKey.SearchKeywordHistory, JSON.stringify(value));
    });
}