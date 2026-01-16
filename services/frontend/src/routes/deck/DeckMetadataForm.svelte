<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion/index";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { DeckEditableData } from "$lib/types/deck";
    import { XIcon, PlusIcon, GripVerticalIcon } from "@lucide/svelte";
    import { DECK_DEFAULT_HEADER } from "$lib/constant/deck";
    import { untrack } from "svelte";

    interface Header {
        key: string;  
        label: string;
    }

    interface Props {
        mode?: 'add' | 'edit';
        deck?: DeckEditableData;
        onSave: (data: DeckEditableData) => void;
        onCancel: () => void;
        saveButtonVisible?: boolean;
        cancelButtonVisible?: boolean;
    }

    const MAX_HEADERS = 8;
    const HEADERS = Object.keys(DECK_DEFAULT_HEADER).map((key) => {
        return {
            key,
            label: DECK_DEFAULT_HEADER[key]
        }
    });

    let { mode = 'add', deck = $bindable(), 
        onSave, onCancel = () => {},
        saveButtonVisible = true, cancelButtonVisible = true
    // @ts-expect-error
    }: Props = $props<Props>();

    let deckName = $state("");
    
    let headers = $state<Array<Header>>(HEADERS);
    let draggedIndex = $state<number | null>(null);
    let dragOverIndex = $state<number | null>(null);
    let columnCounter = $state(headers.length);

    // Initial
    $effect(() => {
        untrack(() => {
            if (mode === 'edit' && deck && deck?.headersorder) {
                deckName = deck.name;
                const headersArray: Array<Header> = (deck.headersorder as unknown as Array<string>).map(key => ({
                    key,
                    label: (deck.headersdata as unknown as Record<string, string>)[key]
                }));
                headers = headersArray;
                columnCounter = headers.length;
            } 
            draggedIndex = null;
        })
    });


    // sync changes back to bound deck object
    $effect(() => {
        if (mode === 'edit' && deck) {
            const headersData: Record<string, string> = {};
            headers.forEach(header => {
                headersData[header.key] = header.label;
            });
            
            deck.name = deckName;
            deck.headersdata = headersData;
            deck.headersorder = headers.map((h) => h.key);
        }
    });

    

    function handleAddColumn() {
        if (headers.length < MAX_HEADERS) {
            columnCounter++;
            headers.push({ key: columnCounter.toString(), label: `` });
            headers = headers;
        }
    }

    function handleRemoveColumn(index: number) {
        if (headers.length > 3) { // Keep at least the 3 default headers
            headers.splice(index, 1);
            headers = headers;
        }
    }

    function handleDragStart(e: DragEvent, index: number) {
        const target = e.target as HTMLElement;
        // Only allow drag if started from the grip element or its children
        if (!target.closest('.drag-handle')) {
            e.preventDefault();
            return;
        }
        draggedIndex = index;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
        }
    }

    function handleDragOver(e: DragEvent, index: number) {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = "move";
        }
        if (draggedIndex !== null && draggedIndex !== index) {
            dragOverIndex = index;
        }
    }

    function handleDrop(e: DragEvent, targetIndex: number) {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== targetIndex) {
            const draggedHeader = headers[draggedIndex];
            headers.splice(draggedIndex, 1);
            headers.splice(targetIndex, 0, draggedHeader);
            headers = headers;
        }
        draggedIndex = null;
        dragOverIndex = null;
    }

    function handleDragEnd() {
        draggedIndex = null;
        dragOverIndex = null;
    }

    function handleDragEnter(e: DragEvent, index: number) {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            dragOverIndex = index;
        }
    }

    function handleFormSave() {
        // Check if all headers have non-empty names
        const hasEmptyHeader = headers.some(h => !h.label.trim());
        
        if (!deckName.trim() || hasEmptyHeader || !onSave) {
            return;
        }

        const headersData: Record<string, string> = {} 
        headers.forEach(header => {
            headersData[header.key] = header.label;
        });
        
        // Update the bound deck object directly
        if (deck) {
            deck.name = deckName;
            deck.headersdata = headersData;
            deck.headersorder = headers.map((h) => h.key);
        }

        const deckData: DeckEditableData = {
            name: deckName,
            headersdata: headersData,
            headersorder: headers.map((h) => h.key),
            settings: {}
        };

        onSave(deckData);
    }
