<script lang="ts">
    import * as Card from '$lib/components/ui/card/index';
    import Button from '$lib/components/ui/button/button.svelte';
    import type { DeckEditableData, DeckExtraSetting } from '$lib/types/deck';
    import DeckMetadataForm from '../../DeckMetadataForm.svelte';
    import * as Accordion from '$lib/components/ui/accordion/index';
    import { DECK_EXTRA_SETTING_DEFAULT_VALUE } from '$lib/constant/deck.js';
    import { untrack } from 'svelte';
    import { deleteDeck, updateDeck } from './services';
    import type { Json } from '$lib/types/server/core/supabase/generatedType.js';
    import { BadRequestError } from '$lib/errors/HttpError.js';
    import { ArrowLeftIcon, CheckIcon, SaveIcon, TrashIcon } from '@lucide/svelte';
    import { goto } from '$app/navigation';
    import { useSidebar } from '$lib/components/ui/sidebar/index.js';
    import Confirmation from '$lib/components/Confirmation.svelte';
    import { page } from '$app/state';
    import { fetchDeckByDeckId } from '../../services.js';
    import { error } from '@sveltejs/kit';
    import { type DeckRow } from '$lib/types/server/core/supabase/type.js';
    import BackButton from '$lib/components/BackButton.svelte';
    import { SESSIONSTORAGE_PREV_DECK_LIST } from '$lib/constant/sessionStorageKey.js';

    const sidebar = useSidebar();

    // let { data } = $props();

    let backButtonRef: { click: () => void } | undefined = $state();

    let deckId = $state<string>('');
    let deck = $state<DeckRow>();
    let setting = $state<DeckExtraSetting>({} as DeckExtraSetting);
    let isLoading = $state(false);
    let isSaved = $state(false);
    let isDeleted = $state(false);
    let isError = $state(false);

    let confirmationDialogText = $state({
        title: "", message: ""
    });
    let showDeleteConfirmation = $state<boolean>(false);
   

    // SETTING STUFF
    let newCardLimitPerDay = $state<number>(DECK_EXTRA_SETTING_DEFAULT_VALUE.newLimit as number);

    ////////////////
    

    // listen to url change
    $effect(() => {
        const deckId = page.params.deckId;
        if(!deckId) return;

        isLoading = true;

        untrack(() => {
            fetchDeckByDeckId(deckId)
            .then((deckResult) => {
                deck = deckResult;
                setting = (deck?.settings as unknown as DeckExtraSetting) ?? {};
                newCardLimitPerDay = (setting.newLimit as number) ?? (DECK_EXTRA_SETTING_DEFAULT_VALUE.newLimit as number)
            })
            .finally(() => {
                isLoading = false;
            });

        })
    })

    function handleSettingSave()
    : void
    {
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
            
            isLoading = true
            updateDeck(deckId!, updatedDeck)
            .then(() => {
                isSaved = true;
            })
            .catch((err) => {
                isLoading = false;
                throw err;
            })
            
    }

    function handleDeleteClick()
    : void 
    {
        confirmationDialogText = {
            title: "Delete Deck", message: `do you want to delete deck "${deck?.name}"?, process cannot be undone.`
        }
        showDeleteConfirmation = true;
    }

    function confirmDelete() {
        isLoading = true;
        deleteDeck(deckId!)
        .then(() => {
            isDeleted = true;
        })
        .catch((err) => {
            isLoading = false;
            throw err
        })
    }

    const backDestination = "/deck";
    function goToDeck() {
        goto("/deck");
    }

</script>

<Confirmation 
    bind:open={showDeleteConfirmation}
    title={confirmationDialogText.title}
    message={confirmationDialogText.message}
    onConfirm={confirmDelete}
    onCancel={() => {}}
/>

<div class="flex justify-center gap-0">
    <Card.Root class="text-center px-auto max-w-xl w-full">
    {#if isLoading}
        {@render Submitted()}
    {:else}
        {#if !deck}
            <div>Deck Not Founded or Incorrect Permission</div>
        {:else}
            <Card.Header>
                <div class="flex items-center">
                    <div class="flex flex-1 justify-start">
                        <BackButton bind:this={backButtonRef} 
                            destination={backDestination} sessionStorageKey={SESSIONSTORAGE_PREV_DECK_LIST}
                        />
                    </div>
                    <div class="flex-1">
                        <div class="text-xl font-bold">Deck</div>
                        <div class="text-lg">{deck?.name}</div>
                    </div>
                    <div class="flex flex-1 justify-end"></div>
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
                                            class="rounded-md text-sm dark:text-black"
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

                <div class="flex justify-between mt-12">
                    <div class="flex">
                        <Button 
                            onclick={handleDeleteClick}
                            class="cursor-pointer py-5"
                            variant="destructive"
                        >
                            <TrashIcon/>
                            {#if !sidebar.isMobile}
                                Delete
                            {/if}
                        </Button>
                    </div>
                    <div class="flex gap-2">
                        <Button 
                            onclick={() => backButtonRef?.click() }
                            class="cursor-pointer py-5"
                            variant="outline"
                        >
                            <ArrowLeftIcon/> Cancel
                        </Button>
                        <Button 
                            onclick={handleSettingSave}
                            class="cursor-pointer py-5"
                            variant="default"
                        >
                            <SaveIcon/> Save
                        </Button>
                    </div>
                </div>
            </Card.Content>
        {/if}
    {/if}
    </Card.Root>
</div>

{#snippet Submitted()}
    <Card.Content>
            {#if isSaved || isDeleted}
                <div class="flex w-full justify-center text-center mb-5">
                    <CheckIcon class="text-green-500 me-2"/> Deck<span class="font-bold px-2">{deck?.name}</span>has been {isDeleted ? "deleted" : "updated"}.
                </div>
                <div>
                    <Button variant="outline" class="px-10 py-3" onclick={() => backButtonRef?.click()}>Go to Deck</Button>
                </div>
            {:else}
                <div>Loading</div>
            {/if}
        </Card.Content>
{/snippet}