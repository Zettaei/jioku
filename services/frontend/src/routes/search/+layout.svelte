<script lang="ts">
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from '$lib/context/toolbar';
    import { onMount, setContext } from 'svelte';
    import { getContext } from 'svelte';
    import { SEARCH_TOOLBAR_CONTEXT, SearchToolbarContextClass } from '$lib/context/searchToolbar.svelte';
    import SearchToolbar from './SearchToolbar.svelte';
    import { page } from '$app/state';

    let { children } = $props();

    const SearchToolbarContext = new SearchToolbarContextClass();
    setContext(SEARCH_TOOLBAR_CONTEXT, SearchToolbarContext);
    const setToolbar = getContext<ToolbarSetter>(TOOLBAR_SNIPPET_CONTEXT);

    // Check if we're on the front page (no sentence param and no image)
    let isFrontPage = $derived(!page.params.sentence && !SearchToolbarContext.image);

    onMount(() => {
        // Show toolbar snippet only when NOT on front page
        if (!isFrontPage) {
            setToolbar(toolbarSnippet);
        }
        return () => {
            setToolbar(null);
        };
    });

    $effect(() => {
        // Update toolbar visibility when page changes
        if (!isFrontPage) {
            setToolbar(toolbarSnippet);
        } else {
            setToolbar(null);
        }
    });
</script>

{#snippet toolbarSnippet()}
    <SearchToolbar toolbarContext={SearchToolbarContext}/>
{/snippet}

<div class="flex align-middle justify-center">
    {@render children()}
</div>