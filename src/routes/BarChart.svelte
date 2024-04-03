<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';

	export let dataset;
	export let feature;
	export let selectedIndices;
	export let color;

	// dimensions

	let borderBoxSize;

	$: width = borderBoxSize
		? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize)
		: 400;

	$: height = borderBoxSize
		? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize)
		: 400;

	const margin = { top: 25, right: 20, bottom: 50, left: 60 };

	// filter the dataset by index
	$: filteredDataset = selectedIndices.map((i) => dataset[i]);

	// get the counts for the filtered dataset
	$: counts = d3.rollup(
		filteredDataset,
		(g) => g.length,
		(d) => d[feature]
	);

	// scales

	$: maxCount = d3.max(counts.values());

	$: x = d3
		.scaleLinear()
		.domain([0, maxCount])
		.nice()
		.range([margin.left, width - margin.right]);

	$: y = d3
		.scaleBand()
		.domain(color.domain())
		.range([margin.top, height - margin.bottom])
		.padding(0.1);
</script>

<div class="barchart" bind:borderBoxSize>
	<svg {height} {width}>
		<!-- bars -->
		<g>
			{#each counts as [category, count] (category)}
				<rect
					x={x(0)}
					y={y(category)}
					height={y.bandwidth()}
					width={x(count) - x(0)}
					fill={color(category)}
				/>
			{/each}
		</g>

		<!-- axes -->
		<Axis orientation="bottom" scale={x} {width} {height} {margin} label={'Count'} />
		<Axis orientation="left" scale={y} {width} {height} {margin} />
	</svg>
</div>

<style>
	.barchart {
		/* take up extra horizontal space in the parent */
		flex: 1;
		/* be as tall as the parent div */
		height: 100%;
	}

	/* animate changes to the lengths of the bars */
	rect {
		transition: width 250ms;
	}
</style>
