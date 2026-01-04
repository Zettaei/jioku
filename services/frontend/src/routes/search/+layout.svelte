<script lang="ts">
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from '$lib/context/toolbar';
    import { onMount, setContext } from 'svelte';
    import Toolbar from './SearchToolbar.svelte';
    import { getContext } from 'svelte';
    import { SEARCH_TOOLBAR_CONTEXT, SearchToolbarContextClass } from '$lib/context/searchToolbar.svelte';
    import SearchToolbar from './SearchToolbar.svelte';

    let { children } = $props();

    const SearchToolbarContext = new SearchToolbarContextClass();
    setContext(SEARCH_TOOLBAR_CONTEXT, SearchToolbarContext);
    const setToolbar = getContext<ToolbarSetter>(TOOLBAR_SNIPPET_CONTEXT);

    onMount(() => {
        setToolbar(toolbarSnippet);
        return () => {
            setToolbar(null);
        };
    });


</script>

{#snippet toolbarSnippet()}
    <SearchToolbar toolbarContext={SearchToolbarContext}/>
{/snippet}

<div class="flex align-middle justify-center">
    {@render children()}
</div>