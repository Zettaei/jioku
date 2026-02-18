<script lang="ts">
    import * as Card from "$lib/components/ui/card/index";

    interface Props {
        count: number;
    }

    // @ts-expect-error
    let { count } = $props<Props>()

</script>

{#if count > 0}
<div class="fixed top-12 right-2">
    <Card.Root class="py-2 px-4 rounded-md text-sm text-end border-yellow-500">
        row selected: {count}
    </Card.Root>
</div>
{/if}

<!-- UNUSEDDDDDDDDDDD AT ALLLLLLLLLLLLL BUT I DONT WANNA DELETE IT, JUST IN CASE -->