<script>
	/**
	 * map component for rail, should be p similar
	 * Perhaps want to get rid of duplicate code, but low priority and this is not a SWE class
	*/

	import * as d3 from 'd3';

	export let map; // the USA map
	export let railMap; // amtrak map
	export let cordMap;  // mapping from US cities for coordinates



	// projections
	const usaMapProjection = d3.geoAlbersUsa().fitSize([975, 610], map);

	const mapPath = d3.geoPath().projection(usaMapProjection);

	// hard code some cities to place?
	const citiesPlotSet  = [
		"Boston_MA",
		"New York_NY",
		"Philadelphia_PA",
		"Washington_DC",
		"Seattle_WA",
		"Los Angeles_CA",
		"San Francisco_CA",
		"Denver_CO",
		"Phoenix_AZ",
		"Atlanta_GA",
		"Chicago_IL",
		"Oklahoma City_OK",
		"Dallas_TX",
		"Houston_TX",
		"Miami_FL"
	]

	// TODO try to make display reactive
	let borderBoxSize;
	// borderBoxSize: has 2 entires: inline-size - width of div, block-size - height of div
	// borderBoxSize could be undefined
	let width = 975
	let height = 610
	//$: width = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 975
	//$: height = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 610

</script>

<div class="maps">
	<svg width={width} height={height}>
		<!-- drawing paths for each state, using projections -->
		{#each map.features as state}
			<path
				fill = "none"
				stroke = "#d3d3d3"
				d={mapPath(state)}
			/>

		{/each}

		<!-- drawing maps for rail routes using same projection -->
		{#each railMap.features as route}
			<path
				fill = "none"
				stroke = "blue"
				d={mapPath(route)}
			/>

		{/each}

		<!-- toggle between "cities" and "citiesPlot"-->
		<!-- for "cities", look at "city.geometry.coordinates", and "city.properties.NAME" -->
		{#each citiesPlotSet as city}
		<circle
			cx = {usaMapProjection(cordMap[city].COORD)[0]}
			cy = {usaMapProjection(cordMap[city].COORD)[1]}
			fill = "red"
			r = {5}
		/>
		<text
			font-size = 10
			font-family = "sans-serif"
			dominant-baseline = "hanging"
			x = {usaMapProjection(cordMap[city].COORD)[0] + 4}
			y = {usaMapProjection(cordMap[city].COORD)[1] + 4}
		>
			{city.split("_")[0]}
		</text>
		{/each}

	</svg>

</div>

<style>
	.maps {
		border-style: solid;
		/* the weight? */
		flex:2;
	}
</style>
