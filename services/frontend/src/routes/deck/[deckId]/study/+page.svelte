<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { STUDY_DECK_TOOLBAR_CONTEXT, StudyDeckToolbarContextClass } from "../../../../lib/context/studyToolbar.svelte";
    import { fetchCardsOnStart } from "./services";
    import type { StudyCardsBlock } from "$lib/types/server/modules/deck/type/study_dto";


    const StudyDeckToolbarContext = getContext<StudyDeckToolbarContextClass>(STUDY_DECK_TOOLBAR_CONTEXT);

    let isLoading = $state(true);
    let newCards = $state<Array<StudyCardsBlock>>([]);
    let dueCards = $state<Array<StudyCardsBlock>>([]);
    let retryCards = $state<Array<StudyCardsBlock>>([]);

    onMount(() => {
        fetchCardsOnStart()
        .then((result) => {
            newCards = result[0];
            dueCards = result[1];
            retryCards = result[2];
        })
        .finally(() => {
            isLoading = false;
        });

    })

    $effect(() => {

    });


    StudyDeckToolbarContext.onEditClick = () => {}
    StudyDeckToolbarContext.onDeleteClick = () => {}


    function handleGradeClick() {

    }

    function handleShowClick() {

    }

</script>


<div>
    
</div>