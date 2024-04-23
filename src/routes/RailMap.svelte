<script>
	/**
	 * map component for rail, should be p similar
	 * Perhaps want to get rid of duplicate code, but low priority and this is not a SWE class
	*/


	/*

	  0: "Acela"
  1: "Adirondack"
  2: "Auto Train"
  3: "Blue Water"
  4: "California Zephyr"
  5: "Capitol Limited"
  6: "Cardinal"
  7: "Cascades"
  8: "Lincoln Service"
  9: "Coast Starlight"
  10: "Empire Builder"
  11: "Empire Service"
  12: "Ethan Allen Express"
  13: "Heartland Flyer"
  14: "Hiawatha"
  15: "Saluki"
  16: "Illinois Zephyr"
  17: "Keystone Service"
  18: "Lake Shore Limited"
  19: "Maple Leaf"
  20: "Hartford Line"
  21: "Pacific Surfliner"
  22: "Pennsylvanian"
  23: "Northeast Regional"
  24: "San Joaquins"
  25: "Silver Service/Palmetto"
  26: "Southwest Chief"
  27: "Sunset Limited"
  28: "Downeaster"
  29: "City of New Orleans"
  30: "Crescent"
  31: "Missouri River Runner"
  32: "Texas Eagle"
  33: "Pere Marquette"
  34: "Wolverine"
  35: "Capitol Corridor"
  36: "Vermonter"
  37: "Carolinian"
  38: "Piedmont"

	*/

	import * as d3 from 'd3';

	export let map; // the USA map
	export let railMap; // amtrak map
	export let cityCordMap;  // mapping from US cities for coordinates

	export let citiesPlotSet; // which cities to plot

	import {VIS_PROPERTIES, cityNamePlacement} from "../utils";

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


	const RAIL_EXISTS_COLOR = VIS_PROPERTIES.AMTRAK_RAIL_COL

	const CITY_CIRCLE_R = VIS_PROPERTIES.CITY_CIRCLE_R
	const CITY_CIRCLE_COL = VIS_PROPERTIES.CITY_CIRCLE_COL
	const MAP_COLOR = VIS_PROPERTIES.MAP_COLOR
	const LINE_OPACITY = VIS_PROPERTIES.LINE_OPACITY

	$: mapPath = d3.geoPath().projection(usaMapProjection);
</script>

<div class="maps" bind:borderBoxSize={borderBoxSize}>
	<h2>Existing Amtrak rail in the Untied States</h2>
	<svg width={width} height={height}>
		<!-- drawing paths for each state, using projections -->
		{#each map.features as state}
			<path
				fill = "none"
				stroke = {MAP_COLOR}
				d={mapPath(state)}
				opacity={LINE_OPACITY}
			/>

		{/each}

		<!-- drawing maps for rail routes using same projection -->
		{#each railMap.features as route}
			<path
				fill = "none"
				stroke = {RAIL_EXISTS_COLOR}
				d={mapPath(route)}
			/>

		{/each}

		<!-- toggle between "cities" and "citiesPlot"-->
		<!-- for "cities", look at "city.geometry.coordinates", and "city.properties.NAME" -->
		{#each citiesPlotSet as city}
		<circle
			cx = {usaMapProjection(cityCordMap[city].COORD)[0]}
			cy = {usaMapProjection(cityCordMap[city].COORD)[1]}
			fill = {CITY_CIRCLE_COL}
			r = {CITY_CIRCLE_R - 2}
		/>
		{/each}

		{#each citiesPlotSet as city}
		<text
			font-size = 10
			font-family = "sans-serif"
			dominant-baseline = "hanging"
			font-weight = "bold"
			x = {cityNamePlacement(city, usaMapProjection, cityCordMap)[0]}
			y = {cityNamePlacement(city, usaMapProjection, cityCordMap)[1]}
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
		background: #ffffff;
		border-radius: 2em;
	}
	h2 {
		padding-left: 1em;
	}
</style>