</script>

<div class="space-y-6 py-4">
    <!-- Deck Name -->
    <div class="space-y-2">
        <label for="deckName" class="text-sm font-medium">
            Deck Name
        </label>
        <input
            id="deckName"
            bind:value={deckName}
            type="text"
            placeholder="Enter deck name"
            class="w-full px-3 py-2 border rounded-md text-sm dark:text-black"
        />
    </div>

    <!-- Headers Configuration -->
    <Accordion.Root value={["headers"]} class="mb-0 pb-0">
        <Accordion.Item value="headers">
            <Accordion.Trigger class="py-3 cursor-pointer">
                Column Headers ({headers.length}/{MAX_HEADERS})
            </Accordion.Trigger>
            <Accordion.Content>
                <div class="text-xs text-accent-foreground">* the first column is the front side/question side of the card</div>
                <div class="space-y-3">
                    {#each headers as header, index}
                        {@const isDefault = Object.keys(DECK_DEFAULT_HEADER).includes(header.key)}
                        <div 
                            class="flex gap-2 items-end p-3 border rounded-md {index === 0 ? "border-accent-foreground" : ''} transition-all {draggedIndex === index ? 'opacity-50 bg-muted' : dragOverIndex === index ? 'border-2 border-primary bg-primary/5 scale-105' : ''} {isDefault ? 'bg-muted/30' : ''}"
                            role="listitem"
                            ondragover={(e) => handleDragOver(e, index)}
                            ondrop={(e) => handleDrop(e, index)}
                            ondragend={handleDragEnd}
                            ondragenter={(e) => handleDragEnter(e, index)}
                        >
                            <div 
                                class="flex-none cursor-grab active:cursor-grabbing drag-handle"
                                role="banner"
                                draggable="true"
                                ondragstart={(e) => handleDragStart(e, index)}
                            >
                                <div class="text-xs text-center">{header.key}</div>
                                <GripVerticalIcon class="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div class="flex-1 space-y-2">
                                <input
                                    id={`header-${index}`}
                                    bind:value={header.label}
                                    type="text"
                                    readonly={isDefault}
                                    ondragstart={(e) => e.preventDefault()}
                                    class="w-full px-3 py-2 border rounded-md text-sm {isDefault ? 'bg-muted dark:text-zinc-300' : 'dark:text-black'}"
                                />
                            </div>
                            {#if !isDefault}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onclick={() => handleRemoveColumn(index)}
                                    class="cursor-pointer"
                                >
                                    <XIcon class="h-4 w-4" />
                                </Button>
                            {/if}
                        </div>
                    {/each}

                    {#if headers.length < MAX_HEADERS}
                        <Button
                            variant="outline"
                            size="sm"
                            onclick={handleAddColumn}
                            class="w-full cursor-pointer mt-4"
                        >
                            <PlusIcon class="h-4 w-4 mr-2" />
                            Add Column
                        </Button>
                    {/if}
                </div>
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
</div>

{#if cancelButtonVisible || saveButtonVisible}
    <div class="flex gap-2 justify-end pt-4">
        {#if cancelButtonVisible}
            <Button 
                onclick={onCancel} 
                variant="outline"
                class="cursor-pointer py-5"
            >
                Cancel
            </Button>
        {/if}
        {#if saveButtonVisible}
        <Button 
            onclick={handleFormSave} 
            disabled={!deckName.trim() || headers.some(h => !h.label.trim())}
            class="cursor-pointer py-5"
        >
            {mode === 'edit' ? 'Save Changes' : 'Create Deck'}
        </Button>
        {/if}
    </div>
{/if}
