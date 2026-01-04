import type { CardRow } from "$lib/types/server/core/supabase/type";
import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model";

// NOTE: maybe the interface isn't needed but well...

// ////////////////////////////////////////////////////

export const DECK_LIST_TOOLBAR_CONTEXT = "deck_list_toolbar_context" as const;

export interface DeckListToolbarContextInterface {
    query: string;
    searchText: string;
}
export class DeckListToolbarContextClass implements DeckListToolbarContextInterface {
    query = $state<string>("");
    searchText = $state<string>("");
}

// ////////////////////////////////////////////////////

export const BROWSE_DECK_TOOLBAR_CONTEXT = "browse_deck_toolbar_context" as const;
export const BROWSE_DECK_TOOLBAR_ADD_HANDLER = "browse_deck_toolbar_add_handler" as const;
export const BROWSE_DECK_TOOLBAR_DELETE_HANDLER = "browse_deck_toolbar_delete_handler" as const;
export const BROWSE_DECK_TOOLBAR_CANCEL_HANDLER = "browse_deck_toolbar_cancel_handler" as const;

export interface BrowseDeckToolbarContextInterface {
    query: string;
    searchText: string;
    deckId: string | null;
    selectedCardId: string | null;
    selectedCardCount: number;
    selectionMode: boolean;
}
export class BrowseDeckToolbarContextClass implements BrowseDeckToolbarContextInterface {
    query = $state<string>("");
    searchText = $state<string>("");
    deckId = $state<string | null>(null);
    selectedCardId = $state<string | null>(null);
    selectedCardCount = $state<number>(0);
    selectionMode = $state<boolean>(false);
}   