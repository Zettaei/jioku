<script lang="ts">
    import { getContext, onMount, untrack } from "svelte";
    import { STUDY_DECK_TOOLBAR_CONTEXT, StudyDeckToolbarContextClass } from "../../../../lib/context/studyToolbar.svelte";
    import { fetchCardsByStatus, fetchCardsOnStart } from "./services";
    import type { StudyCardsBlock } from "$lib/types/server/modules/deck/type/study_dto";
    import { page } from "$app/state";
    import type { DeckRow } from "$lib/types/server/core/supabase/type";
    import { fetchDeckByDeckId, fetchUserDecks } from "../../services";
    import { errorState } from "$lib/global/errorState.svelte";
    import { userState } from "$lib/global/userState.svelte";
    import type { GetDeckByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
    import { CardStatusType } from "$lib/types/server/modules/deck/type/model";
    import { STUDY_OPTIONS } from "$lib/constant/options";


    const StudyDeckToolbarContext = getContext<StudyDeckToolbarContextClass>(STUDY_DECK_TOOLBAR_CONTEXT);
    const deckId = $derived(page.params.deckId as string);  // due to routing, it will never be undefined, okay? okay
    let deck = $state<GetDeckByIdRouteResponse | null>(null);


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
                newCards = cardsResult[0];
                dueCards = cardsResult[1];
                retryCards = cardsResult[2];
            })
            .catch((err) => errorState.show(err.message, err.status))
            .finally(() => {
                isLoading = false;
                newCardIsFetching = false;
                dueCardIsFetching = false;
                retryCardIsFetching = false;
            });
        });
    });

    // listen to new cards length
    $effect(() => {

        if(newCardIsFetching === true ||
        newCardLength === undefined || newCardTotalLeft === undefined || 
        newCardTotalLeft === 0 || newCardLength > STUDY_OPTIONS.FETCH_NEW_CARD_WHEN_LENGTH) return

        untrack(() => {
            newCardIsFetching = true;

            fetchCardsByStatus(deckId, CardStatusType.new, userState.timezone, newCardLength, STUDY_OPTIONS.CARD_FETCH_LIMIT)
            .then((result) => {
                const currentCards = newCards?.items ?? [];

                // justtttt in case, get only card we didn't have (this is okay for small count, I think)
                const existingIds = new Set(currentCards.map(card => card.id));
                const uniqueNewItems = result.items.filter(fetchedCard => !existingIds.has(fetchedCard.id));

                newCards = { 
                    ...result,
                    items: [...currentCards, ...uniqueNewItems]
                };
            })
            .catch((err) => errorState.show(err.message, err.status))
            .finally(() => {
                newCardIsFetching = false;
            });
        })
    });

    // listen to due cards length
    $effect(() => {
        if(dueCardLength === undefined || dueCardTotalLeft === undefined) return
    });

    // listen to retry cards length
    $effect(() => {
        if(retryCardLength === undefined || retryCardTotalLeft === undefined) return
    });

    

    ////////////////////////////////////////////////

    StudyDeckToolbarContext.onEditClick = () => {};
    StudyDeckToolbarContext.onDeleteClick = () => {};


    function handleGradeClick() {
        
    }

    function handleShowClick() {

    }

</script>


<div>
    d
</div>