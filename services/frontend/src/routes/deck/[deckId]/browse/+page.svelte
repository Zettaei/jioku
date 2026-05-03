<script lang="ts">
  import type { GetCardsByDeckIdRouteResponse } from "$lib/types/server/modules/deck/type/card_dto";
  import { getContext, onMount, untrack } from "svelte";
  import {
    addCardToDeckId,
    deleteCard,
    fetchCardsByDeckId,
    updateCard,
  } from "./services";
  import { page } from "$app/state";
  import {
    BROWSE_DECK_TOOLBAR_CONTEXT,
    BROWSE_DECK_TOOLBAR_DELETE_HANDLER,
    BROWSE_DECK_TOOLBAR_CANCEL_HANDLER,
    BROWSE_DECK_TOOLBAR_ADD_HANDLER,
    type BrowseDeckToolbarContextInterface,
    BROWSE_DECK_TOOLBAR_SEARCH_HANDLER,
  } from "$lib/context/deckToolbar.svelte";
  import { type GetDeckByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
  import Loading from "../../../Loading.svelte";
  import * as Table from "$lib/components/ui/table/index";
  import * as Pagination from "$lib/components/ui/pagination/index";
  import {
    cardExtraHeaderName,
    cardExtraHeaderOrder,
  } from "$lib/constant/cardExtraRows";
  import type {
    CardRow,
    CardUpdate,
  } from "$lib/types/server/core/supabase/type";
  import { getCardExtraValue, isJsonObject } from "./utils";
  import EditModal from "./EditModal.svelte";
  import AppCardDataAddModal from "./AddModal.svelte";
  import Confirmation from "$lib/components/Confirmation.svelte";
  import { DECK_OPTIONS } from "$lib/constant/options";
  import { fetchDeckByDeckId } from "../../services";
  import SortDropdown from "./CardSortDropdown.svelte";
  import { goto } from "$app/navigation";
  import BackButton from "$lib/components/BackButton.svelte";
  import CardSortDropdown from "./CardSortDropdown.svelte";
  import CardColumnVisibilityDropdown from "./CardColumnVisibilityDropdown.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { XIcon } from "@lucide/svelte";
  import { SESSIONSTORAGE_PREV_DECK_LIST } from "$lib/constant/sessionStorageKey";
  import { successState } from "$lib/global/successState.svelte";
    import { bgtexthover } from "$lib/utils/bgtext";
    import { bgtext2 } from "$lib/stores/bgtext";

  let BrowseToolbarContext = getContext<BrowseDeckToolbarContextInterface>(
    BROWSE_DECK_TOOLBAR_CONTEXT,
  );
  let setOnDelete: (handler: (() => void) | null) => void = getContext(
    BROWSE_DECK_TOOLBAR_DELETE_HANDLER,
  );
  let setOnCancel: (handler: (() => void) | null) => void = getContext(
    BROWSE_DECK_TOOLBAR_CANCEL_HANDLER,
  );
  let setOnAdd: (handler: (() => void) | null) => void = getContext(
    BROWSE_DECK_TOOLBAR_ADD_HANDLER,
  );
  let setOnSearch: (handler: (() => void) | null) => void = getContext(
    BROWSE_DECK_TOOLBAR_SEARCH_HANDLER,
  );
  let headerIsLoading = $state(true);
  let rowIsLoading = $state(true);

  onMount(() => {
    page.url.searchParams.set("sortby", DECK_OPTIONS.CARD_DEFAULT_SORTBY);
    page.url.searchParams.set(
      "sortasc",
      DECK_OPTIONS.CARD_DEFAULT_SORTASC.toString(),
    );
  });

  let isAddModalOpen = $state(false);

  // CONFIRMATION DIALOG
  let confirmationDialogText = $state({
    title: "",
    message: "",
  });
  let showDeleteConfirmation = $state(false);
  ///////////////////////

  let cards = $state<GetCardsByDeckIdRouteResponse | null>(null);
  let deck = $state<GetDeckByIdRouteResponse | null>(null);
  let totalCardCount = $derived(cards?.total ?? 0);

  let search = $derived<string>(page.url.searchParams.get("search") ?? "");
  $effect(() => {
    if (search) {
      currentPage = 1;
    }
  });
  let sortBy = $derived<string>(
    page.url.searchParams.get("sortby") ?? DECK_OPTIONS.CARD_DEFAULT_SORTBY,
  );
  let sortAsc = $derived.by<boolean>(() => {
    let sortAscParam = page.url.searchParams.get("sortasc");
    if (sortAscParam === "true") return true;
    else if (sortAscParam === "false") return false;
    else return DECK_OPTIONS.CARD_DEFAULT_SORTASC;
  });

  let currentPage = $derived.by<number>(() => {
    let p = Number(page.url.searchParams.get("page"));
    if (!isNaN(p) && p > 0) return p;
    return 1;
  });

  let pageLimit = $state(DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT);
  let pageChanged = $state(false);
  let paginationPage = $state(1);

  let deckId = $derived(page.params.deckId);

  let selectedCard = $state<CardRow | null>(null);

  let hiddenDataCols = $state<Set<string>>(new Set());
  let hiddenExtraCols = $state<Set<string>>(new Set());

  let selectedRows = $state<string[]>([]);
  let selectedRowsCount = $derived(selectedRows.length);
  setOnCancel(() => {
    selectedRows = [];
  });
  setOnSearch(() => {
    const url = new URL(page.url);
    url.searchParams.set("search", BrowseToolbarContext.query);

    goto(url, {
      keepFocus: true,
      replaceState: true,
    });
  });

  // sync selected rows with the toolbar context
  $effect(() => {
    BrowseToolbarContext.selectedCardCount = selectedRowsCount;
  });

  // reset selectedRows when confirmationDialog is closed, answer not matter
  $effect(() => {
    const confirmationIsOpen = showDeleteConfirmation;

    if (!confirmationIsOpen) selectedRows = [];
  });

  // Derive headers from deck data
  let headers = $derived.by(() => {
    if (!deck?.headersdata || !deck?.headersorder) return [];

    const headersData = deck.headersdata as Record<string, string>;
    const headersOrder = deck.headersorder as string[];

    return headersOrder.map((key) => ({
      key,
      label: headersData[key] || key,
    }));
  });

  // deckId/param deckId listening
  $effect(() => {
    const tmpDeckId = deckId;

    if (!tmpDeckId) return;

    untrack(() => {
      headerIsLoading = true;
      fetchDeckByDeckId(tmpDeckId)
        .then((deckData) => {
          deck = deckData;
        })
        .finally(() => {
          headerIsLoading = false;
        });
    });
  });

  // deckId/param deckId listening also page, probably
  $effect(() => {
    const tmpPageChanged = pageChanged;

    if (!deckId) return;

    rowIsLoading = true;

    fetchCardsByDeckId(deckId, currentPage, pageLimit, search, sortBy, sortAsc)
      .then((response) => {
        cards = response;
      })
      .finally(() => {
        rowIsLoading = false;
      });
  });

  // Sync pagination page state with URL
  $effect(() => {
    paginationPage = currentPage;
  });

  // Sync pagination page changes back to URL
  $effect(() => {
    if (paginationPage !== currentPage) {
      handlePageChange(paginationPage);
    }
  });

  function handleDeleteSelectedCards(): void {
    if (selectedRows.length === 0) return;

    confirmationDialogText = {
      title: "Delete Cards",
      message: `Are you sure you want to delete ${selectedRows.length} card(s)? This action cannot be undone.`,
    };
    showDeleteConfirmation = true;
  }

  // use in confirmation dialog
  function confirmDelete(): void {
    if (selectedRows.length === 0) return;

    rowIsLoading = true;
    deleteCard(deckId!, selectedRows).finally(() => {
      selectedRows = [];
      pageChanged = !pageChanged; // Refresh list
      rowIsLoading = false;
    });
  }

  function handleAddCardClick(): void {
    isAddModalOpen = true;
  }

  function handleAddCardSave(data: {
    card: { data: Record<string, string> };
  }): void {
    rowIsLoading = true;
    addCardToDeckId(deckId, data.card)
      .then(() => {
        successState.show("Card added");
      })
      .finally(() => {
        pageChanged = !pageChanged; // Refresh list
        rowIsLoading = false;
      });
  }

  function handleUpdatedCardSave(
    cardId: string,
    data: {
      card: CardUpdate;
      deckHeaderOrder: Array<string>;
    },
  ): void {
    rowIsLoading = true;
    updateCard(deckId!, cardId, data.card, data.deckHeaderOrder).finally(() => {
      pageChanged = !pageChanged; // Refresh list
      rowIsLoading = false;
    });
  }

  // put delete handler with toolbar
  $effect(() => {
    setOnDelete(() => handleDeleteSelectedCards());
    return () => {
      setOnDelete(null);
    };
  });

  // put add handler with toolbar
  $effect(() => {
    setOnAdd(() => handleAddCardClick());
    return () => {
      setOnAdd(null);
    };
  });

  function handlePageChange(pageNum: number): void {
    const url = page.url;
    url.searchParams.set("page", pageNum.toString());

    goto(url, {
      keepFocus: true,
    });
  }
</script>

{#if selectedCard}
  <EditModal bind:selectedCard {headers} onSave={handleUpdatedCardSave} />
{/if}

<AppCardDataAddModal
  bind:isOpen={isAddModalOpen}
  {headers}
  onSave={handleAddCardSave}
/>

<Confirmation
  bind:open={showDeleteConfirmation}
  title={confirmationDialogText.title}
  message={confirmationDialogText.message}
  onConfirm={confirmDelete}
  onCancel={() => {}}
/>

<svelte:head>
  <title>DECK BROWSING{deck?.name ? ": " + deck.name : ""}</title>
</svelte:head>

<div class="w-full h-full px-4">
  <div class="flex flex-col gap-4 justify-center">
    <div class="text-center">
      <div>
        <div class="flex items-center justify-between w-full">
          <div class="flex-1 flex justify-start">
            <BackButton
              destination={"/deck"}
              sessionStorageKey={SESSIONSTORAGE_PREV_DECK_LIST}
            />
          </div>

          <div class="flex-1 flex justify-center">
            <div class="text-center">
              <div class="font-bold text-lg avantgarde">DECK BROWSING</div>
              <div class="text-muted-foreground text-xl mb-5">{deck?.name}</div>
            </div>
          </div>

          <div class="flex-1 flex justify-end gap-2">
            <CardColumnVisibilityDropdown
              {headers}
              bind:hiddenDataCols
              bind:hiddenExtraCols
            />
          </div>
        </div>

        <div class="flex justify-between items-end text-start">
          {#if headerIsLoading}
            <div></div>
          {:else if !search}
            <div class="text-muted-foreground text-lg">
              {@render searchText()}
            </div>
          {:else}
            <div class="text-muted-foreground text-lg">
              Search for '<span class="font-bold">{search}</span>' |
              {@render searchText()}
              <Button
                variant="ghost"
                class="cursor-pointer"
                onclick={() => {
                  BrowseToolbarContext.query = "";
                  const url = page.url;
                  url.searchParams.delete("search");

                  goto(url, {
                    keepFocus: true,
                  });
                }}
              >
                <XIcon />Clear
              </Button>
            </div>
          {/if}
          <CardSortDropdown {sortBy} {sortAsc} />
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
      <div class="border overflow-hidden mb-4">
        <div class="overflow-x-auto">
          <Table.Root>
            <Table.Header class="sticky top-0 bg-accent z-10">
              <Table.Row>
                {#each headers as header}
                  {#if !hiddenDataCols.has(header.key)}
                    <Table.Head
                      class="whitespace-nowrap min-w-24 border-r border-border"
                    >
                      {header.label}
                    </Table.Head>
                  {/if}
                {/each}
                {#each cardExtraHeaderOrder as headerKey}
                  {#if !hiddenExtraCols.has(headerKey)}
                    <Table.Head
                      class="whitespace-nowrap min-w-20 text-center border-r border-border"
                    >
                      {cardExtraHeaderName[headerKey]}
                    </Table.Head>
                  {/if}
                {/each}
              </Table.Row>
            </Table.Header>

            {#if rowIsLoading}
              <td
                class="py-3 text-center"
                colspan={headers.length + cardExtraHeaderOrder.length}
              >
                <Loading />
              </td>
            {:else}
              <Table.Body class="bg-background">
                {#each cards.result as card (card.id)}
                  {@const isSelected = selectedRows.includes(card.id)}
                  <Table.Row
                    class={`cursor-pointer ${isSelected ? "bg-yellow-500 dark:text-black dark:hover:text-white" : ""}`}
                    onclick={() => {
                      if (!BrowseToolbarContext.selectionMode) {
                        selectedCard = null;
                        selectedCard = card;
                      } else {
                        const index = selectedRows.indexOf(card.id);
                        if (index > -1) {
                          selectedRows.splice(index, 1);
                        } else {
                          selectedRows.push(card.id);
                        }
                        selectedRows = selectedRows;
                      }
                    }}
                    onmouseenter={bgtexthover(bgtext2, ">> Select This Card")}
                    onmouseleave={bgtexthover(bgtext2)}
                    onmouseup={bgtexthover(bgtext2)}
                  >
                    {#each headers as header}
                      {#if !hiddenDataCols.has(header.key)}
                        <Table.Cell class="border-r border-border">
                          <span class="inline-block max-w-72 truncate">
                            {isJsonObject(card.data)
                              ? card.data[header.key]
                              : ""}
                          </span>
                        </Table.Cell>
                      {/if}
                    {/each}
                    {#each cardExtraHeaderOrder as headerKey}
                      {#if !hiddenExtraCols.has(headerKey)}
                        <Table.Cell class="text-center border-r border-border">
                          <span class="inline-block max-w-48 truncate">
                            {getCardExtraValue(card, headerKey)}
                          </span>
                        </Table.Cell>
                      {/if}
                    {/each}
                  </Table.Row>
                {/each}
              </Table.Body>
            {/if}
          </Table.Root>
        </div>
      </div>
    {/if}

    {#if !rowIsLoading && totalCardCount > 0}
      <Pagination.Root
        count={totalCardCount}
        perPage={pageLimit}
        bind:page={paginationPage}
      >
        {#snippet children({ pages, currentPage: paginationCurrentPage })}
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                class="cursor-pointer"
                disabled={paginationCurrentPage === 1}
                onclick={() => {
                  if (paginationCurrentPage > 1)
                    handlePageChange(paginationCurrentPage - 1);
                }}
                onmouseenter={bgtexthover(bgtext2, ">> Go to Page " + (currentPage === 0 ? 0 : currentPage - 1))}
                onmouseleave={bgtexthover(bgtext2)}
                onmouseup={bgtexthover(bgtext2)}
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
                    isActive={paginationCurrentPage === page.value}
                    onclick={() => handlePageChange(page.value)}
                    onmouseenter={bgtexthover(bgtext2, ">> Go to Page " + page.value)}
                    onmouseleave={bgtexthover(bgtext2)}
                    onmouseup={bgtexthover(bgtext2)}
                  >
                    {page.value}
                  </Pagination.Link>
                </Pagination.Item>
              {/if}
            {/each}
            <Pagination.Item>
              <Pagination.Next
                class="cursor-pointer"
                disabled={paginationCurrentPage ===
                  Math.ceil(totalCardCount / pageLimit)}
                onclick={() => {
                  const totalPages = Math.ceil(totalCardCount / pageLimit);
                  if (paginationCurrentPage < totalPages)
                    handlePageChange(paginationCurrentPage + 1);
                }}
                onmouseenter={bgtexthover(bgtext2, ">> Go to Page " + (currentPage+1))}
                onmouseleave={bgtexthover(bgtext2)}
                onmouseup={bgtexthover(bgtext2)}
              />
            </Pagination.Item>
          </Pagination.Content>
        {/snippet}
      </Pagination.Root>
    {/if}
  </div>
</div>

{#snippet searchText()}
    Showing:
    {#if !rowIsLoading}
        {(currentPage - 1) * DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT + 1} -
        {Math.min(
        currentPage * DECK_OPTIONS.CARD_RESULT_FETCH_LIMIT,
        totalCardCount,
        )}
        of {totalCardCount} card(s)
    {/if}
{/snippet}

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
