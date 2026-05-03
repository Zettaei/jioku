<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    import type { DeckStatus } from "$lib/types/server/modules/deck/type/deck_dto";
    import Card from "$lib/components/ui/card/card.svelte";
    import RetentionRateChart from "./RetentionRateChart.svelte";
    import DueDistributionChart from "./DueDistributionChart.svelte";
    import Tooltip from "$lib/components/ui/tooltip/tooltip.svelte";
    import TooltipProvider from "$lib/components/ui/tooltip/tooltip-provider.svelte";
    import { cardMaturity } from "$lib/constant/cardMaturity";
    import TooltipTrigger from "$lib/components/ui/tooltip/tooltip-trigger.svelte";
    import TooltipContent from "$lib/components/ui/tooltip/tooltip-content.svelte";
    import { cardStatus } from "$lib/constant/cardStatus";
    import { userStore } from "$lib/stores/auth";
    import BackButton from "$lib/components/BackButton.svelte";
    import { SESSIONSTORAGE_PREV_DECK_LIST } from "$lib/constant/sessionStorageKey.js";

    Chart.register(...registerables)

    interface Props {
        deckId: string;
        deckName: string;
        deckStatus: DeckStatus;
    }

    let { deckId, deckName, deckStatus }: Props = $props();

    let backButtonRef: { click: () => void } | undefined = $state();
    let statusChartCanvas: HTMLCanvasElement;
    let maturityChartCanvas: HTMLCanvasElement;

    let statusChart: Chart;
    let maturityChart: Chart;

    onMount(() => {
        // Card Status Distribution (Pie)
        statusChart = new Chart(statusChartCanvas, {
            type: "pie",
            data: {
                labels: ["Due", "New", "Retry"],
                datasets: [
                    {
                        data: [
                            deckStatus.cards_status_distribution.due,
                            deckStatus.cards_status_distribution.new,
                            deckStatus.cards_status_distribution.retry,
                        ],
                        backgroundColor: ["#ef4444", "#3b82f6", "#f59e0b"],
                        borderColor: ["#dc2626", "#1d4ed8", "#d97706"],
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                },
            },
        });

        // Card Maturity Distribution (Pie)
        maturityChart = new Chart(maturityChartCanvas, {
            type: "doughnut",
            data: {
                labels: ["Unseen", "Learning", "Young", "Mature", "Master"],
                datasets: [
                    {
                        data: [
                            deckStatus.cards_maturity_distribution.unseen,
                            deckStatus.cards_maturity_distribution.learning,
                            deckStatus.cards_maturity_distribution.young,
                            deckStatus.cards_maturity_distribution.mature,
                            deckStatus.cards_maturity_distribution.master,
                        ],
                        backgroundColor: [
                            "#9ca3af",
                            "#fbbf24",
                            "#60a5fa",
                            "#34d399",
                            "#10b981",
                        ],
                        borderColor: [
                            "#6b7280",
                            "#f59e0b",
                            "#3b82f6",
                            "#10b981",
                            "#059669",
                        ],
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                },
            },
        });

        return () => {
            statusChart.destroy();
            maturityChart.destroy();
        };
    });
</script>

<div class="w-full flex justify-center">
    <Card>
        <div class="px-6 py-4 space-y-12">

            <!-- Deck Header with BackButton -->
            <div class="pb-4 border-b">
                <div class="flex items-start">
                    <div class="flex flex-1 justify-start">
                        <BackButton bind:this={backButtonRef} 
                            destination="/deck" sessionStorageKey={SESSIONSTORAGE_PREV_DECK_LIST}
                        />
                    </div>
                    <div class="flex flex-1 justify-center flex-col items-center text-center">
                        <div class="font-bold avantgarde">DECK STATISTICS</div>
                        <div class="">{deckName}</div>
                    </div>
                    <div class="flex flex-1 justify-end">
                        <div></div>
                    </div>
                </div>
                <div class="text-base gap-4 mt-6 flex w-full justify-end">
                    <div><span class="font-bold">Date:</span> {deckStatus?.date}</div>
                    <div><span class="font-bold">Timezone:</span> {$userStore?.timezone ?? "Asia/Bangkok"}</div>
                </div>
            </div>


            <!-- Card Status Distribution -->
            <div>
                <h3 class="text-lg font-semibold mb-4 text-center">Card Status Distribution</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex w-full justify-center">
                        <canvas bind:this={statusChartCanvas} class="max-h-48"></canvas>
                    </div>
                    <div class="border-l pl-4">
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span>Total:</span>
                                <span class="font-semibold">{deckStatus.cards_total}</span>
                            </div>
                            {#each Object.values(cardStatus) as item}
                                {@const name = item[0].toUpperCase() + item.substring(1,)}
                                <div class="flex justify-between">
                                    <span>{name}:</span>
                                    <span class="font-semibold">{deckStatus.cards_status_distribution[item]}</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>


            <!-- Card Maturity Distribution -->
            <div>
                <h3 class="text-md font-semibold mb-4 text-center">Card Maturity Distribution</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex w-full justify-center">
                        <canvas bind:this={maturityChartCanvas} class="max-h-48"></canvas>
                    </div>
                    <div class="border-l pl-4">
                        <TooltipProvider>
                            <div class="space-y-2">
                                {#each Object.keys(cardMaturity) as item}
                                {@const name = item[0].toUpperCase() + item.substring(1,)}
                                {@const key = item as keyof typeof cardMaturity}
                                {@const count = deckStatus.cards_maturity_distribution[key]}
                                    <Tooltip>
                                        <TooltipTrigger class="w-full">
                                            <div class="flex justify-between w-full">
                                                <span>{name}: </span>
                                                <span class="font-semibold">{count}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div class="font-semibold">{name}</div>
                                            <div>
                                            {#if cardMaturity[key].status === 0 }
                                                status: {cardStatus[cardMaturity[key].status]}
                                            {:else}
                                                interval: {cardMaturity[key].minInterval} days - {cardMaturity[key].maxInterval} days
                                            {/if}
                                            <div>count: {count} cards</div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                {/each}
                            </div>
                        </TooltipProvider>
                    </div>
                </div>
            </div>


            <DueDistributionChart deckId={deckId} defaultDueDistribution={deckStatus.cards_due_distribution} />

            <RetentionRateChart deckId={deckId} defaultRetentionRate={deckStatus.review_retention_rate}/>
        </div>
    </Card>
</div>

