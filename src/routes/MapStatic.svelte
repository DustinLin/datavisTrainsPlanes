<script>
	/**
	 * The "map component"?
	*/

	import * as d3 from 'd3';
	import {VIS_PROPERTIES, cityPairsToCities, cityStToCity, cityNamePlacement} from '../utils';

	// wont have onhover? Used for just plotting the cities we want to build HSR in? No interaction?

	// prov want to rename "dataset" to like map data or smth
	export let map; // the usa geo map to plot

	/// NOTE: cities here are just pairs: ""(Las Vegas_NV, Los Angeles_CA)", NO flight data
	export let cities;

	export let cityCordMap;  // map from city to coordinates

	export let highlightedRoute; // the current highlighted route from the scroll wheel 

	// [width, height]
	export let dims;

	export let width;
	export let height;

	let borderBoxSize;

	$: width = borderBoxSize
		? d3.max([borderBoxSize[0].inlineSize, dims[0]])
		: dims[0];

	$: height = borderBoxSize
		? d3.max([borderBoxSize[0].blockSize, dims[1]])
		: dims[1];

	// projections
	$: usaMapProjection = d3.geoAlbersUsa().fitSize([width, height], map);

	$: mapPath = d3.geoPath().projection(usaMapProjection);

	const col = "#FF4D4D"


	/**
	 * helper function to compute the PROJECTED coordinates for lines
	 * @param route: city-pair: "(Las Vegas_NV, Los Angeles_CA)"
	 * @param 0 or 1 for which city in pair
	 * @param 0 or 1 for which cord (x,y) you want
	 * to get the 4 points: x1 = (route, 0, 0), y1 =(route, 0, 1),  x2 = (route, 1, 0), y2 = (route, 1,1)
	 */
	$: routeToCords = (route, city, cord) => {
		return usaMapProjection(cityCordMap[cityPairsToCities(route)[city]].COORD)[cord]
	}


	// for filtering incoming data in "cities" to eliminate runtime errors
	let citiesRoutePoints = []
	let citiesRouteFiltered = []

	// for debugging
	let unMap = 0

	// filter routes to make sure they aren't undefined?
	cities.forEach( (route) => {
		let c1 = cityPairsToCities(route)[0]
		let c2 = cityPairsToCities(route)[1]

		if (cityCordMap[c1] === undefined || cityCordMap[c2] === undefined){
			//console.log(`ROUTE ERROR: city ${c1} or city ${c2} doesn't exist, skipping`)
			unMap = unMap + 1
		} else {
			citiesRoutePoints.push(c1)
			citiesRoutePoints.push(c2)
			citiesRouteFiltered.push(route)
		}
	})
	
	const citiesPlotSet  = new Set(citiesRoutePoints)
	//console.log(`total unmapped cities: ${unMap}`)

	// now have some cities that we want to plot

	// TODO try to make display reactive
	// borderBoxSize: has 2 entires: inline-size - width of div, block-size - height of div
	// borderBoxSize could be undefined
	//$: width = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 975
	//$: height = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 610

	const CITY_CIRCLE_R = VIS_PROPERTIES.CITY_CIRCLE_R
	const CITY_CIRCLE_COL = VIS_PROPERTIES.CITY_CIRCLE_COL

	// BUG?: the <style> section doesn't seem to have this var in scope
	const ROUTE_STROKE_COL = VIS_PROPERTIES.HSR_ROUTE_COL 
	const ROUTE_STROKE_WID = VIS_PROPERTIES.ROUTE_STROKE_WID
	const MAP_COL = VIS_PROPERTIES.MAP_COLOR
	const LINE_OPACITY = VIS_PROPERTIES.LINE_OPACITY

	let routeOrder = 1
	const routeInc = () => routeOrder++

</script>


<div class="maps" bind:borderBoxSize={borderBoxSize}>
	<svg width={width} height={height}>
		<!-- drawing paths for each state, using projections -->
		{#each map.features as state}
			<path
				fill = "none"
				stroke = {MAP_COL}
				d={mapPath(state)}
			/>

		{/each}

		<!-- todo: change to "cities" if want to plot the whole thing, "citiesRouteFiltered" contains ones that won't cause error-->
		{#each citiesRouteFiltered as route}
		<!-- todo, refactor to a separate file/component?-->
		<!--  drawing a line, need to extract coordinates and draw city end points -->

		<line
			x1={routeToCords(route, 0, 0)}
			y1={routeToCords(route, 0, 1)}
			x2={routeToCords(route, 1, 0)}
			y2={routeToCords(route, 1, 1)}
			stroke={ROUTE_STROKE_COL}
			stroke-width={2.5}
			opacity={LINE_OPACITY}
		/>

		<!--

		<text
			font-size = 12
			font-family = "sans-serif"
			dominant-baseline = "text-top"
			font-weight = "bold"
			x = {(routeToCords(route, 0,0) + routeToCords(route, 1,0)) /2}
			y = {(routeToCords(route, 0,1) + routeToCords(route, 1,1)) /2}
		>
			{routeInc()}
		</text>

		-->

		{/each}


		<!-- toggle between "cities" and "citiesPlot"-->
		<!-- for "cities", look at "city.geometry.coordinates", and "city.properties.NAME" -->
		<!-- city of the form "Boston_MA"-->
		{#each citiesPlotSet as city}

		<circle
			cx = {usaMapProjection(cityCordMap[city].COORD)[0]}
			cy = {usaMapProjection(cityCordMap[city].COORD)[1]}
			fill = {ROUTE_STROKE_COL}
			r = {CITY_CIRCLE_R - 2}
		/>
		{/each}

		<!-- adding a bit of buffer room to x,y cords, want the text to appear at the top, so draw the all last, requires an extra loop but -->
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

		{#if highlightedRoute}
			<line
				x1={routeToCords(highlightedRoute, 0, 0)}
				y1={routeToCords(highlightedRoute, 0, 1)}
				x2={routeToCords(highlightedRoute, 1, 0)}
				y2={routeToCords(highlightedRoute, 1, 1)}
				stroke={col}
				stroke-width={3.5}
				opacity={LINE_OPACITY}
			/>
			<circle
				cx = {usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute)[0]].COORD)[0]}
				cy = {usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute)[0]].COORD)[1]}
				fill = {col}
				r = {CITY_CIRCLE_R + 1.75}
			/>
			<circle
				cx = {usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute)[1]].COORD)[0]}
				cy = {usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute)[1]].COORD)[1]}
				fill = {col}
				r = {CITY_CIRCLE_R + 1.75}
			/>

		{/if}


	</svg>

</div>

<style>
	.maps {
		border-style: solid;
		/* the weight? */
		flex:2;
		background: #ffffff;
		border-radius: 2em;
		padding: 1em;
	}
</style>
