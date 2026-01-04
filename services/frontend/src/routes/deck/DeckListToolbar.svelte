<script lang="ts">
    import Searchbar from "$lib/components/Searchbar.svelte";
    import type { DeckListToolbarContextInterface } from "$lib/context/deckToolbar.svelte";

    interface Props {
        toolbarContext: DeckListToolbarContextInterface;
    }

    // @ts-expect-error
    const  { toolbarContext }: Props = $props<Props>();

    function handleSubmit(e: Event) {
        e.preventDefault();

        toolbarContext.searchText = toolbarContext.query;
    }
</script>


<form class="flex space-x-2 px-2" onsubmit={(e: Event) => { handleSubmit(e) }}>
    <Searchbar bind:query={toolbarContext.query}/>
</form>