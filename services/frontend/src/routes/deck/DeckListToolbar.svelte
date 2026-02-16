<script lang="ts">
    import Searchbar from "$lib/components/Searchbar.svelte";
    import type { DeckListToolbarContextInterface } from "$lib/context/deckToolbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { PlusIcon } from "@lucide/svelte";
    import { useSidebar } from "$lib/components/ui/sidebar/index";

    interface Props {
        toolbarContext: DeckListToolbarContextInterface;
        onAdd: () => void;
        onSearch: () => void;
    }

    const sidebar = useSidebar();

    const  { toolbarContext, onAdd, onSearch }: Props = $props();

    function handleSubmit(e: Event) {
        e.preventDefault();

        onSearch();
    }

    function handleAddClick() {
        onAdd();
    }
</script>


<div class="px-2 flex space-x-2">
    <form class="flex space-x-2" onsubmit={(e: Event) => { handleSubmit(e) }}>
        <Searchbar bind:query={toolbarContext.query}/>
    </form>
    <Button 
        variant="outline" 
        class="cursor-pointer"
        onclick={handleAddClick}
    >
        <PlusIcon/>
        {#if !sidebar.isMobile}
            Add Deck
        {/if}
    </Button>
</div>