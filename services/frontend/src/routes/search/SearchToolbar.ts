import { goto } from "$app/navigation";
import { DICT_OPTIONS } from "$lib/constant/options";
import type { SearchToolbarContextInterface } from "$lib/context/searchToolbar.svelte";
import { searchKeywordStore } from "$lib/stores/search";


export async function searchbarSubmit(text: string, context: SearchToolbarContextInterface) {
    const url = `/search/${encodeURIComponent(text)}`;

    searchKeywordStore.update((history) => {
        const newHistory = [text, ...history.filter((item) => item !== text)].slice(0, DICT_OPTIONS.MAX_SEARCH_HISTORY_LENGTH);
        
        return newHistory;
    });
    
    // Increment submission counter to trigger effect re-run
    context.submissionCount++;
    
    // Navigate to the search URL
    await goto(url);
}
