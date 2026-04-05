<script lang="ts">
    import { getContext, onMount, untrack } from "svelte";
    import { STUDY_DECK_TOOLBAR_CONTEXT, StudyDeckToolbarContextClass } from "../../../../lib/context/studyToolbar.svelte";
    import { fetchCardsByStatus, fetchCardsOnStart, submitCardReview } from "./services";
    import type { StudyCardsBlock } from "$lib/types/server/modules/deck/type/study_dto";
    import { page } from "$app/state";
    import { type CardRow, type DeckRow } from "$lib/types/server/core/supabase/type";
    import { fetchDeckByDeckId } from "../../services";
    import { errorState } from "$lib/global/errorState.svelte";
    import { userStore } from "$lib/stores/auth";
    import type { GetDeckByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
    import { CardStatusType } from "$lib/types/server/modules/deck/type/model";
    import { STUDY_OPTIONS } from "$lib/constant/options";
    import { cardStudyFirstFetchMockData } from "../../../../mock/study";
    import * as Card from "$lib/components/ui/card/index";
    import Loading from "../../../Loading.svelte";
    import CardContent from "./Content.svelte";
    import GradeButtons from "./GradeButtons.svelte";
    import BackButton from "$lib/components/BackButton.svelte";
    import { SESSIONSTORAGE_PREV_DECK_LIST } from "$lib/constant/sessionStorageKey";
    import { DECK_EXTRA_SETTING_DEFAULT_VALUE } from "$lib/constant/deck";
    import type { DeckExtraSetting } from "$lib/types/deck";
    import { LocalStorageKey } from "$lib/localStorage";

    
    const backDestination = "/deck";
    const StudyDeckToolbarContext = getContext<StudyDeckToolbarContextClass>(STUDY_DECK_TOOLBAR_CONTEXT);
    const deckId = $derived(page.params.deckId as string);  // due to routing, it will never be undefined, okay? okay
    let deck = $state<GetDeckByIdRouteResponse | null>(null);
    let headerOrder = $derived<Array<string>>(deck?.headersorder as Array<string> ?? []);
    let currentCard = $state<CardRow | undefined>(undefined);
    let isFrontSide = $state(true); // or question side (no-answer-showing mode)
    let countThisSession = $state(0);
    let newCountToday = $state(0);
    let isFinished = $state(false);
    let isError = $state(false);

    let isLoading = $state<boolean>(true);
    let isSubmitting = $state<boolean>(false);
    let submitError = $state<boolean>(false);
    let newCards = $state<StudyCardsBlock | null>(null);
    let dueCards = $state<StudyCardsBlock | null>(null);
    let retryCards = $state<StudyCardsBlock | null>(null);
    
    // Track pending fetch operations per card status
    let pendingFetch = $state({
        [CardStatusType.new]: false,
        [CardStatusType.review]: false,
        [CardStatusType.retry]: false
    });

    let newCardLength = $derived(newCards?.items?.length ?? 0);
    let newCardTotalLeft = $derived(
        newCards ? (Math.max(0, (newCards.total ?? 0) - (newCards.items?.length ?? 0))): 0
    );

    // Do the same for due and retry cards
    let dueCardLength = $derived(dueCards?.items?.length ?? 0);
    let dueCardTotalLeft = $derived(
        dueCards ? (Math.max(0, (dueCards.total ?? 0) - (dueCards.items?.length ?? 0))): 0
    );

    let retryCardLength = $derived(retryCards?.items?.length ?? 0);
    let retryCardTotalLeft = $derived(
        retryCards ? (Math.max(0, (retryCards.total ?? 0) - (retryCards.items?.length ?? 0))): 0
    );

    // FIXME: Fake the newLimit setting, it only work for individual device for now.

    let newLimit = $derived<number>(
        ((deck?.settings as unknown as DeckExtraSetting)?.newLimit)
        ?? (DECK_EXTRA_SETTING_DEFAULT_VALUE.newLimit as number)
    );
    let newLimitReached = $derived(newCountToday >= newLimit);

    function getTodayDateStr(): string {
        const timezone = $userStore?.timezone ?? 'Asia/Bangkok';
        return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date());
    }
    function loadNewCountFromStorage(id: string): number {
        const raw = localStorage.getItem(`${LocalStorageKey.StudyNewCardCount}_${id}`);
        if (!raw) return 0;
        try {
            const parsed = JSON.parse(raw) as { count: number; date: string };
            if (parsed.date !== getTodayDateStr()) return 0;
            return parsed.count ?? 0;
        } catch { return 0; }
    }
    function saveNewCountToStorage(id: string, count: number): void {
        localStorage.setItem(
            `${LocalStorageKey.StudyNewCardCount}_${id}`,
            JSON.stringify({ count, date: getTodayDateStr() })
        );
    }

    ///////////////////////

    async function refillCards(status: CardStatusType, currentBlock: StudyCardsBlock | null)
    : Promise<StudyCardsBlock | null>
    {
        if (pendingFetch[status] || !currentBlock) return null;

        const totalLeft = currentBlock.total - currentBlock.items.length;
        if (totalLeft <= 0) return currentBlock;

        pendingFetch[status] = true;

        try {
            const items = currentBlock.items;
            const result = await fetchCardsByStatus(
                deckId, 
                status, 
                $userStore?.timezone ?? "Asia/Bangkok", 
                items.length, 
                STUDY_OPTIONS.CARD_FETCH_LIMIT
            );

            const fetchedItems = result?.items ?? [];
            const existingIds = new Set(items.map(card => card.id));
            const uniqueItems = fetchedItems.filter(card => !existingIds.has(card.id));

            if (uniqueItems.length > 0) {
                return { 
                    ...result,
                    items: [...items, ...uniqueItems]
                };
            } else if (result) {
                return { ...currentBlock, total: result.total };
            }
        } catch (err: any) {
            isError = true;
            errorState.show(err.message, err.status);
        } finally {
            pendingFetch[status] = false;
        }
        return currentBlock;
    }



    // listen to deckId path changes
    $effect(() => {
        if(!deckId) return;
        
        untrack(() => {
            pendingFetch[CardStatusType.new] = true;
            pendingFetch[CardStatusType.review] = true;
            pendingFetch[CardStatusType.retry] = true;
            isLoading = true;
            
            Promise.all([
                fetchDeckByDeckId(deckId),
                fetchCardsOnStart(deckId, $userStore?.timezone ?? "Asia/Bangkok")
            ])
            .then(([deckResult, cardsResult]) => {
                deck = deckResult;
                headerOrder = deck?.headersorder as Array<string>;
                newCards = cardsResult[0];
                dueCards = cardsResult[1];
                retryCards = cardsResult[2];

                newCountToday = loadNewCountFromStorage(deckId);
                const limitReached = newCountToday >= (((deckResult?.settings as unknown as DeckExtraSetting)?.newLimit) ?? (DECK_EXTRA_SETTING_DEFAULT_VALUE.newLimit as number));

                const allCards = [newCards, dueCards, retryCards];

                // NOTE: locked to new card for now and loop through each one for the first card

                for (let i = 0; i < allCards.length; i++) {
                    const card = allCards[i];
                    if (i === 0 && limitReached) continue; // skip new cards if daily limit reached
                    if ((card?.items?.length ?? 0) > 0) {
                        currentCard = card?.items[0];
                        return;
                    }
                }

                isFinished = true;
                return;

            })
            .catch((err) => {
                errorState.show(err.message, err.status)
                isError = true;
            })
            .finally(() => {
                isLoading = false;
                pendingFetch[CardStatusType.new] = false;
                pendingFetch[CardStatusType.review] = false;
                pendingFetch[CardStatusType.retry] = false;
            });
        });

        // // MOCKDATA
        // untrack(() => {
        //     isLoading = true;
        //     headerOrder = deck?.headersorder as Array<string>;

        //     newCards = cardStudyFirstFetchMockData[0] as StudyCardsBlock;
        //     dueCards = cardStudyFirstFetchMockData[1] as StudyCardsBlock;
        //     retryCards = cardStudyFirstFetchMockData[2] as StudyCardsBlock;

        //     currentCard = newCards.items[0];

        //     isLoading = false;
        // })
    });


    // NOTE: dont know if these work as intended, but Sonnet 4.6-san said it is though
    // listen to new cards length changes
    $effect(() => {
        const length = newCardLength;
        const totalLeft = newCardTotalLeft;

        if (newLimitReached || totalLeft <= 0 || length === undefined || length > STUDY_OPTIONS.FETCH_NEW_CARD_WHEN_LENGTH) {
            return;
        }

        untrack(() => {
            refillCards(CardStatusType.new, newCards)
            .then((updatedBlock) => {
                if(updatedBlock === null) return;

                if (updatedBlock) newCards = updatedBlock;
            })
            .finally(() => {
            });

        });
    });


    // listen to due cards length changes
    $effect(() => {
        const length = dueCardLength;
        const totalLeft = dueCardTotalLeft;

        if (totalLeft <= 0 || length === undefined || length > STUDY_OPTIONS.FETCH_NEW_CARD_WHEN_LENGTH) {
            return;
        }

        untrack(() => {
            refillCards(CardStatusType.review, dueCards)
            refillCards(CardStatusType.review, dueCards)
            .then((updatedBlock) => {
                if(updatedBlock === null) return;

                if (updatedBlock) dueCards = updatedBlock;
            })
            .finally(() => {
            });

        });
    });


    // listen to retry cards length changes
    $effect(() => {
        const length = retryCardLength;
        const totalLeft = retryCardTotalLeft;

        if (totalLeft <= 0 || length === undefined || length > STUDY_OPTIONS.FETCH_NEW_CARD_WHEN_LENGTH) {
            return;
        }

        untrack(() => {
            refillCards(CardStatusType.retry, retryCards)
            .then((updatedBlock) => {
                if(updatedBlock === null) return;

                if (updatedBlock) retryCards = updatedBlock;
            })
            .finally(() => {
            });

        });
    });

    

    ////////////////////////////////////////////////

    // NOTE: Maybe for future implementation - currently disabled during study mode
    StudyDeckToolbarContext.onEditClick = () => {};
    StudyDeckToolbarContext.onDeleteClick = () => {};


    function handleGradeClick(timeSpent: number, quality: number) {
    if (!currentCard || !newCards || !dueCards || !retryCards || isSubmitting || submitError) return;

    isSubmitting = true;
    submitCardReview(deckId, currentCard.id, { timeSpent, quality })
    .then(() => {
        // Submission succeeded, safe to proceed with state updates
        submitError = false;

        // Track if the graded card was a new card before removal
        const wasNewCard = newCards?.items?.some(c => c.id === currentCard!.id) ?? false;

        // 1. Remove the card from the active list
        // We filter by ID to be safe rather than shift()
        if (newCards?.items?.some(c => c.id === currentCard!.id)) {
            newCards = { ...newCards, items: newCards.items.filter(c => c.id !== currentCard!.id), total: newCards.total - 1 };
        } else if (dueCards?.items?.some(c => c.id === currentCard!.id)) {
            dueCards = { ...dueCards, items: dueCards.items.filter(c => c.id !== currentCard!.id), total: dueCards.total - 1 };
        } else if (retryCards?.items?.some(c => c.id === currentCard!.id)) {
            retryCards = { ...retryCards, items: retryCards.items.filter(c => c.id !== currentCard!.id), total: retryCards.total - 1 };
        }

        // Increment and persist new card count if a new card was just reviewed
        if (wasNewCard) {
            newCountToday++;
            saveNewCountToStorage(deckId, newCountToday);
        }

        // if failed, add to retry
        if (quality < 3) {
            const failedCard = { ...currentCard, status: CardStatusType.retry } as CardRow;
            retryCards = { ...retryCards!, items: [...retryCards!.items, failedCard], total: retryCards!.total + 1 };
        }

        if((retryCards?.items?.length ?? 0) > 0 && countThisSession % 4 === 0) {
            currentCard = retryCards!.items[0];

        } else if ((newCards?.items?.length ?? 0) > 0 && !newLimitReached) {
            currentCard = newCards!.items[0];

        } else if ((dueCards?.items?.length ?? 0) > 0) {
            currentCard = dueCards!.items[0];

        } else if ((retryCards?.items?.length ?? 0) > 0) {
            currentCard = retryCards!.items[0];
            
        } else {
            isFinished = true;
        }

        isFrontSide = true;
        countThisSession++;
    })
    .catch((err) => {
        errorState.show(err.message, err.status);
        submitError = true;
    })
    .finally(() => {
        isSubmitting = false;
    });
}

</script>

<Card.Root
  class="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto flex justify-center text-center"
>
  {#if isError}
    <div>An Error occured</div>
  {:else if isLoading}
    <Loading />
  {:else if isFinished}
    {@render finishedPage()}
  {:else if currentCard}
    {@const status = currentCard.status}
    <Card.Header class="text-sm flex justify-center">
      <span class={status === 0 ? "underline" : ""}>new: {newLimitReached ? 0 : Math.min(newCards?.total ?? 0, newLimit - newCountToday)}</span
      >
      |
      <span class={status === 1 ? "underline" : ""}>due: {dueCards?.total!}</span
      >
      |
      <span class={status === 2 ? "underline" : ""}
        >retry: {retryCards?.total! }</span
      >
    </Card.Header>
    <CardContent bind:isFrontSide headerOrder={headerOrder} currentCard={currentCard} />
    <GradeButtons bind:isFrontSide onGradeClick={handleGradeClick} />
  {/if}
</Card.Root>

{#snippet finishedPage()}
    <div>Finished</div>
    <div>
        <BackButton destination={backDestination} 
        sessionStorageKey={SESSIONSTORAGE_PREV_DECK_LIST}
        />
    </div>
{/snippet}
