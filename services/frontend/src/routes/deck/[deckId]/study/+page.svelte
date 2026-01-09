<script lang="ts">
    import { getContext, onMount, untrack } from "svelte";
    import { STUDY_DECK_TOOLBAR_CONTEXT, StudyDeckToolbarContextClass } from "../../../../lib/context/studyToolbar.svelte";
    import { fetchCardsByStatus, fetchCardsOnStart, submitCardReview } from "./services";
    import type { StudyCardsBlock } from "$lib/types/server/modules/deck/type/study_dto";
    import { page } from "$app/state";
    import { type CardRow, type DeckRow } from "$lib/types/server/core/supabase/type";
    import { fetchDeckByDeckId, fetchUserDecks } from "../../services";
    import { errorState } from "$lib/global/errorState.svelte";
    import { userState } from "$lib/global/userState.svelte";
    import type { GetDeckByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
    import { CardStatusType } from "$lib/types/server/modules/deck/type/model";
    import { STUDY_OPTIONS } from "$lib/constant/options";
    import { cardStudyFirstFetchMockData } from "../../../../mock/study";
    import * as Card from "$lib/components/ui/card/index";
    import Loading from "../../../Loading.svelte";
    import CardContent from "./Content.svelte";
    import CardFooter from "$lib/components/ui/card/card-footer.svelte";
    import GradeButton from "./GradeButtons.svelte";
    import GradeButtons from "./GradeButtons.svelte";

    

    const StudyDeckToolbarContext = getContext<StudyDeckToolbarContextClass>(STUDY_DECK_TOOLBAR_CONTEXT);
    const deckId = $derived(page.params.deckId as string);  // due to routing, it will never be undefined, okay? okay
    let deck = $state<GetDeckByIdRouteResponse | null>(null);
    let headerOrder = $state<Array<string> | null>(null);
    let currentCard = $state<CardRow | undefined>(undefined);
    let isFrontSide = $state(true); // or question side (no answer showing mode)
    let countThisSession = $state(0);
    let isFinished = $state(false);
    let isError = $state(false);



    let quality = $state<number | null>(null);
    let isLoading = $state<boolean>(true);
    let newCards = $state<StudyCardsBlock | null>(null);
    let dueCards = $state<StudyCardsBlock | null>(null);
    let retryCards = $state<StudyCardsBlock | null>(null);

    let newCardIsFetching = $state<boolean>(true);
    let newCardLength = $derived<number | undefined>(newCards?.items.length);
    let newCardTotalLeft = $derived<number | undefined>(newCards ? (newCards.total - newCards?.items.length) : undefined);
    let dueCardIsFetching = $state<boolean>(true);
    let dueCardLength = $derived<number | undefined>(dueCards?.items.length);
    let dueCardTotalLeft = $derived<number | undefined>(dueCards ? (dueCards.total - dueCards?.items.length) : undefined);
    let retryCardIsFetching = $state<boolean>(true);
    let retryCardLength = $derived<number | undefined>(retryCards?.items.length);
    let retryCardTotalLeft = $derived<number | undefined>(retryCards ? (retryCards.total - retryCards?.items.length) : undefined);


    // listen to deckId path changes change
    $effect(() => {
        if(!deckId) return;
        
        untrack(() => {
            isLoading = true;
            newCardIsFetching = true;
            dueCardIsFetching = true;
            retryCardIsFetching = true;
            
            Promise.all([
                fetchDeckByDeckId(deckId),
                fetchCardsOnStart(deckId, userState.timezone)
            ])
            .then(([deckResult, cardsResult]) => {
                deck = deckResult;
                headerOrder = deck?.headersorder as Array<string>;
                newCards = cardsResult[0];
                dueCards = cardsResult[1];
                retryCards = cardsResult[2];

                const allCards = [newCards, dueCards, retryCards];

                // NOTE: locked to new card for now and loop through each one for the first card

                for(const card of allCards) {
                    if(card?.items.length! > 0) {
                        currentCard = card?.items.shift();
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
                newCardIsFetching = false;
                dueCardIsFetching = false;
                retryCardIsFetching = false;
            });
        });

        // MOCKDATA
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

    // TODO: copy-paste this func for other cards type
    // listen to new cards length
    $effect(() => {
        const length = newCardLength;
        const totalLeft = newCardTotalLeft;
        const fetching = newCardIsFetching;
        const error = isError;

        if (fetching || error || length === undefined || totalLeft === 0 || 
            length > STUDY_OPTIONS.FETCH_NEW_CARD_WHEN_LENGTH) {
            return;
        }

        untrack(() => {
            newCardIsFetching = true;

            fetchCardsByStatus(deckId, CardStatusType.new, userState.timezone, length, STUDY_OPTIONS.CARD_FETCH_LIMIT)
                .then((result) => {
                    // Defensive check: Ensure items exist before filtering
                    const fetchedItems = result?.items ?? [];
                    const currentItems = newCards?.items ?? [];

                    const existingIds = new Set(currentItems.map(card => card.id));
                    const uniqueNewItems = fetchedItems.filter(card => !existingIds.has(card.id));

                    // Only update if we actually got new cards to prevent unnecessary triggers
                    if (uniqueNewItems.length > 0) {
                        newCards = { 
                            ...result,
                            items: [...currentItems, ...uniqueNewItems]
                        };
                    } else if (result && result.total !== undefined) {
                        // Update the metadata even if items are empty
                        newCards = { ...newCards, total: result.total } as StudyCardsBlock;
                    }
                })
                .catch((err) => {
                    isError = true;
                    errorState.show(err.message, err.status);
                })
                .finally(() => {
                    // Small delay can prevent "rapid fire" fetches if the API is too fast
                    setTimeout(() => { newCardIsFetching = false; }, 1000);
                });
            });
    });
    

    // listen to due cards length
    // $effect(() => {
        
    // });


    // listen to retry cards length
    // $effect(() => {
        
    // });

    

    ////////////////////////////////////////////////

    StudyDeckToolbarContext.onEditClick = () => {};
    StudyDeckToolbarContext.onDeleteClick = () => {};


    function handleGradeClick(timeSpent: number, quality: number) {
        console.log(currentCard, newCards, dueCards, retryCards)
        // if any of the cards is null, all of them will likely be null anyway, MAYBE ToT
        if(!currentCard || currentCard.status === undefined || !newCards || !dueCards || !retryCards) {
            isError = true;
            errorState.show("An error occured please try reload the page", 500);
            return;
        }

        submitCardReview(deckId, currentCard.id, {
            timeSpent: timeSpent,
            quality: quality
        })

        // NOTE: locked to new card before others for now
        if (newCards.items.length > 0) {
            currentCard = newCards.items.shift();
            --newCards.total;
        } 
        // NOTE: locked to retry showing every 4 cards for now
        else if (countThisSession % 4 === 0 && retryCards.items.length > 0) {
            currentCard = retryCards.items.shift();
            --retryCards.total;
        }
        else if (dueCards.items.length > 0) {
            currentCard = dueCards.items.shift();
            --dueCards.total;
        }
        else if (retryCards.items.length > 0) {
            currentCard = retryCards.items.shift();
            --retryCards.total;
        }
        else {
            isFinished = true;
        }
        
        ++countThisSession;
    }

</script>



<Card.Root class="w-full sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto flex justify-center text-center">
    {#if isError}
        <div>Error occured</div>
    {:else}
        {#if isLoading}
            <Loading/>
        {:else}
            {#if isFinished}
                <div>Finished</div>
            {:else}
                {#if currentCard}
                {@const status = currentCard.status}
                <Card.Header class="text-sm flex justify-center">
                    <span class={status === 0 ? "underline" : ""}>new: {newCards?.total}</span>
                    | 
                    <span class={status === 1 ? "underline" : ""}>due: {dueCards?.total}</span> 
                    | 
                    <span class={status === 2 ? "underline" : ""}>retry: {retryCards?.total}</span>
                </Card.Header>
                <CardContent bind:isFrontSide={isFrontSide} headerOrder={headerOrder} currentCard={currentCard}/>
                <GradeButtons bind:isFrontSide={isFrontSide}
                    onGradeClick={handleGradeClick}
                />
                {/if}
            {/if}
        {/if}
    {/if}
</Card.Root>
