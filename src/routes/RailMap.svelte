<script>
	/**
	 * map component for rail, should be p similar
	 * Perhaps want to get rid of duplicate code, but low priority and this is not a SWE class
	*/

	import * as d3 from 'd3';

	export let map; // the USA map
	export let railMap; // amtrak map
	export let cityCordMap;  // mapping from US cities for coordinates

	export let citiesPlotSet; // which cities to plot

	// [width, height]
	export let dims;

	// TODO try to make display reactive
	let borderBoxSize;
	// borderBoxSize: has 2 entires: inline-size - width of div, block-size - height of div
	// borderBoxSize could be undefined
	$: width = borderBoxSize
		? d3.max([borderBoxSize[0].inlineSize, dims[0]])
		: dims[0];

	$: height = borderBoxSize
		? d3.max([borderBoxSize[0].blockSize, dims[1]])
		: dims[1];



	// hard code some cities to place?
	/*
	const citiesPlotSet  = [
		"Boston_MA",
		"Los Angeles_CA",
		"San Francisco_CA",
		"Denver_CO",
		"Houston_TX",
		"Miami_FL"
	]
	*/

	citiesPlotSet.forEach(city => {
		if(cityCordMap[city] === undefined){
			console.log(`ERRROR RENDERING RAIL MAP FOR CITY ${city}`)
		}
	});


	//$: width = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 975
	//$: height = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 610

	// projections
	$: usaMapProjection = d3.geoAlbersUsa().fitSize([width, height], map);

	$: mapPath = d3.geoPath().projection(usaMapProjection);
</script>

<div class="maps" bind:borderBoxSize={borderBoxSize}>
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
			cx = {usaMapProjection(cityCordMap[city].COORD)[0]}
			cy = {usaMapProjection(cityCordMap[city].COORD)[1]}
			fill = "orange"
			r = {5}
		/>
		<text
			font-size = 10
			font-family = "sans-serif"
			dominant-baseline = "hanging"
			x = {usaMapProjection(cityCordMap[city].COORD)[0] + 4}
			y = {usaMapProjection(cityCordMap[city].COORD)[1] + 4}
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
