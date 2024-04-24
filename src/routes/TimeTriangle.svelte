<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';
	import {planeTotalTime, trainTotalTime, carTotalTime, createDatapoints, cutoffs, vertLine, triangleDashedLine, VIS_PROPERTIES} from '../utils'

	

	const triangleLower = cutoffs.triangleLower // ~ 75.2
	const triangleUpper = cutoffs.triangleUpper // ~575.5



	const marginTriangle = { top: 50, right: 50, bottom: 50, left: 50 };

	let borderBoxSize;
	const ratio = 1.25
	const baseSize = 500

	$: width = borderBoxSize
		? Math.max(Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize), baseSize) * ratio
		: baseSize * ratio; 

	$: height = borderBoxSize
		? Math.max(Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize), baseSize)
		: baseSize;

	$: STROKE_WIDTH = width / 200;

	const MAX_DISTANCE = 2724
	const functions = [planeTotalTime, trainTotalTime, carTotalTime];

	$: smallXScale = d3.scaleLinear()
		.domain([0, 600])
		.range([marginTriangle.left, width - marginTriangle.right]);

	$: smallYScale = d3.scaleLinear()
		.domain([0, 350])
		.range([height - marginTriangle.bottom, marginTriangle.top]);

	const transportTypeColorScale = d3.scaleOrdinal()
		.domain(functions)
		//.range(d3.schemeCategory10)
		.range([VIS_PROPERTIES.PLANE_COLOR, VIS_PROPERTIES.TRAIN_COLOR, VIS_PROPERTIES.CAR_COLOR])

//   // add x axis to chart
//  // const xAxes = triangleSvg.append('g')
//     // move it to the bottom
//     //.attr('transform', d => `translate(0,${gridRow.bandwidth()})`)
//   //  .call(xAxis)
//     // remove the baseline
//   //  .call(g => g.select('.domain').remove())
//     // change the tick color to gray
//   //  .call(g => g.selectAll('line').attr('stroke', '#c0c0c0'));

//     triangleSvg.append('g')
//       // move x-axis to the bottom 
//       .attr('transform', d => `translate(0,${heightTriangle})`)
//       .call(xAxis)
      
//       .append('text')
//         .attr('fill', 'black')
//         .attr('font-family', 'sans-serif')
//         .attr('x', 270)
//         .attr('y', 40)
//         .text("Distance (miles)");


//     triangleSvg.append('g')
//       .attr('transform', d => `translate(${marginTriangle.left}, 0)`)
//       .call(yAxis)
//       .append('text')
//         .attr('fill', 'black')
//         .attr('font-family', 'sans-serif')
//         .attr("transform", "rotate(-90)")
//         .attr('x', -heightTriangle/2)
//         .attr('y', -30)
//         .text("Time");


	///////////// OLD CODE
	// dimensions



	// const margin = { top: 25, right: 20, bottom: 50, left: 60 };


	// scales

	// $: maxCount = d3.max(counts.values());

	// $: x = d3
	// 	.scaleLinear()
	// 	.domain([0, maxCount])
	// 	.nice()
	// 	.range([margin.left, width - margin.right]);

	// $: y = d3
	// 	.scaleBand()
	// 	.domain(color.domain())
	// 	.range([margin.top, height - margin.bottom])
	// 	.padding(0.1);
</script>

<div class="timeTriangle" bind:borderBoxSize={borderBoxSize}>
	<svg height={height} width={width}>
		<!-- bars -->
		<g>
			{#each functions as theFunction}
				<path
					d={d3.line()(createDatapoints(theFunction, MAX_DISTANCE, smallXScale, smallYScale))}
					stroke={transportTypeColorScale(theFunction)}
					stroke-width={STROKE_WIDTH}
				/>
			{/each}
				<path
					d={d3.line()(vertLine(triangleLower, MAX_DISTANCE, smallXScale, smallYScale))}
					stroke={VIS_PROPERTIES.ROUTE_STROKE_COL}
					stroke-width={STROKE_WIDTH}
				/>
				<path
					d={d3.line()(vertLine( triangleUpper, MAX_DISTANCE, smallXScale, smallYScale))}
					stroke={VIS_PROPERTIES.ROUTE_STROKE_COL}
					stroke-width={STROKE_WIDTH}
				/>
				<path
					d={d3.line()(triangleDashedLine(triangleLower, MAX_DISTANCE, smallXScale, smallYScale))}
					stroke={VIS_PROPERTIES.ROUTE_STROKE_COL}
					stroke-width={STROKE_WIDTH}
					stroke-dasharray={("3,3")}
				/>
				<path
					d={d3.line()(triangleDashedLine(triangleUpper, MAX_DISTANCE, smallXScale, smallYScale))}
					stroke={VIS_PROPERTIES.ROUTE_STROKE_COL}
					stroke-width={STROKE_WIDTH}
					stroke-dasharray={("3,3")}
				/>
		</g>

		<!-- axes -->
		<Axis orientation="bottom" scale={smallXScale} width={width} height={height} margin={marginTriangle} label={"Time (minutes)"} />
		<Axis orientation="left" scale={smallYScale} width={width} height={height} margin={marginTriangle} label={"Distance (miles)"} />
	</svg>
</div>

<style>
	.timeTriangle {
		/* be as tall as the parent div */
		height: 100%;
		background-color: #ffffff;
		/* rounded corners and padding to make more roomy */
		border-radius: 2em;

		width: 100%;
	}

	/* animate changes to the lengths of the bars
	rect {
		transition: width 250ms;
	} */
</style>
