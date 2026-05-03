<script lang="ts">
    import { page } from "$app/state";
    import { untrack } from "svelte";
    import { fetchStatus } from "./services";
    import type { GetDeckStatusByIdRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
    import { userStore } from "$lib/stores/auth";
    import Card from "$lib/components/ui/card/card.svelte";
    import DeckStatusGraph from "./DeckStatusGraph.svelte";
    import { fetchDeckByDeckId } from "../../services";

    let deckId: string = $derived(page.params.deckId ?? '');
    let deckStatus: GetDeckStatusByIdRouteResponse = $state(null);
    let deckName: string = $state("");

    let isLoading = $state(true);

    $effect(() => {
        deckId = page.params.deckId!;

        if(!deckId) {
            return;
        }

        untrack(() => {
            isLoading = true;
            Promise.all([
                fetchStatus(deckId, $userStore?.timezone ?? "Asia/Bangkok"),
                fetchDeckByDeckId(deckId)
            ])
            .then(([statusResult, deckResult]) => {
                deckStatus = statusResult;
                deckName = deckResult?.name ?? "";
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

<svelte:head>
  <title>DECK STATISTICS{deckName ? ": " + deckName : ""}</title>
</svelte:head>

<div class="w-full max-x-4xl">
    {#if isLoading}
        <p class="text-center">Loading deck statistics...</p>
    {:else}
        {#if deckStatus}
            <DeckStatusGraph deckId={deckId} deckName={deckName} deckStatus={deckStatus} />
        {/if}

    {/if}
</div>