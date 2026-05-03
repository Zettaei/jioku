<script lang="ts">
  import {
    DECK_LIST_TOOLBAR_CONTEXT,
    DeckListToolbarContextClass,
    type DeckListToolbarContextInterface,
  } from "$lib/context/deckToolbar.svelte.js";
  import { getContext, onMount, setContext, untrack } from "svelte";
  import { createDeck, fetchUserStudyDecks } from "./services.js";
  import * as Card from "$lib/components/ui/card/index";
  import * as Pagination from "$lib/components/ui/pagination/index";
  import type { GetDecksStudyRouteResponse } from "$lib/types/server/modules/deck/type/study_dto.js";
  import { cn } from "$lib/utils.js";
  import { goto } from "$app/navigation";
  import {
    TOOLBAR_SNIPPET_CONTEXT,
    type ToolbarSetter,
  } from "$lib/context/toolbar.js";
  import { DECK_OPTIONS } from "$lib/constant/options.js";
  import Loading from "../Loading.svelte";
  import DeckListToolbar from "./DeckListToolbar.svelte";
  import AddModal from "./AddDeckModal.svelte";
  import type { DeckEditableData } from "$lib/types/deck.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { CrossIcon, RefreshCwIcon, XIcon, XSquareIcon } from "@lucide/svelte";
  import DeckSortDropdown from "./DeckSortDropdown.svelte";
  import { page } from "$app/state";
  import { useSidebar } from "$lib/components/ui/sidebar/context.svelte.js";
  import { SESSIONSTORAGE_PREV_DECK_LIST } from "$lib/constant/sessionStorageKey.js";
  import { DECK_EXTRA_SETTING_DEFAULT_VALUE } from "$lib/constant/deck.js";
  import type { DeckExtraSetting } from "$lib/types/deck.js";
  import { LocalStorageKey } from "$lib/localStorage.js";
  import { userStore } from "$lib/stores/auth.js";
  import { get } from "svelte/store";
  import { bgtext1, bgtext2 } from "$lib/stores/bgtext.js";
    import { bgtexthover } from "$lib/utils/bgtext.js";

  const SUB_BUTTON_STYLE = cn("flex-4 py-2 hover:bg-accent cursor-pointer");
  const STUDY_BUTTON_STYLE = cn(
    "flex-4 rounded-tr-2xl hover:bg-accent cursor-pointer",
  );

  // const sidebar = useSidebar();
  let decks = $state<GetDecksStudyRouteResponse>();
  let isLoading = $state<boolean>(true);
  let currentPage = $derived.by<number>(() => {
    let p = Number(page.url.searchParams.get("page"));
    if (!isNaN(p) && p > 0) return p;
    return 1;
  });

  let pageLimit = $state(DECK_OPTIONS.DECK_RESULT_FETCH_LIMIT);

  let search = $derived<string>(page.url.searchParams.get("search") ?? "");
  let sortBy = $derived<string>(
    page.url.searchParams.get("sortby") ?? DECK_OPTIONS.DECK_DEFAULT_SORTBY,
  );
  let sortAsc = $derived.by<boolean>(() => {
    let sortAscParam = page.url.searchParams.get("sortasc");
    if (sortAscParam === "true") return true;
    else if (sortAscParam === "false") return false;
    else return DECK_OPTIONS.DECK_DEFAULT_SORTASC;
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
  });

  // listen page changed?
  $effect(() => {
    const tmpPageChanged = !pageChanged;

    isLoading = true;

    fetchUserStudyDecks(currentPage, pageLimit, search, sortBy, sortAsc)
      .then((res) => {
        decks = res;
      })
      .finally(() => {
        isLoading = false;
      });
  });

  function onClickStudy(deckId: string): void {
    sessionStorage.setItem(SESSIONSTORAGE_PREV_DECK_LIST, page.url.href);
    goto("/deck/" + deckId + "/study");
  }
  function onClickStatus(deckId: string): void {
    sessionStorage.setItem(SESSIONSTORAGE_PREV_DECK_LIST, page.url.href);
    goto("/deck/" + deckId + "/status");
  }
  function onClickBrowse(deckId: string): void {
    sessionStorage.setItem(SESSIONSTORAGE_PREV_DECK_LIST, page.url.href);
    goto("/deck/" + deckId + "/browse");
  }
  function onClickSetting(deckId: string): void {
    sessionStorage.setItem(SESSIONSTORAGE_PREV_DECK_LIST, page.url.href);
    goto("/deck/" + deckId + "/setting");
  }

  function handleAddDeckSave(deckData: DeckEditableData): void {
    isAddModalOpen = false;

    createDeck(deckData)
      .then((fetchResult) => {
        pageChanged = !pageChanged;
      })
      .catch((err) => {
        throw err;
      });
  }

  function handleAddDeckClick(): void {
    isAddModalOpen = true;
  }

  function handlePageChange(pageNum: number): void {
    const url = page.url;
    url.searchParams.set("page", pageNum.toString());

    goto(url, {
      keepFocus: true,
    });
  }

  function handleRefreshClick(): void {
    pageChanged = !pageChanged;
  }

  // FIXME: Fake the newLimit setting, it only work for individual device for now.

  function getTodayDateStr(timezone: string): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(
      new Date(),
    );
  }
  function getEffectiveNewCount(
    deckId: string,
    rawCount: number,
    settings: unknown,
  ): number {
    const timezone = get(userStore)?.timezone ?? "Asia/Bangkok";
    const limit: number =
      (settings as DeckExtraSetting)?.newLimit ??
      (DECK_EXTRA_SETTING_DEFAULT_VALUE.newLimit as number);
    const raw = localStorage.getItem(
      `${LocalStorageKey.StudyNewCardCount}_${deckId}`,
    );
    let usedToday = 0;

    // console.log(getTodayDateStr(timezone))

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { count: number; date: string };
        if (parsed.date === getTodayDateStr(timezone))
          usedToday = parsed.count ?? 0;
      } catch {
        /* ignore */
      }
    }
    return Math.max(0, Math.min(rawCount, limit - usedToday));
  }

  /////////////////////////////////////

  function handleSearch(): void {
    const url = new URL(page.url);
    url.searchParams.set("search", DeckListToolbarContext.query);
    url.searchParams.delete("page");

    goto(url, {
      keepFocus: true,
      replaceState: true,
    });
  }
