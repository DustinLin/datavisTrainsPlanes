
<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';

	export let dataset;
	export let feature;
	export let xLabel;
	export let color;
	export let roundValue;
	export let orientation;
	export let includeTotal;
	export let unitConversion = 1;
	export let firstX = -1;
	export let stringFormatter;
	export let minDimSize;
	export let sort;

	// export let selectedIndices;
	//export let color;

	let sortedFeature = dataset;
	
	if (sort) {
		sortedFeature = dataset
                .sort(([cities1, data1], [cities2, data2]) => {
				if (feature === "time") {
					console.log('testing', data1, feature);
				}
				
                const score1 = data1[feature]
                const score2 = data2[feature]
                return d3.descending(score1, score2)
                })
	}

	

	if (firstX !== -1) {
		sortedFeature = sortedFeature.slice(0, firstX)
	}

        
	//sortedFeature = 0;
	const unitCovertFunction = (info) => {
		const newInfo = {...info}
		newInfo[feature] = newInfo[feature]/unitConversion
		newInfo['color'] = newInfo['color'] ? newInfo['color'] :  color
		return newInfo
	}

	sortedFeature = sortedFeature.map(([pair, info]) => [pair, unitCovertFunction(info)])

	stringFormatter = stringFormatter ? stringFormatter : (d) => d
	sortedFeature = sortedFeature.map(([pair, info]) => [stringFormatter(pair), info]) 
        
	

    console.log("sorted feature", sortedFeature);
	//console.log("sorted feature", formattedFeature);
	// dimensions

	let borderBoxSize;

	$: width = borderBoxSize
		? Math.max(borderBoxSize[0].inlineSize, minDimSize[0])
		: minDimSize[0];

	$: height = borderBoxSize
		? Math.max(borderBoxSize[0].blockSize, minDimSize[1])
		: minDimSize[1];

	$: console.log('sizes', borderBoxSize)


	// get the counts for the filtered dataset
        /*
	$: counts = d3.rollup(
		sortedGravity,
		(g) => g.length,
		(d) => d[feature]
	);
        */

	// scales

	const maxVal = d3.max(sortedFeature, (d) => d[1][feature]);
	console.log("max val", maxVal);

	const margin = {top: 45, bottom: 45, left: 270, right: 80};



        //if (orientation == "horizontal"){}

	$: x = d3
		.scaleLinear()
		.domain([0, maxVal])
		//.nice()
		.range([margin.left, width - margin.right]);

	$: y = d3
		.scaleBand()
		.domain(sortedFeature.map(([pair, info]) => pair))
		.range([margin.top, height - margin.bottom])
		.padding(0.1);


        
</script>

<div class="BarChart" bind:borderBoxSize>
	<svg {height} {width}>
		<!-- bars -->
		<g>
			{#each sortedFeature as [cityPair, info] (cityPair)}
				<rect
					x={x(0)}
					y={y(cityPair)}
					height={y.bandwidth()}
					width={x(info[feature]) - x(0)}
					fill={info['color']}
				/>
                                <text
                                        class="bar-label"
                                        font-family="sans-serif"
                                        font-size="12px"
                                        x={x(info[feature]) + 5}
                                        y={y(cityPair) + y.bandwidth() / 2 + 5}
                                        text-anchor="start"
                                        >
                                        {Math.round(info[feature] * roundValue) / roundValue}
                                </text>
			{/each}
		</g>

		<!-- axes -->
		<Axis orientation="bottom" scale={x} {width} {height} {margin} label={xLabel} />
		<Axis orientation="left" scale={y} {width} {height} {margin} />
	</svg>
</div>

<style>
	.BarChart {
		/* take up extra horizontal space in the parent */
		flex: 1;
	}

	/* animate changes to the lengths of the bars */
	rect {
		transition: width 250ms;
	}
</style>
