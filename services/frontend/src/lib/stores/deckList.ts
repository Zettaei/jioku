import { writable } from "svelte/store";
import type { DeckRow } from "$lib/types/server/core/supabase/type";

export type DeckListItem = Pick<DeckRow, "id" | "name" | "headersdata" | "headersorder">;

interface DeckListState {
    decks: DeckListItem[];
    isLoading: boolean;
    lastSelectedDeckId: string | null;
}

export const deckListStore = writable<DeckListState>({
    decks: [],
    isLoading: false,
    lastSelectedDeckId: null,
});
