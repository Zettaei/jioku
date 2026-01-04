import { TranslationLanguage } from "$lib/types/server/modules/dict/type/model";

export const SEARCH_TOOLBAR_CONTEXT = "search_toolbar_context" as const;

export interface SearchToolbarContextInterface {
    image:File | null;
    translation: TranslationLanguage;
    query: string;

}

export class SearchToolbarContextClass implements SearchToolbarContextInterface {
    image = $state<File | null>(null);
    translation = $state<TranslationLanguage>(TranslationLanguage.English);
    query = $state<string>("");
}