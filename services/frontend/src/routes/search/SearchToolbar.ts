import { goto } from "$app/navigation";
import type { SearchToolbarContextInterface } from "$lib/context/searchToolbar.svelte";

export async function searchbarSubmit(text: string, context: SearchToolbarContextInterface) {
    const url = `/search/${encodeURIComponent(text)}`;
    
    // Increment submission counter to trigger effect re-run
    context.submissionCount++;
    
    // Navigate to the search URL
    await goto(url);
}
