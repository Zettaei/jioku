<script lang="ts">
    import { page } from "$app/state";
    import { untrack } from "svelte";
    import { fetchStatus } from "./services";
    import type { GetDeckStatusByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
    import { userState } from "$lib/global/userState.svelte";
    import Card from "$lib/components/ui/card/card.svelte";
    import DeckStatusGraph from "./DeckStatusGraph.svelte";

    let deckId: string = $derived(page.params.deckId ?? '');
    let deckStatus: GetDeckStatusByIdRouteResponse = $state(null);

    let isLoading = $state(true);

    $effect(() => {
        deckId = page.params.deckId!;

        if(!deckId) {
            return;
        }

        untrack(() => {
            isLoading = true;
            console.log(deckId)
            fetchStatus(deckId, userState.timezone)
            .then((fetchResult) => {
                deckStatus = fetchResult;
            })
            .catch((err) => {
                throw err;
            })
            .finally(() => {
                isLoading = false;
            })
        })
    })

</script>


<div>
    {#if isLoading}
        <p class="text-center">Loading deck status...</p>
    {:else}
        {#if deckStatus}
            <DeckStatusGraph deckId={deckId} deckStatus={deckStatus} />
        {/if}

    {/if}
</div>