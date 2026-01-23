<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    import type { DeckStatus } from "$lib/types/server/modules/deck/type/deck_dto";
    import Card from "$lib/components/ui/card/card.svelte";

    Chart.register(...registerables);

    interface Props {
        deckStatus: DeckStatus
    }

    let { deckStatus }: Props = $props();

    let statusChartCanvas: HTMLCanvasElement;
    let maturityChartCanvas: HTMLCanvasElement;
    let dueChartCanvas: HTMLCanvasElement;
    let retentionChartCanvas: HTMLCanvasElement;

    let statusChart: Chart;
    let maturityChart: Chart;
    let dueChart: Chart;
    let retentionChart: Chart;

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
                    title: {
                        display: true,
                        text: "Card Status Distribution",
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
                    title: {
                        display: true,
                        text: "Card Maturity Distribution",
                    },
                },
            },
        });

        // Cards Due Over Time (Bar)
        dueChart = new Chart(dueChartCanvas, {
            type: "bar",
            data: {
                labels: deckStatus.cards_due_distribution.map((item) => item.due),
                datasets: [
                    {
                        label: "Cards Due",
                        data: deckStatus.cards_due_distribution.map((item) => item.count),
                        backgroundColor: "#6366f1",
                        borderColor: "#4f46e5",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: "x",
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "Cards Due Distribution",
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // Review Retention Rate (Bar)
        const totalReviews =
            deckStatus.review_retention_rate.passed +
            deckStatus.review_retention_rate.failed;
        const retentionRate =
            totalReviews > 0
                ? ((deckStatus.review_retention_rate.passed / totalReviews) * 100).toFixed(1)
                : 0;

        retentionChart = new Chart(retentionChartCanvas, {
            type: "bar",
            data: {
                labels: ["Passed", "Failed"],
                datasets: [
                    {
                        label: "Review Results",
                        data: [
                            deckStatus.review_retention_rate.passed,
                            deckStatus.review_retention_rate.failed,
                        ],
                        backgroundColor: ["#10b981", "#ef4444"],
                        borderColor: ["#059669", "#dc2626"],
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                indexAxis: "x",
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: `Review Retention Rate: ${retentionRate}%`,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        return () => {
            statusChart.destroy();
            maturityChart.destroy();
            dueChart.destroy();
            retentionChart.destroy();
        };
    });
</script>

<div class="flex justify-center gap-0">
    <Card class="max-w-xl w-full">
        <div class="p-6 space-y-6">


            <!-- Card Status Distribution -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <canvas bind:this={statusChartCanvas} class="max-h-48"></canvas>
                </div>
                <div class="border-l pl-4">
                    <h3 class="text-sm font-semibold mb-3">Stats</h3>
                    <div class="space-y-2 text-xs">
                        <div class="flex justify-between">
                            <span>Total:</span>
                            <span class="font-semibold">{deckStatus.cards_total}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Due:</span>
                            <span class="font-semibold text-blue-600">{deckStatus.cards_status_distribution.due}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>New:</span>
                            <span class="font-semibold text-yellow-600">{deckStatus.cards_status_distribution.new}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Retry:</span>
                            <span class="font-semibold text-orange-600">{deckStatus.cards_status_distribution.retry}</span>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Card Maturity Distribution -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <canvas bind:this={maturityChartCanvas} class="max-h-48"></canvas>
                </div>
                <div class="border-l pl-4">
                    <h3 class="text-sm font-semibold mb-3">Maturity</h3>
                    <div class="space-y-2 text-xs">
                        <div class="flex justify-between">
                            <span>Unseen:</span>
                            <span class="font-semibold">{deckStatus.cards_maturity_distribution.unseen}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Learning:</span>
                            <span class="font-semibold">{deckStatus.cards_maturity_distribution.learning}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Young:</span>
                            <span class="font-semibold">{deckStatus.cards_maturity_distribution.young}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Mature:</span>
                            <span class="font-semibold">{deckStatus.cards_maturity_distribution.mature}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Master:</span>
                            <span class="font-semibold">{deckStatus.cards_maturity_distribution.master}</span>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Cards Due Distribution -->
            <div>
                <canvas bind:this={dueChartCanvas} class="w-full"></canvas>
            </div>


            <!-- Review Retention Rate -->
            <div>
                <canvas bind:this={retentionChartCanvas} class="w-full"></canvas>
            </div>
        </div>
    </Card>
</div>
