<script lang="ts">
	import { onMount } from "svelte";
	import { Chart } from "chart.js";
	import type { DeckStatus } from "$lib/types/server/modules/deck/type/deck_dto";

	interface Props {
		cardsDueDistribution: DeckStatus["cards_due_distribution"];
	}

	let { cardsDueDistribution }: Props = $props();

	let dueChartCanvas: HTMLCanvasElement;
	let dueChart: Chart;

	onMount(() => {
		// Cards Due Over Time (Bar)
		dueChart = new Chart(dueChartCanvas, {
			type: "bar",
			data: {
				labels: cardsDueDistribution.map((item) => item.date),
				datasets: [
					{
						label: "Cards Due",
						data: cardsDueDistribution.map((item) => item.count),
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

		return () => {
			dueChart.destroy();
		};
	});
</script>

<div>
	<canvas bind:this={dueChartCanvas} class="w-full"></canvas>
</div>
