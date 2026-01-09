<script lang="ts">
    import { HightlightBoxType } from '$lib/types/search';
    import type { Snippet } from 'svelte';

    // @ts-expect-error
    let { boxType }: HightlightBoxType = $props<HightlightBoxType | undefined>();


    let boxSnippet = $derived.by<Snippet | null>(() => {
        if(boxType === HightlightBoxType.common) return common;

        return null;
    });

</script>


<div>
    {#if boxSnippet}
        {@render boxSnippet()}
    {/if}
</div>


{#snippet common()}
    <div class="px-2 text-sm text-white bg-gradient-to-r from-green-600 to-yellow-400 rounded-sm">

        common
    </div>
{/snippet}