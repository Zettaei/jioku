import type { DeckRow } from "$lib/types/server/core/supabase/type";


export const deckExtraHeaderOrder: Array<keyof DeckRow> = [
    "name",
    "updatedat",
    "createdat"
] as const;

export const deckExtraHeaderName: Partial<Record<keyof DeckRow, string>> = {
    name: "Name",
    updatedat: "Last Modified",
    createdat: "Created"
} as const;