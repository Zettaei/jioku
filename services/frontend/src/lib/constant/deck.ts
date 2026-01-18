import type { DeckExtraSetting } from "$lib/types/deck"


export const DECK_DEFAULT_HEADER: Record<string, string> = {
    kanji: "Kanji",
    reading: "Reading",
    meaning: "Meaning"
} as const;

export const DECK_EXTRA_SETTING_DEFAULT_HEADER: [keyof DeckExtraSetting] = [
    "newLimit"
] as const;

export const DECK_EXTRA_SETTING_DEFAULT_VALUE: DeckExtraSetting = {
    newLimit: 5
} as const;