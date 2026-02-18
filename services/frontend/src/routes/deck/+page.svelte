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
    import { CrossIcon, RefreshCwIcon, XIcon, XSquareIcon } from '@lucide/svelte';
    import DeckSortDropdown from './DeckSortDropdown.svelte';
    import { page } from '$app/state';
    import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
    import { SESSIONSTORAGE_PREV_DECK_LIST } from '$lib/constant/sessionStorageKey.js';
    
    const SUB_BUTTON_STYLE = cn("flex-4 py-2 hover:bg-accent cursor-pointer");
    const STUDY_BUTTON_STYLE = cn("flex-4 rounded-tr-2xl hover:bg-accent cursor-pointer");

    // const sidebar = useSidebar();
    let decks = $state<GetDecksStudyRouteResponse>();
    let isLoading = $state<boolean>(true);
    let currentPage = $derived.by<number>(() => {
        let p = Number(page.url.searchParams.get("page"));
        if(!isNaN(p) && p > 0) return p;
        return 1;
    });

    let pageLimit = $state(DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT);

    let search = $derived<string>(page.url.searchParams.get("search") ?? "");
    let sortBy = $derived<string>(page.url.searchParams.get("sortby") ?? DECK_OPTIONS.DECK_DEFAULT_SORTBY);
    let sortAsc = $derived.by<boolean>(() => {
        let sortAscParam = page.url.searchParams.get("sortasc");
        if(sortAscParam === "true")         return true
        else if(sortAscParam === "false")   return false
        else                                return DECK_OPTIONS.DECK_DEFAULT_SORTASC;
    });
    let pageChanged = $state(false);
    let isAddModalOpen = $state(false);

    // NOTE: because of this page, MAYBE I should RETHINK how the toolbar work (BTW, HOW DOES IT EVEN WORK NOW????) 
    // REMEMBER - component are mount from child to parent when page reload (so parent will override child if it use the same context)
    const DeckListToolbarContext = new DeckListToolbarContextClass();
    // This page doesn't need to set the DECK_LIST_TOOLBAR_CONTEXT;
    const setToolbar = getContext<ToolbarSetter>(TOOLBAR_SNIPPET_CONTEXT);

    onMount(() => {
        setToolbar(toolbarSnippet);

        return () => {
            setToolbar(null);
        };
    })


    // listen page changed?
    $effect(() => {
        const tmpPageChanged = !pageChanged;

        isLoading = true;

        fetchUserDecks(currentPage, pageLimit, search, sortBy, sortAsc)
        .then((res) => {
            decks = res;
        })
        .finally(() => {
            isLoading = false;
        })
    });

  function onClickStudy(deckId: string)
  :void
  {
    sessionStorage.setItem(SESSIONSTORAGE_PREV_DECK_LIST, page.url.href);
    goto("/deck/" + deckId + "/study");
  }
  function onClickStatus(deckId: string)
  : void
  {
    sessionStorage.setItem(SESSIONSTORAGE_PREV_DECK_LIST, page.url.href);
    goto("/deck/" + deckId + "/status");
  }
  function onClickBrowse(deckId: string)
  : void
  {
    sessionStorage.setItem(SESSIONSTORAGE_PREV_DECK_LIST, page.url.href);
    goto("/deck/" + deckId + "/browse");
  }
  function onClickSetting(deckId: string)
  :void
  {
    sessionStorage.setItem(SESSIONSTORAGE_PREV_DECK_LIST, page.url.href);
    goto("/deck/" + deckId + "/setting");
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
    const url = page.url;
    url.searchParams.set("page", pageNum.toString());

    goto(url, {
        keepFocus: true
    });
  }

  function handleRefreshClick()
  : void
  {
    pageChanged = !pageChanged;
  }

  function handleSearch()
  : void
  {
    const url = new URL(page.url);
    url.searchParams.set("search", DeckListToolbarContext.query);
    url.searchParams.delete("page");

    goto(url, {
        keepFocus: true,
        replaceState: true
    })
  }

</script>


{#if isAddModalOpen}
    <AddModal 
        onSave={handleAddDeckSave} 
        onCancel={() => {isAddModalOpen = false}}/>
{/if}


<div class="w-full flex justify-center">
    <div class="flex flex-col items-center w-full max-w-160">
        <div class="w-full flex items-center">
            <div class="flex-1 flex justify-start">
                <!-- <Button
                    class="cursor-pointer {isLoading ? "invisible" : ""}"
                    variant="outline" onclick={handleRefreshClick}
                >
                    <RefreshCwIcon/>
                    {#if !sidebar.isMobile}
                        Refresh
                    {/if}
                </Button> -->
            </div>
            <div class="flex-1 flex justify-center mb-5">
                <div class="text-2xl font-bold">
                    Deck List
                </div>
            </div>
            <div class="flex-1 flex justify-end">
                <DeckSortDropdown sortBy={sortBy} sortAsc={sortAsc}/>
            </div>
        </div>
        
        <div class="self-start mb-2 ms-3 text-muted-foreground flex items-center">
            {#if search}
                <div class="text-muted-foreground text-lg">Search for '<span class="font-bold">{search}</span>'</div>
                <Button variant="ghost" class="h-fit ms-3 cursor-pointer" 
                onclick={() => {
                    DeckListToolbarContext.query = "";
                    const url = page.url;
                    url.searchParams.delete("search");

                    goto(url, {
                        keepFocus: true
                    })
                }}>
                    <XIcon/>Clear
                </Button>
            {/if}
        </div>


        <div class="flex flex-col items-center w-full gap-y-10 max-w-160">
        {#if !isLoading}
            {@render deckCard()}

            {@render pagination()}
        {:else}
            <Loading/>
        {/if}
        </div>
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
        <Pagination.Root count={decks?.total ?? 0} perPage={pageLimit} class="">
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
{/snippet}
    

{#snippet toolbarSnippet()}
    <DeckListToolbar toolbarContext={DeckListToolbarContext} onAdd={handleAddDeckClick} onSearch={handleSearch}/>
{/snippet}