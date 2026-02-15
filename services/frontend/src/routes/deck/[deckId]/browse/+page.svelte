<script lang="ts">
    import type { GetCardsByDeckIdRouteResponse } from "$lib/types/server/modules/deck/type/card_dto";
    import { getContext, untrack } from "svelte";
    import { addCardToDeckId, deleteCard, fetchCardsByDeckId, updateCard } from "./services";
    import { page } from "$app/state";
    import { BROWSE_DECK_TOOLBAR_CONTEXT, BROWSE_DECK_TOOLBAR_DELETE_HANDLER, BROWSE_DECK_TOOLBAR_CANCEL_HANDLER, BROWSE_DECK_TOOLBAR_ADD_HANDLER, type BrowseDeckToolbarContextInterface, BROWSE_DECK_TOOLBAR_SEARCH_HANDLER } from "$lib/context/deckToolbar.svelte";
    import { type GetDeckByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
    import Loading from "../../../Loading.svelte";
    import * as Table from "$lib/components/ui/table/index";
    import * as Pagination from "$lib/components/ui/pagination/index";
    import { cardExtraHeaderName, cardExtraHeaderOrder } from "$lib/constant/cardExtraRows";
    import { userState } from "$lib/global/userState.svelte";
    import type { CardRow, CardUpdate } from "$lib/types/server/core/supabase/type";
    import { getCardExtraValue, isJsonObject } from "./utils";
    import EditModal from "./EditModal.svelte";
    import AppCardDataAddModal from "./AddModal.svelte";
    import Confirmation from "$lib/components/Confirmation.svelte";
    import { DECK_OPTIONS } from "$lib/constant/options";
    import { fetchDeckByDeckId } from "../../services";
    import SortDropdown from "./SortDropdown.svelte";
    import { goto } from "$app/navigation";
    import BackButton from "$lib/components/BackButton.svelte";

    let BrowseToolbarContext = getContext<BrowseDeckToolbarContextInterface>(BROWSE_DECK_TOOLBAR_CONTEXT);
    let setOnDelete: (handler: (() => void) | null) => void = getContext(BROWSE_DECK_TOOLBAR_DELETE_HANDLER);
    let setOnCancel: (handler: (() => void) | null) => void = getContext(BROWSE_DECK_TOOLBAR_CANCEL_HANDLER);
    let setOnAdd: (handler: (() => void) | null) => void = getContext(BROWSE_DECK_TOOLBAR_ADD_HANDLER);
    let setOnSearch: (handler: (() => void) | null) => void = getContext(BROWSE_DECK_TOOLBAR_SEARCH_HANDLER);
    let headerIsLoading = $state(true);
    let rowIsLoading = $state(true);
    

    let isAddModalOpen = $state(false);
    
    // CONFIRMATION DIALOG
    let confirmationDialogText = $state({
        title: "", message: ""
    });
    let showDeleteConfirmation = $state(false);
    ///////////////////////

    let cards = $state<GetCardsByDeckIdRouteResponse | null>(null);
    let deck = $state<GetDeckByIdRouteResponse | null>(null);
    let totalCardCount = $derived(cards?.total ?? 0);

    let search = $derived<string>(page.url.searchParams.get("search") ?? "");
    let sortBy = $derived<string>(page.url.searchParams.get("sortby") ?? DECK_OPTIONS.CARD_DEFAULT_SORTBY);
    let sortAsc = $derived.by<boolean>(() => {
        let sortAscParam = page.url.searchParams.get("sortasc");
        if(sortAscParam === "true")         return true
        else if(sortAscParam === "false")   return false
        else                                return DECK_OPTIONS.CARD_DEFAULT_SORTASC;
    });
    let currentPage = $state(1);
    let pageLimit = $state(DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT);
    let pageChanged = $state(false);

    let deckId = $derived(page.params.deckId);

    let selectedCard = $state<CardRow | null>(null);

    let selectedRows = $state<string[]>([]);
    let selectedRowsCount = $derived(selectedRows.length);
    setOnCancel(() => { selectedRows = [] });
    setOnSearch(() => {
        const url = new URL(page.url);
        url.searchParams.set("search", BrowseToolbarContext.query);

        goto(url, {
            keepFocus: true
        })
    })

    
    // sync selected rows with the toolbar context
    $effect(() => {
        BrowseToolbarContext.selectedCardCount = selectedRowsCount;
    });

    // reset selectedRows when confirmationDialog is closed, answer not matter
    $effect(() => {
        const confirmationIsOpen = showDeleteConfirmation;

        if(!confirmationIsOpen) 
            selectedRows = [];
    })

    // Derive headers from deck data
    let headers = $derived.by(() => {
        if (!deck?.headersdata || !deck?.headersorder) return [];

        const headersData = deck.headersdata as Record<string, string>;
        const headersOrder = deck.headersorder as string[];

        return headersOrder.map(key => ({
            key,
            label: headersData[key] || key
        }));
    });

    // deckId/param deckId listening
    $effect(() => {
        const tmpDeckId = deckId;

        if(!tmpDeckId) return;

        untrack(() => {
            headerIsLoading = true;

            fetchDeckByDeckId(tmpDeckId)
            .then((deckData) => {
                deck = deckData;
            })
            .finally(() => {
                headerIsLoading = false;
            })
        })
    })

    // deckId/param deckId listening also page, probably
    $effect(() => {
        const tmpDeckId = deckId;
        const tmpPageChanged = pageChanged;
        const tmpCurrentPage = currentPage;
        const tmpPageLimit = pageLimit;
        const url = page.url;

        if(!tmpDeckId) return;

        untrack(() => {
            rowIsLoading = true

            fetchCardsByDeckId(tmpDeckId, tmpCurrentPage, tmpPageLimit, search, sortBy, sortAsc)
            .then((response) => {
                cards = response;
            })
            .finally(() => {
                rowIsLoading = false;
            });

        })
    })
    

    function handleDeleteSelectedCards()
    : void
    {
        if (selectedRows.length === 0) return;

        confirmationDialogText = {
            title: "Delete Cards",
            message: `Are you sure you want to delete ${selectedRows.length} card(s)? This action cannot be undone.`
        }
        showDeleteConfirmation = true;
    }

    // use in confirmation dialog
    function confirmDelete()
    : void
    {
        if (selectedRows.length === 0) return;
        
        rowIsLoading = true;
        deleteCard(deckId!, selectedRows)
        .finally(() => {
            selectedRows = [];
            pageChanged = !pageChanged; // Refresh list
            rowIsLoading = false;
        });
    }

    function handleAddCardClick()
    : void 
    {
        isAddModalOpen = true;
    }

    function handleAddCardSave(data: {
        card: Record<string, string>
    })
    : void 
    {
        rowIsLoading = true;
        addCardToDeckId(deckId, data.card)
        .finally(() => {
            pageChanged = !pageChanged; // Refresh list
            rowIsLoading = false;
        });
    }


    function handleUpdatedCardSave(cardId: string, data: {
        card: CardUpdate,
        deckHeaderOrder: Array<string>
    })
    : void 
    {
        rowIsLoading = true;
        updateCard(deckId!, cardId, data.card, data.deckHeaderOrder)
        .finally(() => {
            pageChanged = !pageChanged; // Refresh list
            rowIsLoading = false;
        });
    }

    // put delete handler with toolbar
    $effect(() => {
        setOnDelete(() => handleDeleteSelectedCards());
        return (() => { setOnDelete(null) })
    });

    // put add handler with toolbar
    $effect(() => {
        setOnAdd(() => handleAddCardClick());
        return (() => { setOnAdd(null) })
    });


    function handlePageChange(pageNum: number) {
        currentPage = pageNum;
    }

</script>



{#if selectedCard}
    <EditModal bind:selectedCard={selectedCard} {headers} onSave={handleUpdatedCardSave} />
{/if}

<AppCardDataAddModal bind:isOpen={isAddModalOpen} {headers} onSave={handleAddCardSave}/>

<Confirmation 
    bind:open={showDeleteConfirmation}
    title={confirmationDialogText.title}
    message={confirmationDialogText.message}
    onConfirm={confirmDelete}
    onCancel={() => {}}
/>


<!-- TODO: cell text eclipse -->

<div class="w-full h-full px-4">

    <div class="flex flex-col gap-4">
        <div class="text-center">
            <div>

                <div class="flex justify-center items-center relative">
                    <BackButton onclick={() => goto("/deck")}/>
                    
                    <div>
                        <div class="font-bold text-lg">Deck Browsing</div>
                        <div class="text-muted-foreground text-xl mb-5">{deck?.name}</div>
                    </div>
                </div>

                <div class="flex justify-between items-end">
                    {#if headerIsLoading}
                        <div></div>
                    {:else}
                        {#if !search}
                            <div class="text-muted-foreground text-lg">Total: {totalCardCount} card(s)</div>
                        {:else}
                            <div class="text-muted-foreground text-lg">Search for '<span class="font-bold">{search}</span>', found: {totalCardCount} card(s)</div>
                        {/if}
                    {/if}
                    <SortDropdown bind:sortBy bind:sortAsc/>
                </div>
            </div>
        </div>


        {#if headerIsLoading}
            <Loading />
        {:else if !cards || !cards.result || cards.result.length === 0}
            <div class="flex items-center justify-center h-64">
                <p class="text-muted-foreground">No cards found</p>
            </div>
        {:else if headers.length === 0}
            <div class="flex items-center justify-center h-64">
                <p class="text-muted-foreground">No headers configured for this deck</p>
            </div>
        {:else}

            <div class="border overflow-hidden">
                <div class="overflow-x-auto">
                    <Table.Root>

                        <Table.Header class="sticky top-0 bg-accent z-10">
                            <Table.Row>
                                {#each headers as header}
                                    <Table.Head class="whitespace-nowrap min-w-24">
                                        {header.label}
                                    </Table.Head>
                                {/each}
                                {#each cardExtraHeaderOrder as headerKey}
                                    <Table.Head class="whitespace-nowrap min-w-20 text-center">
                                        {cardExtraHeaderName[headerKey]}
                                    </Table.Head>
                                {/each}
                            </Table.Row>
                        </Table.Header>


                    {#if rowIsLoading}
                        <td class="py-3 text-center" colspan={headers.length + cardExtraHeaderOrder.length}>
                            <Loading/>
                        </td>

                    {:else}
                        <Table.Body>
                            {#each cards.result as card (card.id)}
                                {@const isSelected = selectedRows.includes(card.id)}
                                <Table.Row 
                                    class={`cursor-pointer ${isSelected ? 'bg-yellow-500 dark:text-black dark:hover:text-white' : ''}`}
                                    onclick={() => {
                                        if (!BrowseToolbarContext.selectionMode) {
                                            selectedCard = null;
                                            selectedCard = card;
                                        }
                                        else {
                                            const index = selectedRows.indexOf(card.id);
                                            if (index > -1) {
                                                selectedRows.splice(index, 1);
                                            } else {
                                                selectedRows.push(card.id);
                                            }
                                            selectedRows = selectedRows;
                                        }
                                    }}
                                >
                                    {#each headers as header}
                                        <Table.Cell class="truncate">
                                            {isJsonObject(card.data) ? card.data[header.key] : ""}
                                        </Table.Cell>
                                    {/each}
                                    {#each cardExtraHeaderOrder as headerKey}
                                        <Table.Cell class="truncate text-center">
                                            {getCardExtraValue(card, headerKey)}
                                        </Table.Cell>
                                    {/each}
                                </Table.Row>
                            {/each}
                        </Table.Body>

                    {/if}
                    </Table.Root>
                </div>
            </div>


            <Pagination.Root count={totalCardCount} perPage={pageLimit}>
            {#snippet children({ pages, currentPage: paginationCurrentPage })}
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
                            const totalPages = Math.ceil(totalCardCount / pageLimit);
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                    />
                </Pagination.Item>
                </Pagination.Content>
            {/snippet}
            </Pagination.Root>
        {/if}

    </div>
</div>

<style>
    /* in-table scrolling horizontally ??? */
    :global(.overflow-auto) {
        scrollbar-width: thin;
        scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
    }

    :global(.overflow-auto::-webkit-scrollbar) {
        height: 8px;
        width: 8px;
    }

    :global(.overflow-auto::-webkit-scrollbar-track) {
        background: transparent;
    }

    :global(.overflow-auto::-webkit-scrollbar-thumb) {
        background-color: hsl(var(--muted-foreground) / 0.3);
        border-radius: 4px;
    }

    :global(.overflow-auto::-webkit-scrollbar-thumb:hover) {
        background-color: hsl(var(--muted-foreground) / 0.5);
    }
</style>