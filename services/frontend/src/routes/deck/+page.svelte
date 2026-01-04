<script lang="ts">
    import { DECK_LIST_TOOLBAR_CONTEXT, DeckListToolbarContextClass, type DeckListToolbarContextInterface } from '$lib/context/deckToolbar.svelte.js';
    import { getContext, onMount, setContext, untrack } from 'svelte';
    import { fetchUserDecks } from './services.js';
    import * as Card from '$lib/components/ui/card/index';
    import type { GetDecksStudyRouteResponse } from '$lib/types/server/modules/deck/type/study_dto.js';
    import { cn } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from '$lib/context/toolbar.js';
    import Loading from '../Loading.svelte';
    import DeckListToolbar from './DeckListToolbar.svelte';
    
    const SUB_BUTTON_STYLE = cn("flex-4 py-2 hover:bg-accent cursor-pointer");
    const STUDY_BUTTON_STYLE = cn("flex-4 rounded-tr-2xl hover:bg-accent cursor-pointer");

    let decks = $state<GetDecksStudyRouteResponse>();
    let isLoading = $state<boolean>(true);


    // NOTE: because of this page, I should RETHINK how the toolbar work (BTW, HOW DOES IT EVEN WORK NOW????) 
    // REMEMBER - component are mount from child to parent when page reload (so parent will override child if it use the same context)
    const DeckListToolbarContext = new DeckListToolbarContextClass();
    // This page doesn't need to set the DECK_LIST_TOOLBAR_CONTEXT;

    const setToolbar = getContext<ToolbarSetter>(TOOLBAR_SNIPPET_CONTEXT);

    onMount(() => {
        
        // THIS THROW UNHANDLED ERROR
        fetchUserDecks()
        .then((result) => {
            decks = result;
        })
        .catch((err) => {
            throw err;
        })
        .finally(() => {
            isLoading = false;
        });

        setToolbar(toolbarSnippet);

        return () => {
            setToolbar(null);
        };
    })

    $effect(() => {
        const searchText = DeckListToolbarContext.searchText;

        if(searchText === "") {
            return;
        }

        untrack(async () => {
            isLoading = true;
            try {
                decks = await fetchUserDecks();
            }
            finally {
                isLoading = false;
        }
    });
  });

  function onClickStudy(deckId: string) {
    goto("/deck/" + deckId + "/study")
  }
  function onClickStatus(deckId: string) {
    goto("/deck/" + deckId + "/status")
  }
  function onClickBrowse(deckId: string) {
    goto("/deck/" + deckId + "/browse")
  }
  function onClickSetting(deckId: string) {
    goto("/deck/" + deckId + "/setting")
  }

</script>


<div class="flex flex-col items-center w-full">
    <div class="text-2xl font-bold mb-10">
        Deck List
    </div>

    {#if !isLoading}
        {#each decks?.result as deck}    
            {@const due = deck.today_dues}
            <Card.Root class="w-full max-w-160 py-0 gap-0">
                <div class="flex justify-between">
                    <div class="flex-8 py-4 px-6">
                        <div class="text-lg">{deck.name}</div>

                        <div class="space-x-2 text-xs">
                            <!-- I ignored CardStatusType for convenience sake  -->
                            <span>{"new: "}{due[0].count}</span>
                            <span>{"due: "}{due[1].count}</span>
                            <span>{"retry: "}{due[2].count}</span>
                        </div>
                    </div>
                    <button class={STUDY_BUTTON_STYLE} onclick={() => onClickStudy(deck.id)}>
                        Study
                    </button>
                </div>
                <div class="flex border-border border-t-2">
                    <button class="rounded-bl-2xl {SUB_BUTTON_STYLE}"
                    onclick={() => onClickStatus(deck.id)}>
                        Status
                    </button>
                    <button class="border-border border-x-2 {SUB_BUTTON_STYLE}" 
                    onclick={() => onClickBrowse(deck.id)}>
                        Browse
                    </button>
                    <button class="rounded-br-2xl {SUB_BUTTON_STYLE}"
                    onclick={() => onClickSetting(deck.id)}>
                        Setting
                    </button>
                </div>
            </Card.Root>
        {/each}
    {:else}
        <Loading/>
    {/if}
</div>

{#snippet toolbarSnippet()}
    <DeckListToolbar toolbarContext={DeckListToolbarContext}/>
{/snippet}