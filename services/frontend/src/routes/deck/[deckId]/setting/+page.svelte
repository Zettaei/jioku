<script lang="ts">
    import * as Card from '$lib/components/ui/card/index';
    import Button from '$lib/components/ui/button/button.svelte';
    import type { DeckEditableData, DeckExtraSetting } from '$lib/types/deck';
    import DeckMetadataForm from '../../DeckMetadataForm.svelte';
    import * as Accordion from '$lib/components/ui/accordion/index';
    import { DECK_EXTRA_SETTING_DEFAULT_HEADER, DECK_EXTRA_SETTING_DEFAULT_VALUE } from '$lib/constant/deck.js';
    import { untrack } from 'svelte';
    import { updateDeck } from './services';
    import type { Json } from '$lib/types/server/core/supabase/generatedType.js';
    import { BadRequestError } from '$lib/errors/HttpError.js';
    import { CheckIcon } from '@lucide/svelte';
    import { goto } from '$app/navigation';


    let { data } = $props();

    let deckId = $derived(data.deckId);
    let deck = $state(data.deck);
    let setting = $state<DeckExtraSetting>((deck?.settings as unknown as DeckExtraSetting) ?? {});
    let isSaving = $state(false);
    let isSaved = $state(false);

    // SETTING STUFF
    let newCardLimitPerDay = $state<number>(setting.newLimit !== undefined ?
        setting.newLimit : (DECK_EXTRA_SETTING_DEFAULT_VALUE.newLimit as number)
    );

    ////////////////
    

    // listen to url change
    $effect(() => {
        const listen = data;

        untrack(() => {
            deck = listen.deck;
            setting = deck?.settings as unknown as DeckExtraSetting ?? {};
        })
    })

    function handleSettingSave() {
            const settings: DeckExtraSetting = {
                newLimit: newCardLimitPerDay
            };

            if(!deck?.headersdata || !deck?.headersorder || deck?.name === '') {
                throw new BadRequestError("Please fill every field");
            }

            const updatedDeck: DeckEditableData = {
                name: deck.name,
                headersorder: deck.headersorder,
                headersdata: deck.headersdata,
                settings: (settings as unknown as Json)
            };
            
            isSaving = true
            updateDeck(deckId, updatedDeck)
            .then(() => {
                isSaved = true;
            })
            .catch(() => {
                isSaving = false;
            })
            
    }

    function goToDeck() {
        goto("/deck");
    }
</script>

<div class="flex justify-center gap-0">
    <Card.Root class="text-center px-auto max-w-xl w-full">
    {#if isSaving}
        <Card.Content>
            {#if isSaved}
                <div class="flex w-full justify-center text-center mb-5">
                    <CheckIcon class="text-green-500 me-2"/> Deck<span class="font-bold px-2">{deck?.name}</span>has been updated.
                </div>
                <div>
                    <Button variant="outline" class="px-10 py-3" onclick={goToDeck}>Go to Deck</Button>
                </div>
            {:else}
                <div>Saving</div>
            {/if}
        </Card.Content>
    {:else}
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
                            onSave={() => {}} onCancel={() => {}}
                            saveButtonVisible={false} cancelButtonVisible={false}
                        />
                    </Accordion.AccordionItem>
                    <Accordion.AccordionItem value="extra">
                        <Accordion.Trigger>
                            Extra Setting
                        </Accordion.Trigger>
                        <Accordion.Content>
                            <div class="flex space-y-6 py-4">
                                <!-------------------- SETTING STUFF ---------------------->
                                <div class="flex justify-star text-start">
                                    <div class="flex-6/12">
                                        <label for="newCardLimit" class="text-sm font-medium">
                                            New Card Limit Per Day
                                        </label>
                                        <input
                                            id="newCardLimit"
                                            bind:value={newCardLimitPerDay}
                                            type="number"
                                            min="0"
                                            placeholder="Enter new card limit"
                                            class="border rounded-md text-sm dark:text-black"
                                        />
                                    </div>

                                    <div class="flex-6/12">

                                    </div>
                                    
                                </div>
                                <!---------------------------  ---------------------------->

                            </div>
                        </Accordion.Content>
                    </Accordion.AccordionItem>
                </Accordion.Root>

                <div class="flex justify-end mt-12 gap-2">
                    <Button 
                        onclick={goToDeck}
                        class="cursor-pointer py-5 px-5"
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onclick={handleSettingSave}
                        class="cursor-pointer py-5 px-5"
                        variant="default"
                    >
                        Save
                    </Button>
                </div>
            </Card.Content>
        {/if}
    {/if}
    </Card.Root>
</div>