<script lang="ts">
	import type { DeckStatus, GetRetentionRateByDateRouteResponse } from "$lib/types/server/modules/deck/type/deck_dto";
	import Table from "$lib/components/ui/table/table.svelte";
	import TableHeader from "$lib/components/ui/table/table-header.svelte";
	import TableBody from "$lib/components/ui/table/table-body.svelte";
	import TableRow from "$lib/components/ui/table/table-row.svelte";
	import TableCell from "$lib/components/ui/table/table-cell.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Select from "$lib/components/ui/select/index.js";
    import { cardExtraHeaderName, cardExtraHeaderOrder } from "$lib/constant/cardExtraRows";
    import { ArrowUp, ArrowDown } from "@lucide/svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { fetchRetentionRateByDate } from "./services";
    import { userState } from "$lib/global/userState.svelte";
    import type { ReviewRetentionRate } from "$lib/types/server/modules/deck/type/model";
    
    const { deckId } = $props();

    const dateType = {
        "today": "today", 
        "yesterday": "yesterday", 
        "last7days": "last7days", 
        "last30days": "last30days", 
        "last90days": "last90days", 
        "last180days": "last180days", 
        "last360days": "last360days"
     } as const;
    const dateTypeFullname = {
        [dateType.today]: "Today",
        [dateType.yesterday]: "Yesterday",
        [dateType.last7days]: "Last 7 days",
        [dateType.last30days]: "Last 30 days",
        [dateType.last90days]: "Last 90 days",
        [dateType.last180days]: "Last 180 days",
        [dateType.last360days]: "Last 360 days"
    } as const;

    let currentDateType = $state<keyof typeof dateType>(dateType.today);
    let isLoading = $state<boolean>(true)

    let retentionrate = $state<ReviewRetentionRate | undefined>();

    let from = $state<string | undefined>(undefined);
    let to = $state<string | undefined>(undefined);
	let passed = $state(0);
	let failed = $state(0);

    $effect(() => {
        isLoading = true;
        
        fetchRetentionRateByDate(deckId, userState.timezone, from, to)
        .then((data) => {
            retentionrate = data;
        })
        .catch((err) => {
            throw err;
        })
        .finally(() => {
            isLoading = false;
        });
    });

</script>

<div>
	<h3 class="text-sm font-semibold mb-4 text-center">Review Retention Rate</h3>
	<div class="flex">
        <div class="mb-2 text-left">
            <span class="font-semibold">Date:</span>
            {#if from === to}
                {from}
            {:else}
                {from} - {to}
            {/if}
        </div>
        <div>
            
        </div>
    </div>
	<Table class="text-center">
		<TableHeader class="text-center">
			<TableCell>Passed</TableCell>
			<TableCell>Failed</TableCell>
			<TableCell>Accuracy</TableCell>
		</TableHeader>
		<TableBody>
			<TableRow>
				<TableCell>{passed}</TableCell>
				<TableCell>{failed}</TableCell>
				<TableCell>
					{failed !== 0 ? (passed / failed) : 0}
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</div>


{#snippet dropdown()}
    <div class="flex items-center">
    <Select.Root
        type="single"
        value={currentDateType}
        onValueChange={() => {
            
        }}
    >
        <Select.Trigger class="rounded-r-none">
            
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
{/snippet}