<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Columns3Icon } from "@lucide/svelte";
    import { cardExtraHeaderName, cardExtraHeaderOrder } from "$lib/constant/cardExtraRows";
    import { useSidebar } from "$lib/components/ui/sidebar";

    interface Header {
        key: string;
        label: string;
    }

    interface Props {
        headers: Header[];
        hiddenDataCols: Set<string>;
        hiddenExtraCols: Set<string>;
    }

    let { headers, hiddenDataCols = $bindable(), hiddenExtraCols = $bindable() }: Props = $props();
    const sidebar = $state(useSidebar());

    function toggleDataCol(key: string) {
        if (hiddenDataCols.has(key)) {
            hiddenDataCols.delete(key);
        } else {
            hiddenDataCols.add(key);
        }
        hiddenDataCols = new Set(hiddenDataCols);
    }

    function toggleExtraCol(key: string) {
        if (hiddenExtraCols.has(key)) {
            hiddenExtraCols.delete(key);
        } else {
            hiddenExtraCols.add(key);
        }
        hiddenExtraCols = new Set(hiddenExtraCols);
    }
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button variant="outline" {...props}>
                <Columns3Icon size={16} />
                {#if !sidebar.isMobile}
                    <span class="ms-1">Columns</span>
                {/if}
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-52" align="end">
        <DropdownMenu.Label class="opacity-60 uppercase tracking-wide text-xs">Card Data</DropdownMenu.Label>
        {#each headers as header}
            <DropdownMenu.CheckboxItem
                checked={!hiddenDataCols.has(header.key)}
                onCheckedChange={() => toggleDataCol(header.key)}
                closeOnSelect={false}
            >
                {header.label}
            </DropdownMenu.CheckboxItem>
        {/each}

        <DropdownMenu.Separator />

        <DropdownMenu.Label class="opacity-60 uppercase tracking-wide text-xs">Metadata</DropdownMenu.Label>
        {#each cardExtraHeaderOrder as key}
            <DropdownMenu.CheckboxItem
                checked={!hiddenExtraCols.has(key)}
                onCheckedChange={() => toggleExtraCol(key)}
                closeOnSelect={false}
            >
                {cardExtraHeaderName[key]}
            </DropdownMenu.CheckboxItem>
        {/each}
    </DropdownMenu.Content>
</DropdownMenu.Root>
