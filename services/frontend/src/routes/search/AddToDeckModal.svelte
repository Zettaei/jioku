<script lang="ts">
    // @ts-nocheck
    // NOTE: This entire file is pure vibe-code with my bad wording, spent lots of time with the AI goddarn
    // hence the messy and so many lines, sry though but I won't change this ToT.

    import * as Dialog from "$lib/components/ui/dialog/index";
    import * as Accordion from "$lib/components/ui/accordion/index";
    import * as Select from "$lib/components/ui/select/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { deckListStore, type DeckListItem } from "$lib/stores/deckList";
    import { fetchUserDecksBareMinimum } from "../deck/services";
    import { LocalStorageKey } from "$lib/localStorage";

    interface Props {
        isOpen: boolean;
        onSave: (data: { deckId: string; card: { data: Record<string, string> } }) => void;
        initialData?: { kanji?: string; reading?: string; meaning?: string };
    }

    let { isOpen = $bindable(), onSave, initialData } = $props();

    let selectedDeckId = $state<string | null>(null);
    let editingData = $state<Record<string, string>>({});
    let lastIsOpen = $state(false);
    let kanjiMode = $state<'selecting' | 'editing'>('selecting');
    let readingMode = $state<'selecting' | 'editing'>('selecting');
    let meaningMode = $state<'selecting' | 'editing'>('selecting');
    let meaningShowPOS = $state(true); // Show or hide POS tags in meanings
    let selectedItems = $state<Set<string>>(new Set()); // Track selected items: 'kanji_0', 'kanji_1', 'reading_0', 'reading_1', 'meaning_0', etc.
    let scrollPosition = $state(0);
    let dialogContent: HTMLElement | null = $state(null);

    let selectedDeck = $derived<DeckListItem | null>(
        $deckListStore.decks.find(d => d.id === selectedDeckId) ?? null
    );

    let headers = $derived.by(() => {
        const deck = selectedDeck;
        if (!deck?.headersdata || !deck?.headersorder) return [];
        const headersData = deck.headersdata as Record<string, string>;
        const headersOrder = deck.headersorder as string[];
        return headersOrder.map(key => ({ key, label: headersData[key] || key }));
    });

    // Parse readings and meanings into arrays
    let parsedKanji = $derived.by(() => {
        if (!initialData?.kanji) return [];
        return initialData.kanji.split(';').map(k => k.trim()).filter(k => k);
    });

    let parsedReadings = $derived.by(() => {
        if (!initialData?.reading) return [];
        return initialData.reading.split(';').map(r => r.trim()).filter(r => r);
    });

    let parsedMeanings = $derived.by(() => {
        if (!initialData?.meaning) return [];
        
        const meaningStr = initialData.meaning;
        const grouped: string[] = [];
        
        // Match pattern: [POS with possible semicolons]; meaning
        // where meaning stops at the next [ or end of string
        const pattern = /\[([^\]]+)\];\s*([^[]*?)(?=(?:\[|$))/g;
        let match;
        
        while ((match = pattern.exec(meaningStr)) !== null) {
            const pos = `[${match[1]}]`;
            let meanings = match[2].trim();
            
            // Remove trailing semicolon if present
            if (meanings.endsWith(';')) {
                meanings = meanings.slice(0, -1).trim();
            }
            
            const groupStr = pos + '\n' + meanings;
            grouped.push(groupStr);
        }
        
        return grouped;
    });

    // Load POS setting from localStorage on mount and when modal opens
    $effect(() => {
        if (isOpen) {
            const savedMeaningShowPOS = typeof window !== 'undefined' 
                ? localStorage.getItem(LocalStorageKey.AddToDeckMeaningShowPOS)
                : null;
            if (savedMeaningShowPOS !== null) {
                meaningShowPOS = savedMeaningShowPOS === 'true';
            }
        }
    });

    // Initialize selected items from initialData with defaults
    $effect(() => {
        if (initialData) {
            const available = new Set<string>();
            // Kanji: select all by default
            parsedKanji.forEach((_, idx) => available.add(`kanji_${idx}`));
            // Reading: select all by default
            parsedReadings.forEach((_, idx) => available.add(`reading_${idx}`));
            // Meaning: select first 4 by default
            parsedMeanings.forEach((_, idx) => {
                if (idx < 4) available.add(`meaning_${idx}`);
            });
            selectedItems = available;
        }
    });

    // When selectedItems changes or modes change, update editing data
    $effect(() => {
        // Include modes in dependencies to force recalculation on mode changes
        void kanjiMode;
        void readingMode;
        void meaningMode;
        void meaningShowPOS;
        
        const currentHeaders = headers;
        const newData: Record<string, string> = {};
        
        currentHeaders.forEach(h => {
            let value = '';
            
            if (h.key.toLowerCase().includes('kanji')) {
                const selectedKanji = parsedKanji
                    .map((kanji, idx) => selectedItems.has(`kanji_${idx}`) ? kanji : null)
                    .filter((k): k is string => k !== null);
                value = selectedKanji.join('\n');
            } else if (h.key.toLowerCase().includes('reading')) {
                const selectedReadings = parsedReadings
                    .map((reading, idx) => selectedItems.has(`reading_${idx}`) ? reading : null)
                    .filter((r): r is string => r !== null);
                value = selectedReadings.join('\n');
            } else if (h.key.toLowerCase().includes('meaning')) {
                // Format meanings with newlines: single newline in group, double between groups
                const meaningGroups: string[] = [];
                if (initialData?.meaning) {
                    const pattern = /\[([^\]]+)\];\s*([^[]*?)(?=(?:\[|$))/g;
                    let match;
                    let idx = 0;
                    
                    while ((match = pattern.exec(initialData.meaning)) !== null) {
                        if (selectedItems.has(`meaning_${idx}`)) {
                            const pos = `[${match[1]}]`;
                            let meanings = match[2].trim();
                            
                            // Remove trailing semicolon if present
                            if (meanings.endsWith(';')) {
                                meanings = meanings.slice(0, -1).trim();
                            }
                            
                            if (meaningShowPOS) {
                                meaningGroups.push(pos + '\n' + meanings);
                            } else {
                                meaningGroups.push(meanings);
                            }
                        }
                        idx++;
                    }
                }
                value = meaningShowPOS ? meaningGroups.map(g => g + ';').join('\n\n') : meaningGroups.map(g => g + ';').join('\n');
            }
            
            newData[h.key] = value;
        });
        editingData = newData;

        // Trigger height adjustment after data is populated
        setTimeout(() => {
            document.querySelectorAll('textarea').forEach(textarea => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        }, 0);
    });

    // On open: load decks if needed, select last deck or first one
    $effect(() => {
        if (isOpen && !lastIsOpen) {
            lastIsOpen = true;

            if ($deckListStore.decks.length === 0 && !$deckListStore.isLoading) {
                deckListStore.update(s => ({ ...s, isLoading: true }));
                fetchUserDecksBareMinimum()
                    .then(res => {
                        deckListStore.update(s => ({
                            ...s,
                            decks: res.result,
                            isLoading: false,
                        }));
                        if (!selectedDeckId && res.result.length > 0) {
                            const deckToSelect = $deckListStore.lastSelectedDeckId && res.result.some(d => d.id === $deckListStore.lastSelectedDeckId)
                                ? $deckListStore.lastSelectedDeckId
                                : res.result[0].id;
                            selectedDeckId = deckToSelect;
                        }
                    })
                    .catch(() => {
                        deckListStore.update(s => ({ ...s, isLoading: false }));
                    });
            } else if ($deckListStore.decks.length > 0 && !selectedDeckId) {
                const deckToSelect = $deckListStore.lastSelectedDeckId && $deckListStore.decks.some(d => d.id === $deckListStore.lastSelectedDeckId)
                    ? $deckListStore.lastSelectedDeckId
                    : $deckListStore.decks[0].id;
                selectedDeckId = deckToSelect;
            }
        } else if (!isOpen) {
            lastIsOpen = false;
        }
    });

    function handleSave() {
        if (!selectedDeckId) return;
        onSave?.({ deckId: selectedDeckId, card: { data: editingData } });
        isOpen = false;
    }

    function handleCancel() {
        isOpen = false;
    }

    function toggleItemSelection(key: string) {
        if (selectedItems.has(key)) {
            selectedItems.delete(key);
        } else {
            selectedItems.add(key);
        }
        selectedItems = selectedItems; // Trigger reactivity
    }

    function toggleKanjiMode() {
        if (dialogContent) {
            scrollPosition = dialogContent.scrollTop;
        }
        kanjiMode = kanjiMode === 'selecting' ? 'editing' : 'selecting';
        // Restore scroll after DOM updates
        setTimeout(() => {
            if (dialogContent) {
                dialogContent.scrollTop = scrollPosition;
            }
        }, 0);
    }

    function toggleReadingMode() {
        if (dialogContent) {
            scrollPosition = dialogContent.scrollTop;
        }
        readingMode = readingMode === 'selecting' ? 'editing' : 'selecting';
        // Restore scroll after DOM updates
        setTimeout(() => {
            if (dialogContent) {
                dialogContent.scrollTop = scrollPosition;
            }
        }, 0);
    }

    function toggleMeaningMode() {
        if (dialogContent) {
            scrollPosition = dialogContent.scrollTop;
        }
        meaningMode = meaningMode === 'selecting' ? 'editing' : 'selecting';
        // Restore scroll after DOM updates
        setTimeout(() => {
            if (dialogContent) {
                dialogContent.scrollTop = scrollPosition;
            }
        }, 0);
    }

    function toggleMeaningPOS() {
        meaningShowPOS = !meaningShowPOS;
        if (typeof window !== 'undefined') {
            localStorage.setItem(LocalStorageKey.AddToDeckMeaningShowPOS, String(meaningShowPOS));
        }
    }

    function selectAllKanji() {
        const items = new Set(selectedItems);
        parsedKanji.forEach((_, idx) => items.add(`kanji_${idx}`));
        selectedItems = items;
    }

    function deselectAllKanji() {
        const items = new Set(selectedItems);
        parsedKanji.forEach((_, idx) => items.delete(`kanji_${idx}`));
        selectedItems = items;
    }

    function selectAllReadings() {
        const items = new Set(selectedItems);
        parsedReadings.forEach((_, idx) => items.add(`reading_${idx}`));
        selectedItems = items;
    }

    function deselectAllReadings() {
        const items = new Set(selectedItems);
        parsedReadings.forEach((_, idx) => items.delete(`reading_${idx}`));
        selectedItems = items;
    }

    function selectAllMeanings() {
        const items = new Set(selectedItems);
        parsedMeanings.forEach((_, idx) => items.add(`meaning_${idx}`));
        selectedItems = items;
    }

    function deselectAllMeanings() {
        const items = new Set(selectedItems);
        parsedMeanings.forEach((_, idx) => items.delete(`meaning_${idx}`));
        selectedItems = items;
    }

    function truncateName(name: string, maxLength: number = 45): string {
        return name.length > maxLength ? name.slice(0, maxLength) + "..." : name;
    }

    function adjustTextareaHeight(e: Event) {
        const textarea = e.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function getMeaningDisplay(meaning: string): string {
        if (meaningShowPOS) {
            return meaning;
        }
        // Strip POS part: remove everything before and including the newline
        const lines = meaning.split('\n');
        if (lines.length > 1) {
            return lines.slice(1).join('\n');
        }
        return meaning;
    }
</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content bind:this={dialogContent} class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
            <Dialog.Title class="text-center">Add to Deck</Dialog.Title>
        </Dialog.Header>

        <div class="space-y-6 py-4">
            <!-- Deck Selector -->
            <div class="space-y-2 max-w-full">
                <label for="deck-select" class="text-sm font-medium">Deck</label>
                <Select.Root
                    type="single"
                    value={selectedDeckId ?? ""}
                    onValueChange={(val) => {
                        selectedDeckId = val;
                        deckListStore.update(s => ({ ...s, lastSelectedDeckId: val }));
                    }}
                >
                    <Select.Trigger id="deck-select" class="w-full">
                        {#if $deckListStore.isLoading}
                            Loading decks...
                        {:else}
                            {truncateName(selectedDeck?.name ?? "Select a deck...")}
                        {/if}
                    </Select.Trigger>
                    <Select.Content class="max-w-sm">
                        {#each $deckListStore.decks as deck}
                            <Select.Item value={deck.id} disabled={selectedDeckId === deck.id}>
                                {truncateName(deck.name)}
                            </Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>

            {#if selectedDeck}
                <!-- Essential Fields -->
                <Accordion.Root type="multiple" value={["essential-fields"]}>
                    <Accordion.Item value="essential-fields">
                        <Accordion.Trigger class="py-3 cursor-pointer">Essential Fields</Accordion.Trigger>
                        <Accordion.Content>
                            <div class="space-y-6 pt-4">
                                <!-- Kanji Section -->
                                {#if parsedKanji.length > 0}
                                    <div class="space-y-2">
                                        <div class="flex items-center justify-between">
                                            <h4 class="text-sm font-medium">Kanji</h4>
                                            {#if kanjiMode === 'selecting'}
                                                <div class="flex items-center gap-2">
                                                    <div class="flex items-center border rounded">
                                                        <Button
                                                            onclick={selectAllKanji}
                                                            variant="ghost"
                                                            size="sm"
                                                            class="cursor-pointer text-xs rounded-none border-r"
                                                        >
                                                            All
                                                        </Button>
                                                        <Button
                                                            onclick={deselectAllKanji}
                                                            variant="ghost"
                                                            size="sm"
                                                            class="cursor-pointer text-xs rounded-none"
                                                        >
                                                            None
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        onclick={toggleKanjiMode}
                                                        variant="outline"
                                                        size="sm"
                                                        class="cursor-pointer text-xs"
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            {:else}
                                                <Button
                                                    onclick={toggleKanjiMode}
                                                    variant="outline"
                                                    size="sm"
                                                    class="cursor-pointer text-xs"
                                                >
                                                    Select
                                                </Button>
                                            {/if}
                                        </div>
                                        
                                        {#if kanjiMode === 'selecting'}
                                            <div class="space-y-2">
                                                {#each parsedKanji as kanji, idx (idx)}
                                                    <label class="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.has(`kanji_${idx}`)}
                                                            onchange={() => toggleItemSelection(`kanji_${idx}`)}
                                                            class="w-4 h-4"
                                                        />
                                                        <span class="text-sm font-mono">{kanji}</span>
                                                    </label>
                                                {/each}
                                            </div>
                                        {:else}
                                            <textarea
                                                bind:value={editingData[headers.find(h => h.key.toLowerCase().includes('kanji'))?.key ?? '']}
                                                oninput={adjustTextareaHeight}
                                                class="w-full h-auto px-3 py-2 border rounded-md text-sm dark:text-black"
                                            ></textarea>
                                        {/if}
                                    </div>
                                {/if}

                                <!-- Reading Section -->
                                {#if parsedReadings.length > 0}
                                    <div class="space-y-2">
                                        <div class="flex items-center justify-between">
                                            <h4 class="text-sm font-medium">Readings</h4>
                                            {#if readingMode === 'selecting'}
                                                <div class="flex items-center gap-2">
                                                    <div class="flex items-center border rounded">
                                                        <Button
                                                            onclick={selectAllReadings}
                                                            variant="ghost"
                                                            size="sm"
                                                            class="cursor-pointer text-xs rounded-none border-r"
                                                        >
                                                            All
                                                        </Button>
                                                        <Button
                                                            onclick={deselectAllReadings}
                                                            variant="ghost"
                                                            size="sm"
                                                            class="cursor-pointer text-xs rounded-none"
                                                        >
                                                            None
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        onclick={toggleReadingMode}
                                                        variant="outline"
                                                        size="sm"
                                                        class="cursor-pointer text-xs"
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            {:else}
                                                <Button
                                                    onclick={toggleReadingMode}
                                                    variant="outline"
                                                    size="sm"
                                                    class="cursor-pointer text-xs"
                                                >
                                                    Select
                                                </Button>
                                            {/if}
                                        </div>

                                        {#if readingMode === 'selecting'}
                                            <div class="space-y-2">
                                                {#each parsedReadings as reading, idx (idx)}
                                                    <label class="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.has(`reading_${idx}`)}
                                                            onchange={() => toggleItemSelection(`reading_${idx}`)}
                                                            class="w-4 h-4"
                                                        />
                                                        <span class="text-sm font-mono">{reading}</span>
                                                    </label>
                                                {/each}
                                            </div>
                                        {:else}
                                            <textarea
                                                bind:value={editingData[headers.find(h => h.key.toLowerCase().includes('reading'))?.key ?? '']}
                                                oninput={adjustTextareaHeight}
                                                class="w-full h-auto px-3 py-2 border rounded-md text-sm dark:text-black"
                                            ></textarea>
                                        {/if}
                                    </div>
                                {/if}

                                <!-- Meaning Section -->
                                {#if parsedMeanings.length > 0}
                                    <div class="space-y-2">
                                        <div class="flex items-center justify-between">
                                            <h4 class="text-sm font-medium">Meanings</h4>
                                            <div class="flex items-center gap-2">
                                                {#if meaningMode === "selecting"}
                                                    <span class="text-xs font-medium">POS</span>
                                                    <div class="flex items-center border rounded-full px-1 py-0.5">
                                                        <button
                                                            onclick={toggleMeaningPOS}
                                                            class="px-2 py-0.5 text-xs font-medium cursor-pointer rounded-full transition-all"
                                                            class:bg-foreground={meaningShowPOS}
                                                            class:text-background={meaningShowPOS}
                                                            class:text-foreground={!meaningShowPOS}
                                                        >
                                                            O
                                                        </button>
                                                        <button
                                                            onclick={toggleMeaningPOS}
                                                            class="px-2 py-0.5 text-xs font-medium cursor-pointer rounded-full transition-all"
                                                            class:bg-foreground={!meaningShowPOS}
                                                            class:text-background={!meaningShowPOS}
                                                            class:text-foreground={meaningShowPOS}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                    <div class="flex items-center border rounded">
                                                        <Button
                                                            onclick={selectAllMeanings}
                                                            variant="ghost"
                                                            size="sm"
                                                            class="cursor-pointer text-xs rounded-none border-r"
                                                        >
                                                            All
                                                        </Button>
                                                        <Button
                                                            onclick={deselectAllMeanings}
                                                            variant="ghost"
                                                            size="sm"
                                                            class="cursor-pointer text-xs rounded-none"
                                                        >
                                                            None
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        onclick={toggleMeaningMode}
                                                        variant="outline"
                                                        size="sm"
                                                        class="cursor-pointer text-xs"
                                                    >
                                                        Edit
                                                    </Button>
                                                {:else}
                                                    <Button
                                                        onclick={toggleMeaningMode}
                                                        variant="outline"
                                                        size="sm"
                                                        class="cursor-pointer text-xs"
                                                    >
                                                        Select
                                                    </Button>
                                                {/if}
                                            </div>
                                        </div>

                                        {#if meaningMode === 'selecting'}
                                            <div class="space-y-2">
                                                {#each parsedMeanings as meaning, idx (idx)}
                                                    <label class="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.has(`meaning_${idx}`)}
                                                            onchange={() => toggleItemSelection(`meaning_${idx}`)}
                                                            class="w-4 h-4"
                                                        />
                                                        <span class="text-sm whitespace-pre-wrap">{getMeaningDisplay(meaning)}</span>
                                                    </label>
                                                {/each}
                                            </div>
                                        {:else}
                                            <textarea
                                                bind:value={editingData[headers.find(h => h.key.toLowerCase().includes('meaning'))?.key ?? '']}
                                                oninput={adjustTextareaHeight}
                                                class="w-full h-auto px-3 py-2 border rounded-md text-sm dark:text-black"
                                            ></textarea>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>

                <!-- Other Fields -->
                <Accordion.Root type="multiple" value={["card-data"]}>
                    <Accordion.Item value="card-data">
                        <Accordion.Trigger class="py-3 cursor-pointer">Other Fields</Accordion.Trigger>
                        <Accordion.Content>
                            <div class="space-y-4 pt-4">
                                {#each headers as header (header.key)}
                                    {#if !header.key.toLowerCase().includes('kanji') && !header.key.toLowerCase().includes('reading') && !header.key.toLowerCase().includes('meaning')}
                                        <div class="space-y-2">
                                            <label for={header.key} class="text-sm font-medium">
                                                {header.label}
                                            </label>
                                            <textarea
                                                id={header.key}
                                                bind:value={editingData[header.key]}
                                                oninput={adjustTextareaHeight}
                                                class="w-full h-auto px-3 py-2 border rounded-md text-sm dark:text-black"
                                            ></textarea>
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>
            {/if}
        </div>

        <Dialog.Footer>
            <Button
                onclick={handleCancel}
                variant="outline"
                class="cursor-pointer"
            >
                Cancel
            </Button>
            <Button
                onclick={handleSave}
                class="cursor-pointer py-5"
                disabled={!selectedDeckId || $deckListStore.isLoading}
            >
                Add Card
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
