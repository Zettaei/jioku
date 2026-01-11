<script lang="ts">
    import * as Card from '$lib/components/ui/card/index';


    let { data } = $props();

    let deckId = $derived(data.deckId);
    let deck = $derived(data.deck);
</script>



<div>
    <Card.Root class="flex justify-center text-center">
    {#if !deck}
        <div>Deck Not Founded or Incorrect Permission</div>
    {:else}
        <Card.Header>
            <span class="text-xl font-bold">Deck:</span> <span class="text-lg">{deck?.name}</span>
        </Card.Header>
        <Card.Content>
            
        </Card.Content>
    {/if}
    </Card.Root>
</div>