</script>

{#if isAddModalOpen}
  <AddModal
    onSave={handleAddDeckSave}
    onCancel={() => {
      isAddModalOpen = false;
    }}
  />
{/if}

<svelte:head>
  <title>DECK LIST</title>
</svelte:head>

<div class="w-full flex justify-center z-5">
  <div class="flex flex-col items-center w-full max-w-4xl">
    <div class="w-full flex justify-between mb-8">
      <div>
        <div class="pagetitle flex flex-col items-start">
          <span>DECK</span>
          <span>LIST</span>
        </div>
      </div>
      <div class="flex justify-end items-end pb-4">
        <DeckSortDropdown {sortBy} {sortAsc} />
      </div>
    </div>

    <div class="self-start mb-2 ms-3 text-muted-foreground flex items-center">
      {#if search}
        <div class="text-muted-foreground text-lg">
          Search for '<span class="font-bold">{search}</span>'
        </div>
        <Button
          variant="ghost"
          class="h-fit ms-3 cursor-pointer"
          onclick={() => {
            DeckListToolbarContext.query = "";
            const url = page.url;
            url.searchParams.delete("search");

            goto(url, {
              keepFocus: true,
            });
          }}
        >
          <XIcon />Clear
        </Button>
      {/if}
    </div>

    <div class="flex flex-col items-center w-full gap-y-10">
      {#if !isLoading}
        {@render deckCard()}

        {@render pagination()}
      {:else}
        <Loading />
      {/if}
    </div>
  </div>
</div>

{#snippet deckCard()}
  <div class="w-full flex flex-col gap-y-6 z-5">
  {#if decks && decks.result.length > 0}
    {#each decks?.result as deck}
      {@const due = deck.today_dues}
      <Card.Root
        class="w-full py-0 gap-0"
        onmouseenter={bgtexthover(bgtext1, deck.name)}
        onmouseleave={bgtexthover(bgtext1)}
        onmouseup={bgtexthover(bgtext1)}
      >
        <div class="flex justify-between">
          <div class="flex-8 py-4 px-6">
            <div class="text-lg mb-2">{deck.name}</div>

            <div class="space-x-2 text-xs font-bold">
              <span
                >new: <span class="text-blue-600 dark:text-blue-400"
                  >{getEffectiveNewCount(
                    deck.id,
                    due[0].count,
                    deck.settings,
                  )}</span
                ></span
              >
              <span
                >due: <span class="text-green-600 dark:text-green-400"
                  >{due[1].count}</span
                ></span
              >
              <span
                >retry: <span class="text-red-600 dark:text-orange-500"
                  >{due[2].count}</span
                ></span
              >
            </div>
          </div>
          <button
            class={STUDY_BUTTON_STYLE}
            onclick={() => onClickStudy(deck.id)}
            onmouseenter={bgtexthover(bgtext2, ">> Study")}
            onmouseleave={bgtexthover(bgtext2)}
            onmouseup={bgtexthover(bgtext2)}
          >
            Study
          </button>
        </div>
        <div class="flex border-border border-t-2">
          <!-- svelte-ignore a11y_mouse_events_have_key_events -->
          <button
            class="rounded-bl-2xl {SUB_BUTTON_STYLE}"
            onclick={() => onClickStatus(deck.id)}
            onmouseenter={bgtexthover(bgtext2, ">> Status")}
            onmouseleave={bgtexthover(bgtext2)}
            onmouseup={bgtexthover(bgtext2)}
          >
            Status
          </button>
          <!-- svelte-ignore a11y_mouse_events_have_key_events -->
          <button
            class="border-border border-x-2 {SUB_BUTTON_STYLE}"
            onclick={() => onClickBrowse(deck.id)}
            onmouseenter={bgtexthover(bgtext2, ">> Browse")}
            onmouseleave={bgtexthover(bgtext2)}
            onmouseup={bgtexthover(bgtext2)}
          >
            Browse
          </button>
          <!-- svelte-ignore a11y_mouse_events_have_key_events -->
          <button
            class="rounded-br-2xl {SUB_BUTTON_STYLE}"
            onclick={() => onClickSetting(deck.id)}
            onmouseenter={bgtexthover(bgtext2, ">> Settings")}
            onmouseleave={bgtexthover(bgtext2)}
            onmouseup={bgtexthover(bgtext2)}
          >
            Setting
          </button>
        </div>
      </Card.Root>
    {/each}
    {:else}
      <div class="text-muted-foreground text-center">no deck founded</div>
    {/if}
  </div>
{/snippet}

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
                isActive={currentPage === page.value}
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
            onclick={() => {
              const totalPages = Math.ceil((decks?.total || 0) / pageLimit);
              if (currentPage < totalPages) handlePageChange(currentPage + 1);
            }}
            onmouseenter={bgtexthover(bgtext2, ">> Go to Page " + (currentPage+1))}
            onmouseleave={bgtexthover(bgtext2)}
            onmouseup={bgtexthover(bgtext2)}
          />
        </Pagination.Item>
      </Pagination.Content>
    {/snippet}
  </Pagination.Root>
{/snippet}

{#snippet toolbarSnippet()}
  <DeckListToolbar
    toolbarContext={DeckListToolbarContext}
    onAdd={handleAddDeckClick}
    onSearch={handleSearch}
  />
{/snippet}
