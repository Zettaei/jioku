<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select/index.js";
    import { cardExtraHeaderName, cardExtraHeaderOrder } from "$lib/constant/cardExtraRows";
    import { ArrowUp, ArrowDown } from "@lucide/svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { useSidebar } from "$lib/components/ui/sidebar";

    interface Props {
        sortBy: string,
        sortAsc: boolean
    }

    let { sortBy, sortAsc }: Props = $props();

    const sidebar = useSidebar();

</script>

<div class="flex items-center">

    {#if !sidebar.isMobile}
        <div class="me-2">
            Sort
        </div>
    {/if}

  <Select.Root
    type="single"
    value={sortBy}
    onValueChange={(val) => {
        const url = new URL(page.url);
        url.searchParams.set("sortby", val);
        url.searchParams.delete("page");    // <== not actually using "page" as param but ok

        goto(url, {
            keepFocus: true,
            replaceState: true
        })
    }}
  >
    <Select.Trigger class="rounded-r-none">
        {cardExtraHeaderName[sortBy as keyof typeof cardExtraHeaderName]}
    </Select.Trigger>
    <Select.Content>
        {#each cardExtraHeaderOrder as header}
            <Select.Item value={header} disabled={sortBy === header}>
                {cardExtraHeaderName[header]}
            </Select.Item>
        {/each}
    </Select.Content>
  </Select.Root>

  <Button variant="outline" onclick={() => {
        const url = new URL(page.url);
        url.searchParams.set("sortasc", (!sortAsc).toString());

        goto(url, {
            keepFocus: true,
            replaceState: true
        })
    }} class="w-10 rounded-l-none">
        {#if sortAsc}
        <ArrowUp size={16} />
        {:else}
        <ArrowDown size={16} />
        {/if}
  </Button>
</div>