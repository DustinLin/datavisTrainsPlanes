
<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';

	export let dataset;
	export let feature;
        export let xLabel;
        export let color;
        export let roundValue;
	export let orientation;
	// export let selectedIndices;
	//export let color;

	let sortedFeature = dataset;

        
        
        if (feature == "PASSENGERS") {
		sortedFeature = dataset
                .sort(([cities1, data1], [cities2, data2]) => {
                const score1 = data1[feature]
                const score2 = data2[feature]
                return d3.descending(score1, score2)
                }).map(([pair, info]) => [pair, info[feature]]).slice(0,10)

        
                //sortedFeature = 0;

                sortedFeature = sortedFeature.map(([pair, info]) => [pair, info/1000000])

		sortedFeature = sortedFeature.map(([pair, info]) => [convertString(pair), info]) 
		        
        }
 
	
	function convertString(input) {
		const pairs = input.slice(1, -1).split(', ');

		const formattedPairs = pairs.map(pair => {
			const [city, state] = pair.split('_');
			return `${city}, ${state}`;
		});

		return formattedPairs.join('\n to \n');
	}
	

        console.log("sorted feature", sortedFeature);
	//console.log("sorted feature", formattedFeature);
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
        //const margin = {top: 45, bottom: 45, left: 150, right: 80};

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

	const maxVal = sortedFeature[0][1];
        console.log("max val", maxVal);

        const margin = {top: 45, bottom: 45, left: 270, right: 80};



        //if (orientation == "horizontal"){}

	const x = d3
		.scaleLinear()
		.domain([0, maxVal])
		//.nice()
		.range([margin.left, width - margin.right]);

	const y = d3
		.scaleBand()
		.domain(sortedFeature.slice(0,10).map(([pair, info]) => pair))
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
			{#each sortedFeature as [cityPair, feature] (cityPair)}
				<rect
					x={x(0)}
					y={y(cityPair)}
					height={y.bandwidth()}
					width={x(feature) - x(0)}
					fill={color}
				/>
                                <text
                                        class="bar-label"
                                        font-family="sans-serif"
                                        font-size="12px"
                                        x={x(feature) + 5}
                                        y={y(cityPair) + y.bandwidth() / 2 + 5}
                                        text-anchor="start"
                                        >
                                        {Math.round(feature * roundValue) / roundValue}
                                </text>
			{/each}
		</g>

		<!-- axes -->
		<Axis orientation="bottom" scale={x} {width} {height} {margin} label={xLabel} />
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
