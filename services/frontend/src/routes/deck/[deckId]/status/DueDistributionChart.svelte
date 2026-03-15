<script lang="ts">
	import type { CardsDueDistribution } from "$lib/types/server/modules/deck/type/model";
	import {
		Tooltip,
		TooltipContent,
		TooltipTrigger,
		TooltipProvider,
	} from "$lib/components/ui/tooltip";
    import { untrack } from "svelte";
    import { userState } from "$lib/global/userState.svelte";
    import { fetchDueDistribution } from "./services";
    import * as Select from "$lib/components/ui/select/index";

	interface Props {
		deckId: string;
		defaultDueDistribution: CardsDueDistribution;
	}

	let { deckId, defaultDueDistribution }: Props = $props();
	const MAX_DUE_COUNT_IN_BOX = 9999;
	
	let colorRules = $state<Array<{ count: number; color: string }>>([]);

	function generateColorRules(dues_data: CardsDueDistribution["dues"] | undefined) {
		if (!dues_data || dues_data.length === 0) {
			return [{ count: 0, color: "rgba(0,0,0,0.3)" }];
		}

		const counts = dues_data.map(item => item.count);
		const maxCount = Math.max(...counts);
		const minCount = Math.min(...counts);

		// Generate 11 color thresholds from min to max, distributed logarithmically for better granularity
		const rules: Array<{ count: number; color: string }> = [];
		
		if (maxCount === 0) {
			return [{ count: 0, color: "rgba(0,0,0,0.3)" }];
		}

		// Create thresholds with logarithmic distribution for better color spread
		for (let i = 10; i >= 0; i--) {
			const ratio = i / 10;
			// Use exponential distribution to give more weight to higher counts
			const threshold = Math.round(minCount + (maxCount - minCount) * Math.pow(ratio, 0.5));
			const opacity = 0.1 + (ratio * 0.9);
			rules.push({
				count: threshold,
				color: `rgba(16,185,129,${opacity.toFixed(1)})`
			});
		}

		return rules.sort((a, b) => b.count - a.count);
	}

	const dateType = {
		next7days: "next7days",
        next30days: "next30days", 
        // next12months: "next12months", 
        // next5years: "next5years"
    } as const;
    const dateTypeFullname: Record<keyof typeof dateType, string> = {
		[dateType.next7days]: "Next 7 days",
        [dateType.next30days]: "Next 30 days",
        // [dateType.next12months]: "Next 12 Months",
        // [dateType.next5years]: "Next 5 Years ",
    } as const;

    let currentDateType = $state<keyof typeof dateType>(dateType.next7days);
    let isLoading = $state<boolean>(true)
    let isFirst = $state(true);
	let duedistribution = $state<CardsDueDistribution>(defaultDueDistribution);
	let overduesCount = $derived<number>(duedistribution.overdues_count);

    let aheadDays = $state<number>(7);

    $effect(() => {
        isLoading = true;
        const tmpDeckId = deckId;
        const tmpAheadDays = aheadDays;
        const tmpCurrentDateType = currentDateType;
        
        untrack(() => {
            if(!isFirst) {
                fetchDueDistribution(deckId, userState.timezone, aheadDays)
                .then((data) => {
                    duedistribution = data;
                    colorRules = generateColorRules(duedistribution.dues);
                })
                .catch((err) => {
                    throw err;
                })
                .finally(() => {
                    isLoading = false;
                });
            }
			else {
				duedistribution = defaultDueDistribution;
				colorRules = generateColorRules(duedistribution.dues);
				isFirst = false;
                isLoading = false;
			}
        })
    });

	// FIXME: bad design, days and months actually dob't match you could offset 365 in 366 days-year and it will miss a day
	// this get worse with months (30, 31, 28, 29), missed a LOT of days
	// probably need to rethink entire thing, so I just stop looking more than 30 days
    function handleDateTypeChange(selectedDateType: keyof typeof dateType) 
    {
        let offset = 0;

        switch(selectedDateType) {
            case dateType.next30days:
                offset = 30;
                break;
            // case dateType.next12months:
            //     offset = 365;
            //     break;
            // case dateType.next5years:
            //     offset = 1830;
            //     break;
            default:
                offset = 7;
                break;
        }

		aheadDays = offset;
    }

	function cellColor(count: number): string {
		const result = colorRules.find(rule => (count >= rule.count));
    	return result ? result.color : "rgba(16,185,129,0.2)"
	}
</script>

<style>
	.today-label {
		margin-left: calc(100% / 6.6);
	}
</style>

<div>
	<h3 class="text-md font-semibold mb-4 text-center">Due Distribution</h3>
	<div class="flex justify-between items-end">
		<div class="today-label text-[0.65rem] text-yellow-500 font-bold">
			{#if !isLoading}
				TODAY
			{/if}
		</div>
		<div class="pb-2 self-center">
			{@render dropdown()}
		</div>
	</div>
	
	{#if !isLoading}
		<TooltipProvider>
			<div class="grid w-full gap-0.5" style="grid-template-columns: repeat(7, 1fr);">
				<Tooltip>
						<TooltipTrigger>
							<div
								class="bg-foreground aspect-square h-full rounded-sm hover:brightness-125 transition-[filter] duration-100 flex relative"
							>
								<div class="text-background font-semibold text-start text-sm ms-1 mt-0.5 leading-4">
									OVER<br>DUES
								</div>

								<div class="text-background absolute bottom-0 right-1 text-end text-lg">
									{#if overduesCount <= MAX_DUE_COUNT_IN_BOX}
										{overduesCount}
									{:else}
										{"> " + MAX_DUE_COUNT_IN_BOX}
									{/if}
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p class="font-semibold">Overdues</p>
							<p class="opacity-85">Count: {overduesCount}</p>
						</TooltipContent>
					</Tooltip>
				
				{#each duedistribution?.dues as item}
					<Tooltip>
						<TooltipTrigger>
							<div
								class="aspect-square h-full rounded-sm hover:brightness-125 transition-[filter] duration-100 flex relative"
								style:background-color={cellColor(item.count)}
							>
								<div class="text-start text-sm ms-1 mt-0.5 leading-4">
									{item.date.slice(0, 4)}<br/>
									{item.date.slice(5, 7)}<br/>
									{item.date.slice(8, 10)}
								</div>

								<div class="absolute bottom-0 right-1 text-end text-lg">
									{#if item.count <= MAX_DUE_COUNT_IN_BOX}
										{item.count}
									{:else}
										{"> " + MAX_DUE_COUNT_IN_BOX}
									{/if}
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p class="font-semibold">{item.date}</p>
							<p class="opacity-85">Count: {item.count}</p>
						</TooltipContent>
					</Tooltip>
				{/each}
			</div>
		</TooltipProvider>
		{:else}
			<div class="w-full text-center text-muted-foreground">
                Loading...
            </div>
		{/if}
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