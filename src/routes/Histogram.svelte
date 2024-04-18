<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';
    import {inTriangle, planeTimeToTotalTime} from '../utils.js';

	export let dataset;
        export let xLabel;
        export let color;
        export let triangleColor;
	// export let selectedIndices;
	//export let color;
	
	const timeUnitConversion = 1


        let cityPairToTime = dataset
                             .map(([pair, info]) => 
                                [pair, 
                                {AVG_TOTAL_TIME: planeTimeToTotalTime(info.RAMP_TO_RAMP/info.DEPARTURES_PERFORMED) / timeUnitConversion, 
                                AVG_AIR_TIME: info.AIR_TIME / info.DEPARTURES_PERFORMED / timeUnitConversion, 
                                NUM_DEPARTURES: info.DEPARTURES_PERFORMED}]);

        
        let bins = d3.bin()
                .thresholds(20)
                .value((d) => d[1].AVG_TOTAL_TIME)
                (cityPairToTime);

        // bins = d3.map(bins, (d) => 
        //         [d.length, d3.sum(d, (l) => l[1].NUM_DEPARTURES), d.x0, d.x1])

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
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([margin.left, width - margin.right]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
      .domain([0, d3.max(bins, (d) => d3.sum(d, (l) => l[1].NUM_DEPARTURES))])
      .range([height - margin.bottom, margin.top]);

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
					x={x(bin.x0) + 1}
					y={y(d3.sum(bin, (d) => d[1].NUM_DEPARTURES))}
					height={y(0) - y(d3.sum(bin, (d) => d[1].NUM_DEPARTURES))}
					width={x(bin.x1) - x(bin.x0) - 1}
					fill={inTriangle(bin.x0 * timeUnitConversion) ? triangleColor : color}

				/>

			{/each}
		</g>

		<!-- axes -->
		<Axis orientation="bottom" scale={x} {width} {height} {margin} label={xLabel} />
		<Axis orientation="left" scale={y} {width} {height} {margin} />
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