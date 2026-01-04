<script lang="ts">
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from '$lib/context/toolbar';
    import { onMount, setContext } from 'svelte';
    import { getContext } from 'svelte';
    import BrowseDeckToolbar from './BrowseDeckToolbar.svelte';
    import { BROWSE_DECK_TOOLBAR_CONTEXT, BROWSE_DECK_TOOLBAR_DELETE_HANDLER, BROWSE_DECK_TOOLBAR_CANCEL_HANDLER, BrowseDeckToolbarContextClass, type BrowseDeckToolbarContextInterface, BROWSE_DECK_TOOLBAR_ADD_HANDLER } from '$lib/context/deckToolbar.svelte';

    let { children } = $props();

    const BrowseDeckToolbarContext = new BrowseDeckToolbarContextClass();
    setContext<BrowseDeckToolbarContextInterface>(BROWSE_DECK_TOOLBAR_CONTEXT, BrowseDeckToolbarContext);

    const setToolbar = getContext<ToolbarSetter>(TOOLBAR_SNIPPET_CONTEXT);


    // Expose setOnDelete and setOnCancel to allow children to set handlers
    let onAdd: (() => void) = $state(() => {});
    let onCancel: (() => void) = $state(() => {});
    let onDelete: (() => void) = $state(() => {});

    const setOnAdd = (handler: (() => void)) => {
        onAdd = handler;
    }    
    const setOnDelete = (handler: (() => void)) => {
        onDelete = handler;
    };
    const setOnCancel = (handler: (() => void)) => {
        onCancel = handler;
    };

    setContext(BROWSE_DECK_TOOLBAR_ADD_HANDLER, setOnAdd);
    setContext(BROWSE_DECK_TOOLBAR_DELETE_HANDLER, setOnDelete);
    setContext(BROWSE_DECK_TOOLBAR_CANCEL_HANDLER, setOnCancel);
    ////////////////////////////////////////////////////////////////////////

    onMount(() => {
        setToolbar(toolbarSnippet);
        return () => {
            setToolbar(null);
        };
    });

</script>

{#snippet toolbarSnippet()}
    <BrowseDeckToolbar 
        toolbarContext={BrowseDeckToolbarContext}
        selectedRowsCount={BrowseDeckToolbarContext.selectedCardCount}
        onAdd={onAdd}
        onDelete={onDelete}
        onCancel={onCancel}
    />
{/snippet}

<div class="flex align-middle justify-center">
    {@render children()}
</div>