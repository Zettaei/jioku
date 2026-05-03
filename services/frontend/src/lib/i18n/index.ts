import { derived, writable } from "svelte/store";
import { en } from "./en";
import { th } from "./th";
import { LocalStorageKey } from "$lib/localStorage";

export type { Lang } from "./en";
export { en, th };

export type LangKey = "en" | "th";

const languages = { en, th } as const;

function getInitialLang(): LangKey {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(LocalStorageKey.UILang);
  if (saved === "en" || saved === "th") return saved;
  return "en";
}

export const langStore = writable<LangKey>(getInitialLang());

// Persist to localStorage whenever the store changes
if (typeof window !== "undefined") {
  langStore.subscribe((key) => {
    localStorage.setItem(LocalStorageKey.UILang, key);
  });
}

// Reactive lang object — import this in components instead of a plain object
export const lang = derived(langStore, ($key) => languages[$key]);
