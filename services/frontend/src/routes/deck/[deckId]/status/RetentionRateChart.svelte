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
    import { userStore } from "$lib/stores/auth";
    import type { ReviewRetentionRate } from "$lib/types/server/modules/deck/type/model";
    import { onMount, untrack } from "svelte";
    import { date } from "svelte-i18n";

    interface Props {
        deckId: string;
        defaultRetentionRate: ReviewRetentionRate;
    }
    
    const { deckId, defaultRetentionRate }: Props = $props();

    const dateType = {
        today: "today", 
        yesterday: "yesterday", 
        last7days: "last7days", 
        last30days: "last30days", 
        last90days: "last90days", 
        last180days: "last180days", 
        last360days: "last360days"
    } as const;
    const dateTypeFullname: Record<keyof typeof dateType, string> = {
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
    let isFirst = $state(true);

    let retentionrate = $state<ReviewRetentionRate | undefined>();

    let from = $state<string | undefined>(defaultRetentionRate.from);
    let to = $state<string | undefined>(defaultRetentionRate.to);
	let passed = $state(0);
	let failed = $state(0);
    let accuracy = $derived(
        ((passed + failed !== 0 ? (passed / (passed + failed)) : 0) * 100).toFixed(2)
    );

    $effect(() => {
        isLoading = true;
        const tmpDeckId = deckId;
        const tmpFrom = from;
        const tmpTo = to;
        const tmpCurrentDateType = currentDateType;
        
        untrack(() => {
            if(!isFirst) {
                fetchRetentionRateByDate(deckId, $userStore?.timezone ?? "Asia/Bangkok", from, to)
                .then((data) => {
                    retentionrate = data;
                    from = data.from;
                    to = data.to;
                    passed = data.passed;
                    failed = data.failed;
                })
                .catch((err) => {
                    throw err;
                })
                .finally(() => {
                    isLoading = false;
                });
            }
            else {
                retentionrate = defaultRetentionRate;
                from = defaultRetentionRate.from;
                to = defaultRetentionRate.to;
                passed = defaultRetentionRate.passed;
                failed = defaultRetentionRate.failed;
                isFirst = false;
                isLoading = false;
            }
        })
    });

    function handleDateTypeChange(selectedDateType: keyof typeof dateType) 
    {
        const tmpFrom = new Date();
        const tmpTo = new Date();
        
        let isNotToday = true;
        let offset = 0;

        switch(selectedDateType) {
            case dateType.yesterday:
                offset = -1;
                break;
            case dateType.last7days:
                offset = -7;
                break;
            case dateType.last30days:
                offset = -30;
                break;
            case dateType.last90days:
                offset = -90;
                break;
            case dateType.last180days:
                offset = -180;
                break;
            case dateType.last360days:
                offset = -360;
                break;
            case dateType.today:
                isNotToday = false;
            default:
                offset = 0;
                break;
        }

        // NOTE: KINDA BAD IDEA TO DO THIS, SHOULD HAVE STICK WITH THE OFFSET NUBMER, BUT HEY IT STILL WORKED THO
        tmpFrom.setDate(tmpTo.getDate() + offset);
        tmpTo.setDate(tmpTo.getDate() + (isNotToday ? -1 : 0))
        from = tmpFrom.toISOString().split('T')[0];
        to = tmpTo.toISOString().split('T')[0];
    }

    

</script>

<div>
	<h3 class="text-md font-semibold mb-4 text-center">Review Retention Rate</h3>
    <div class="text-sm">
        <div class="flex justify-between items-center mb-3">
            <div class="text-left justify-self-center flex">
                <span class="font-semibold me-2">Date:</span>
                {#if currentDateType === "today"}
                    {@render dateWithTodayBadge(to ?? "")}
                {:else if currentDateType === "yesterday"}
                    {to?.replaceAll('-', '/')}
                {:else}
                    <div class="flex gap-x-1 items-center">
                        <span>{from?.replaceAll('-', '/')}</span>
                        <span> - </span>
                        <span>{to?.replaceAll('-', '/')}</span>
                    </div>
                {/if}
            </div>
            <div class="pb-6">
                {@render dropdown()}
            </div>
        </div>
        <Table class="text-center">
            <TableHeader class="text-center">
                <TableCell>Passed</TableCell>
                <TableCell>Failed</TableCell>
                <TableCell>Accuracy</TableCell>
            </TableHeader>
        {#if !isLoading}
            <TableBody>
                <TableRow>
                    <TableCell>{passed !== 0 ? passed : '-'}</TableCell>
                    <TableCell>{failed !== 0 ? failed : '-'}</TableCell>
                    <TableCell>
                        {accuracy !== '0.00' ? accuracy+'%' : '-'
                        }
                    </TableCell>
                </TableRow>
            </TableBody>
        {:else}
            <TableBody>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                        <div class="text-muted-foreground">
                            Loading
                        </div>
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableBody>
            
        {/if}
        </Table>
    </div>
        
</div>


{#snippet dropdown()}
    <Select.Root
        disabled={isLoading}
        type="single"
        value={currentDateType}
        onValueChange={(val) => {
            currentDateType = (val as keyof typeof dateType);
            handleDateTypeChange(currentDateType);
        }}
    >
        <Select.Trigger>
            {dateTypeFullname[currentDateType]}
        </Select.Trigger>
        <Select.Content>
            {#each Object.values(dateType) as date}
                <Select.Item value={date} disabled={currentDateType === date}>
                    {dateTypeFullname[date]}
                </Select.Item>
            {/each}
        </Select.Content>
    </Select.Root>
{/snippet}

{#snippet dateWithTodayBadge(text: string)}
    <div class="relative">
        <span class="absolute -top-3 text-[0.65rem] text-yellow-500 font-bold">
            {#if text} 
                TODAY
            {/if}
        </span>
        <span>{to?.replaceAll('-', '/')}</span>
    </div>
{/snippet}