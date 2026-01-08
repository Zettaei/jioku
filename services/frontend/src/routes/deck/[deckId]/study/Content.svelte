<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";
    import type { CardRow } from "$lib/types/server/core/supabase/type";

    interface Props {
        isFrontSide: boolean;
        headerOrder: Array<string> | null;
        currentCard: CardRow | null;
    }

    // @ts-expect-error
    let { isFrontSide = $bindable(), headerOrder, currentCard }: Props = $props<Props>();

</script>


<Card.Content class="text-xl">
    {#each headerOrder as header}
        <div class="mt-10 min-h-[1lh] whitespace-pre-wrap">
            {(currentCard?.data as Array<string>)[(header as unknown as number)] ?? " "}
        </div>
    {/each}
</Card.Content>