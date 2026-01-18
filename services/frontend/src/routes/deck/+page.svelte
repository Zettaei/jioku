<script lang="ts">
    import { DECK_LIST_TOOLBAR_CONTEXT, DeckListToolbarContextClass, type DeckListToolbarContextInterface } from '$lib/context/deckToolbar.svelte.js';
    import { getContext, onMount, setContext, untrack } from 'svelte';
    import { fetchUserDecks, createDeck } from './services.js';
    import * as Card from '$lib/components/ui/card/index';
    import * as Pagination from '$lib/components/ui/pagination/index';
    import type { GetDecksStudyRouteResponse } from '$lib/types/server/modules/deck/type/study_dto.js';
    import { cn } from '$lib/utils.js';
    import { goto } from '$app/navigation';
    import { TOOLBAR_SNIPPET_CONTEXT, type ToolbarSetter } from '$lib/context/toolbar.js';
    import { DECK_OPTIONS } from '$lib/constant/options.js';
    import Loading from '../Loading.svelte';
    import DeckListToolbar from './DeckListToolbar.svelte';
    import AddModal from './AddDeckModal.svelte';
    import type { DeckEditableData } from '$lib/types/deck.js';
    import Button from '$lib/components/ui/button/button.svelte';
    import { RefreshCwIcon } from '@lucide/svelte';
    
    const SUB_BUTTON_STYLE = cn("flex-4 py-2 hover:bg-accent cursor-pointer");
    const STUDY_BUTTON_STYLE = cn("flex-4 rounded-tr-2xl hover:bg-accent cursor-pointer");

    let decks = $state<GetDecksStudyRouteResponse>();
    let isLoading = $state<boolean>(true);
    let currentPage = $state(1);
    let pageLimit = $state(DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT);

    let pageChanged = $state(false);
    let isAddModalOpen = $state(false);

    // NOTE: because of this page, MAYBE I should RETHINK how the toolbar work (BTW, HOW DOES IT EVEN WORK NOW????) 
    // REMEMBER - component are mount from child to parent when page reload (so parent will override child if it use the same context)
    const DeckListToolbarContext = new DeckListToolbarContextClass();
    // This page doesn't need to set the DECK_LIST_TOOLBAR_CONTEXT;
    const setToolbar = getContext<ToolbarSetter>(TOOLBAR_SNIPPET_CONTEXT);


    function loadDeck() 
    : void 
    {
        isLoading = true;

        fetchUserDecks(currentPage, pageLimit)
        .then((result) => {
            decks = result;
        })
        .catch((err) => {
            throw err;
        })
        .finally(() => {
            isLoading = false;
        });
    }

    onMount(() => {
        loadDeck();

        setToolbar(toolbarSnippet);

        return () => {
            setToolbar(null);
        };
    })

    // listen to searchbar on toolbar
    $effect(() => {
        const searchText = DeckListToolbarContext.searchText;

        // untrack(async () => {
        //     isLoading = true;
        //     try {
        //         decks = await fetchUserDecks(currentPage, pageLimit);
        //     }
        //     finally {
        //         isLoading = false;
        // }
        // });
    });

    // listen page changed?
    $effect(() => {
        const tmpPageChanged = !pageChanged;

        untrack(async () => {
            isLoading = true;
            try {
                decks = await fetchUserDecks(currentPage, pageLimit);
            }
            finally {
                isLoading = false;
            }
        });
    });

  function onClickStudy(deckId: string)
  :void
  {
    goto("/deck/" + deckId + "/study")
  }
  function onClickStatus(deckId: string)
  : void
  {
    goto("/deck/" + deckId + "/status")
  }
  function onClickBrowse(deckId: string)
  : void
  {
    goto("/deck/" + deckId + "/browse")
  }
  function onClickSetting(deckId: string)
  :void
  {
    goto("/deck/" + deckId + "/setting")
  }

  function handleAddDeckSave(deckData: DeckEditableData)
  : void
  {
    isAddModalOpen = false

    createDeck(deckData)
    .then((fetchResult) => {
        pageChanged = !pageChanged
    })
    .catch((err) => {
        throw err;
    })
  }

  function handleAddDeckClick()
  : void 
  {
    isAddModalOpen = true;
  }

  function handlePageChange(pageNum: number)
  : void 
  {
    currentPage = pageNum;
  }

  function handleRefreshClick()
  : void
  {
    loadDeck();
  }

</script>


{#if isAddModalOpen}
    <AddModal 
        onSave={handleAddDeckSave} 
        onCancel={() => {isAddModalOpen = false}}/>
{/if}


<div class="w-full flex justify-center">
    <div class="flex flex-col items-center gap-y-10 w-full max-w-160">
        <div class="w-full flex justify-between">
            <div>
                <Button
                    class="cursor-pointer {isLoading ? "invisible" : ""}"
                    variant="outline" onclick={handleRefreshClick}
                >
                    <RefreshCwIcon/>
                </Button>
            </div>
            <div class="text-2xl font-bold">
                Deck List
            </div>
            <div>
                <Button class="invisible">

                </Button>
            </div>
        </div>

        {#if !isLoading}
            {@render deckCard()}

            {@render pagination()}

        {:else}
            <Loading/>
        {/if}
    </div>
</div>


{#snippet deckCard()}
    <div class="w-full flex flex-col gap-y-5">
        {#each decks?.result as deck}    
                {@const due = deck.today_dues}
                <Card.Root class="w-full py-0 gap-0">
                    <div class="flex justify-between">
                        <div class="flex-8 py-4 px-6">
                            <div class="text-lg">{deck.name}</div>

                            <div class="space-x-2 text-xs">
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
    </div>
{/snippet}

<!-- BUG: don't know why but next and previous buttons not workin -->
{#snippet pagination()}
    {#if decks && decks.result.length > 0}
        <Pagination.Root count={decks.total} perPage={pageLimit} class="">
        {#snippet children({ pages })}  
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous 
                        class="cursor-pointer"
                        onclick={() => {
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                    />
                </Pagination.Item>
                {#each pages as page (page.key)}
                    {#if page.type === "ellipsis"}
                    <Pagination.Item>
                        <Pagination.Ellipsis />
                    </Pagination.Item>
                    {:else}
                    <Pagination.Item>
                        <Pagination.Link 
                            class="cursor-pointer"
                            {page} 
                            isActive={currentPage === page.value}
                            onclick={() => handlePageChange(page.value)}
                        >
                        {page.value}
                        </Pagination.Link>
                    </Pagination.Item>
                    {/if}
                {/each}
                <Pagination.Item>
                    <Pagination.Next 
                        class="cursor-pointer"
                        onclick={() => {
                            const totalPages = Math.ceil((decks?.result.length || 0) / pageLimit);
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                    />
                </Pagination.Item>
            </Pagination.Content>
        {/snippet}
        </Pagination.Root>
    {/if}
{/snippet}
    

{#snippet toolbarSnippet()}
    <DeckListToolbar toolbarContext={DeckListToolbarContext} onAdd={handleAddDeckClick}/>
{/snippet}