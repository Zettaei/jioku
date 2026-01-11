<script lang="ts">
    import * as Card from '$lib/components/ui/card/index';
    import Button from '$lib/components/ui/button/button.svelte';
    import AddModal from '../../AddDeckModal.svelte';
    import type { DeckEditableData, DeckExtraSetting } from '$lib/types/deck';
    import DeckMetadataForm from '../../DeckMetadataForm.svelte';
    import * as Accordion from '$lib/components/ui/accordion/index';


    let { data } = $props();

    let deckId = $derived(data.deckId);
    let deck = $state(data.deck);
    let setting = $state<DeckExtraSetting>(data.deck?.settings as unknown as DeckExtraSetting ?? {});

    // listen to url change
    $effect(() => {
        deck = data.deck;
    })

    function handleEditSave(deckData: DeckEditableData) {
        // TODO: Implement edit API call
        console.log('Save deck:', deckId, deckData);
    }
</script>

<div class="flex justify-center gap-0">
    <Card.Root class="text-center px-auto max-w-xl w-full">
    {#if !deck}
        <div>Deck Not Founded or Incorrect Permission</div>
    {:else}
        <Card.Header>
            <div class="flex justify-between items-center">
                <div>
                    <span class="text-xl font-bold">Deck:</span> <span class="text-lg">{deck?.name}</span>
                </div>
            </div>
        </Card.Header>
        <Card.Content>
            <Accordion.Root value={["extra"]}>
                <Accordion.AccordionItem>
                    <DeckMetadataForm mode="edit" bind:deck={deck} 
                        onSave={handleEditSave} onCancel={() => {}}
                        saveButtonVisible={false} cancelButtonVisible={false}
                    />
                </Accordion.AccordionItem>
                <Accordion.AccordionItem value="extra">
                    <Accordion.Trigger>
                        Extra Setting
                    </Accordion.Trigger>
                    <Accordion.Content>
                        <!-- Field -->
                    </Accordion.Content>
                </Accordion.AccordionItem>
            </Accordion.Root>
        </Card.Content>
    {/if}
    </Card.Root>
</div>