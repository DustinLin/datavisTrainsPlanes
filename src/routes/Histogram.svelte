<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';
    import {inTriangle, planeTimeToTotalTime, roundDown} from '../utils.js';

	export let dataset;
	export let xLabel;
	export let color;
	export let triangleColor;
	export let providedAccessorFunction;
	export let timeUnitConversion;
	export let thresholds;
	export let maxBinSize;
	// export let selectedIndices;
	//export let color;
	function defaultAccessor(rowData, timeUnitConversion) {
		return rowData.AVG_TOTAL_TIME;
	}

	
	

	const accessorFunction = providedAccessorFunction ? providedAccessorFunction: defaultAccessor

	/*
        let cityPairToTime = dataset
                             .map(([pair, info]) => 
                                [pair, 
                                {AVG_TOTAL_TIME: planeTimeToTotalTime(info.RAMP_TO_RAMP/info.DEPARTURES_PERFORMED) / timeUnitConversion, 
                                AVG_AIR_TIME: info.AIR_TIME / info.DEPARTURES_PERFORMED / timeUnitConversion, 
                                NUM_DEPARTURES: info.DEPARTURES_PERFORMED}]);

        
	*/
	
	let cityPairToTime = dataset;

	let bins = d3.bin()
			.thresholds(thresholds)
			.value((d) => accessorFunction(d[1], timeUnitConversion))
			(cityPairToTime);
        // bins = d3.map(bins, (d) => 
        //         [d.length, d3.sum(d, (l) => l[1].NUM_DEPARTURES), d.x0, d.x1])

	bins.forEach((element) => console.log('test of the stupid variety', element.x0, element.x1));

        // console.log("bins", bins);
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

        const width = 960;
        const height = 500;

	//const margin = { top: 25, right: 20, bottom: 50, left: 60 };
        //const margin = {top: 45, bottom: 45, left: 150, right: 80};

	// filter the dataset by index
	// $: filteredDataset = selectedIndices.map((i) => sortedGravity[i]);

        
	// get the counts for the filtered dataset


    const margin = {top: 20, bottom: 30, left: 80, right: 20};

        
    
	// scales 
	// Declare the x (horizontal position) scale.
	const x = d3.scaleLinear()
	.domain([thresholds[0], thresholds[thresholds.length - 1]])
	.range([margin.left, width - margin.right]);

  	// Declare the y (vertical position) scale.
  	const y = d3.scaleLinear()
      .domain([0, maxBinSize])
      .range([height - margin.bottom, margin.top]);

	const thresholdWidth = thresholds[1] - thresholds[0]
	const boxWidth = x(thresholds[1]) - x(thresholds[0]) - 1

	  /*
        console.log("x range: ", x.range());
        console.log("y range: ", y.range());
        console.log("x domain: ", x.domain());
        console.log("y domain: ", y.domain());
		*/

        
</script>

<div class="histogram" bind:borderBoxSize>
	<svg {height} {width}>
		<!-- bars -->
		<g>
			{#each bins as bin}
				<rect
					x={x(roundDown(bin.x0, thresholdWidth)) + 1}
					y={y(d3.sum(bin, (d) => d[1].NUM_DEPARTURES))}
					height={y(0) - y(d3.sum(bin, (d) => d[1].NUM_DEPARTURES))}
					width={boxWidth}
					fill={inTriangle(bin.x0 * timeUnitConversion) ? triangleColor : color}

				/>

			{/each}
		</g>

		<!-- axes -->
		<Axis orientation="bottom" scale={x} {width} {height} {margin} label="test" />
		<Axis orientation="left" scale={y} {width} {height} {margin} label="ex"/>
	</svg>
</div>

<style>
	.histogram {
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