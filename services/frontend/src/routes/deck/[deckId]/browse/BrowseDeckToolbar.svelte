<script lang="ts">
    import Searchbar from "$lib/components/Searchbar.svelte";
    import type {  BrowseDeckToolbarContextInterface } from "$lib/context/deckToolbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { PlusIcon, Trash2Icon, XIcon } from "@lucide/svelte";
    import { useSidebar } from "$lib/components/ui/sidebar/index";

    interface Props {
        toolbarContext: BrowseDeckToolbarContextInterface;
        selectedRowsCount: number;
        onAdd: () => void;
        onDelete: () => void;
        onCancel: () => void;
    }

    const sidebar = useSidebar();

    // @ts-expect-error
    const  { toolbarContext, selectedRowsCount = 0, onAdd, onDelete, onCancel }: Props = $props<Props>();

    function handleSubmit(e: Event) {
        e.preventDefault();

        // TODO: search FUNCTION, I FORGOR OMG
        toolbarContext.searchText = toolbarContext.query;
    }

    function handleAddClick() {
        onAdd();
    }

    function handleTrashClick() {
        toolbarContext.selectionMode = true;
    }

    function handleExitSelectionMode() {
        onCancel();
        toolbarContext.selectionMode = false;
    }

    function handleConfirmDelete() {
        onDelete();
        toolbarContext.selectionMode = false;
    }
</script>


<div class="px-2 flex space-x-6">
    {#if !toolbarContext.selectionMode}
        <!-- Normal Mode -->
        <form onsubmit={(e: Event) => { handleSubmit(e) }}>
            <Searchbar bind:query={toolbarContext.query}/>
        </form>

        <div class="flex flex-nowrap space-x-1">
            <Button 
                variant="outline" 
                class="cursor-pointer"
                onclick={handleAddClick}
            >
                <PlusIcon/>
                {#if !sidebar.isMobile}
                    Add Card
                {/if}
            </Button>
            <Button 
                variant="outline" 
                class="cursor-pointer"
                onclick={handleTrashClick}
            >
                <Trash2Icon/>
                {#if !sidebar.isMobile}
                    Delete Card
                {/if}
            </Button>
        </div>
    {:else}
        <!-- Selection Mode -->
        <div class="flex items-center space-x-4 flex-grow">
            <div class="text-sm font-medium">
                {selectedRowsCount} card{selectedRowsCount !== 1 ? 's' : ''} selected
            </div>
            <div class="flex flex-nowrap space-x-1">
                <Button 
                    variant="destructive"
                    disabled={selectedRowsCount < 1}
                    class="cursor-pointer"
                    onclick={handleConfirmDelete}
                >
                    <Trash2Icon class="mr-2 h-4 w-4" />
                    Delete
                </Button>
                <Button 
                    variant="outline"
                    class="cursor-pointer"
                    onclick={handleExitSelectionMode}
                >
                    <XIcon class="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    {/if}
</div>