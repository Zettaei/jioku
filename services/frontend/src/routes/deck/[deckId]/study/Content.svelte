<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";
    import type { CardRow } from "$lib/types/server/core/supabase/type";

    interface Props {
        isFrontSide: boolean;
        headerOrder: Array<string>;
        currentCard: CardRow;
    }

    // @ts-expect-error
    let { isFrontSide = $bindable(), headerOrder, currentCard }: Props = $props<Props>();

</script>


<Card.Content class="text-xl p-0">
    <div class="h-140 overflow-y-auto p-6 border-t border-border">
        {#if isFrontSide}
            <!-- locked to the first one -->
            <div class="whitespace-pre-wrap">
                {(currentCard?.data as Array<string>)[(headerOrder[0] as unknown as number)] ?? " "}
            </div>
        {:else}
            {#each headerOrder as header}
                <div class="mt-6 whitespace-pre-wrap">
                    {(currentCard?.data as Array<string>)[(header as unknown as number)] ?? " "}
                </div>
            {/each}
        {/if}
    </div>
</Card.Content>