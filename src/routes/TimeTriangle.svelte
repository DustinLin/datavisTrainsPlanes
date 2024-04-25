<script>
	import * as d3 from 'd3';
	import Axis from './Axis.svelte';
	import {planeTotalTime, trainTotalTime, carTotalTime, createDatapoints, cutoffs, 
			vertLine, triangleDashedLine, VIS_PROPERTIES} from '../utils'


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
		<Axis orientation="bottom" scale={smallXScale} width={width} height={height} margin={marginTriangle} label={"Distance (miles)"} />
		<Axis orientation="left" scale={smallYScale} width={width} height={height} margin={marginTriangle} label={"Time (minutes)"} />
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
