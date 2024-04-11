<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';

	export let dataset;
	//export let feature;
	// export let selectedIndices;
	//export let color;

        const sortedGravity = dataset
                .sort(([cities1, data1], [cities2, data2]) => {
                const score1 = data1.GRAVITY
                const score2 = data2.GRAVITY
                return d3.descending(score1, score2)
                }).map(([pair, info]) => [pair, info.GRAVITY]).slice(0,10)

        

	// dimensions

	let borderBoxSize;

        /*
	$: width = borderBoxSize
		? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize)
		: 400;

	$: height = borderBoxSize
		? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize)
		: 400;
        */

        const width = 1000;
        const height = 750;

	//const margin = { top: 25, right: 20, bottom: 50, left: 60 };
        const margin = {top: 45, bottom: 45, left: 150, right: 80};

	// filter the dataset by index
	// $: filteredDataset = selectedIndices.map((i) => sortedGravity[i]);

        
	// get the counts for the filtered dataset
        /*
	$: counts = d3.rollup(
		sortedGravity,
		(g) => g.length,
		(d) => d[feature]
	);
        */

	// scales

	const maxVal = sortedGravity[0][1].GRAVITY

	const x = d3
		.scaleLinear()
		.domain([0, 75])
		//.nice()
		.range([margin.left, width - margin.right]);

	const y = d3
		.scaleBand()
		.domain(sortedGravity.slice(0,10).map(([pair, info]) => pair))
		.range([margin.top, height - margin.bottom])
		.padding(0.1);

        console.log("x range: ", x.range());
        console.log("y range: ", y.range());
        console.log("x domain: ", x.domain());
        console.log("y domain: ", y.domain());
</script>

<div class="barchart" bind:borderBoxSize>
	<svg {height} {width}>
		<!-- bars -->
		<g>
			{#each sortedGravity as [cityPair, gravity] (cityPair)}
				<rect
					x={x(0)}
					y={y(cityPair)}
					height={y.bandwidth()}
					width={x(gravity) - x(0)}
					fill={"#cfe6ce"}
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
