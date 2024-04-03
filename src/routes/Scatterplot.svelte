<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';

	export let dataset;
	export let xFeature;
	export let yFeature;
	export let colorFeature;
	export let color;
	export let highlightedPlayer;
	export let onbrush;

	// dimensions

	let borderBoxSize;

	$: width = borderBoxSize
		? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize)
		: 400;

	$: height = borderBoxSize
		? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize)
		: 400;

	$: console.log(borderBoxSize, width, height);

	const margin = { top: 35, right: 20, bottom: 50, left: 60 };

	// scales

	$: x = d3
		.scaleLinear()
		.domain(d3.extent(dataset, (d) => d[xFeature]))
		.nice()
		.range([margin.left, width - margin.right]);

	$: y = d3
		.scaleLinear()
		.domain(d3.extent(dataset, (d) => d[yFeature]))
		.nice()
		.range([height - margin.bottom, margin.top]);

	// brushing
	// https://observablehq.com/@d3/brushable-scatterplot

	let svg;

	function brushed(event) {
		if (event.selection) {
			const [[x1, y1], [x2, y2]] = event.selection;
			const indices = dataset
				// get the original indices of the data points
				.map((d, i) => [d, i])
				// filter to get the points in the brush
				.filter(([d, i]) => {
					const dx = x(d[xFeature]);
					const dy = y(d[yFeature]);
					return dx >= x1 && dx <= x2 && dy >= y1 && dy <= y2;
				})
				// get the indices
				.map(([d, i]) => i);
			onbrush(indices);
		} else {
			onbrush(d3.range(dataset.length));
		}
	}

	$: brush = d3
		.brush()
		.extent([
			[margin.left, margin.top],
			[width - margin.right, height - margin.bottom]
		])
		.on('start brush end', brushed);

	// reset the brush when the visualization changes
	$: xFeature, yFeature, d3.select(svg).call(brush).call(brush.clear);
</script>

<div class="scatterplot" bind:borderBoxSize>
	<svg {height} {width} bind:this={svg}>
		<!-- circles -->
		<g>
			{#each dataset as d}
				<circle cx={x(d[xFeature])} cy={y(d[yFeature])} fill={color(d[colorFeature])} r={3} />
			{/each}

			<!-- redraw circle for the highlighted player so that it appears on top -->
			{#if highlightedPlayer}
				<circle
					cx={x(highlightedPlayer[xFeature])}
					cy={y(highlightedPlayer[yFeature])}
					fill={color(highlightedPlayer[colorFeature])}
					r={6}
					stroke={'black'}
					stroke-width={2}
				/>
			{/if}
		</g>

		<!-- axes -->
		<Axis orientation="bottom" scale={x} {width} {height} {margin} label={xFeature} />
		<Axis orientation="left" scale={y} {width} {height} {margin} label={yFeature} />
	</svg>
</div>

<style>
	.scatterplot {
		/* take up extra horizontal space in the parent */
		flex: 1;
		/* be as tall as the parent div */
		height: 100%;
	}

	/* animate circles to their new location */
	circle {
		transition:
			cx 250ms,
			cy 250ms;
	}
</style>
