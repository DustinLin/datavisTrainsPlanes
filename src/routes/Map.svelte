<script>
	/**
	 * The "map component"?
	*/

	import * as d3 from 'd3';
	import {cityPairsToCities, cityStToCity} from '../utils';


	// prov want to rename "dataset" to like map data or smth
	export let map; // the usa geo map to plot
	export let cities; // the obj containing all the routes want to plot
	export let cityCordMap;  // map from city to coordiates

	export let onhover;
	export let mapId; // a string to update the hover variable
	export let highlightedRoute;

	export let showCityName; // to toggle if map wants to plot city names or not for clutter

	// [width, height]
	export let dims;
	

	// trying to plot lines and add interaction?
	// from observable its an array of arrays

	


	/**
	 * helper function to compute the PROJECTED coordinates for lines
	 * @param route: [city_pair, data]
	 * @param 0 or 1 for which city in pair
	 * @param 0 or 1 for which cord (x,y) you want
	 * to get the 4 points: x1 = (route, 0, 0), y1 =(route, 0, 1),  x2 = (route, 1, 0), y2 = (route, 1,1)
	 */
	const routeToCords = (route, city, cord) => {
		return usaMapProjection(cityCordMap[cityPairsToCities(route[0])[city]].COORD)[cord]
	}

	// given a city, determine if it is a highlighted city
	// not being used at the moment, will try to use for hover highlighting
	const cityHighlightColor = (city) => {
		if (highlightedRoute === null || highlightedRoute === undefined ){
			return CITY_CIRCLE_COL
		} else {
			let curr = cityPairsToCities(highlightedRoute[0])
			if (city === curr[0] || city === curr[1]) {
				return "yellow"

			} else {
				// return basic color
				return CITY_CIRCLE_COL
			}
		}
	}


	// for filtering incoming data in "cities" to eliminate runtime errors
	let citiesRoutePoints = []
	let citiesRouteFiltered = []

	// for debugging
	let unMap = 0

	// filter routes to make sure they aren't undefined?
	cities.forEach( (route) => {
		let c1 = cityPairsToCities(route[0])[0]
		let c2 = cityPairsToCities(route[0])[1]

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
	let borderBoxSize;
	// borderBoxSize: has 2 entires: inline-size - width of div, block-size - height of div
	// borderBoxSize could be undefined
	let width = dims[0]
	let height = dims[1]
	//$: width = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 975
	//$: height = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 610

	// projections
	const usaMapProjection = d3.geoAlbersUsa().fitSize([width, height], map);

	const mapPath = d3.geoPath().projection(usaMapProjection);

	const CITY_CIRCLE_R = 5
	const CITY_CIRCLE_COL = "red"

	// BUG?: the <style> section doesn't seem to have this var in scope
	const ROUTE_STROKE_COL = "blue"
	const ROUTE_STROKE_WID =  0.5
	const MAP_COLOR = "#d3d3d3"

	const HL_CIRC_COLOR = "green"
	const HL_CIRC_R = 7
	const HL_ROUTE_STROKE_WID = 2
	const HL_ROUTE_STROKE_COL = "green"

</script>

<div class="maps">
	<svg width={width} height={height}>
		<!-- drawing paths for each state, using projections -->
		{#each map.features as state}
			<path
				fill = "none"
				stroke = {MAP_COLOR}
				d={mapPath(state)}
			/>

		{/each}

		<!-- todo: change to "cities" if want to plot the whole thing, "citiesRouteFiltered" contains ones that won't cause error-->
		{#each citiesRouteFiltered as route}
		<!-- todo, refactor to a separate file/component?-->
		<!--  drawing a line, need to extract coordinates and draw city end points -->

		<!-- conditionally render color based on hover? -->
		<line
			x1={routeToCords(route, 0, 0)}
			y1={routeToCords(route, 0, 1)}
			x2={routeToCords(route, 1, 0)}
			y2={routeToCords(route, 1, 1)}
			stroke={ROUTE_STROKE_COL}
			stroke-width={ROUTE_STROKE_WID}
			on:mouseover={() => onhover(route, mapId)}
			on:focus={() => onhover(route, mapId)}
		/>

		{/each}


		<!-- toggle between "cities" and "citiesPlot"-->
		<!-- for "cities", look at "city.geometry.coordinates", and "city.properties.NAME" -->
		<!-- city of the form "Boston_MA"-->
		{#each citiesPlotSet as city}

		<circle
			cx = {usaMapProjection(cityCordMap[city].COORD)[0]}
			cy = {usaMapProjection(cityCordMap[city].COORD)[1]}
			fill = {CITY_CIRCLE_COL}
			r = {CITY_CIRCLE_R}
		/>
		{/each}

		<!-- adding a bit of buffer room to x,y cords, want the text to appear at the top, so draw the all last, requires an extra loop but -->
		{#if showCityName}

			{#each citiesPlotSet as city}
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

		{/if}

		<!-- redraw highlighted route to be on top-->

		{#if highlightedRoute}
			<line
				x1={routeToCords(highlightedRoute, 0, 0)}
				y1={routeToCords(highlightedRoute, 0, 1)}
				x2={routeToCords(highlightedRoute, 1, 0)}
				y2={routeToCords(highlightedRoute, 1, 1)}
				stroke={HL_ROUTE_STROKE_COL}
				stroke-width={HL_ROUTE_STROKE_WID}
			/>

			<circle
				cx = {usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute[0])[0]].COORD)[0]}
				cy = {usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute[0])[0]].COORD)[1]}
				fill = {HL_CIRC_COLOR}
				r = {HL_CIRC_R}
			/>

			<circle
				cx = {usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute[0])[1]].COORD)[0]}
				cy = {usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute[0])[1]].COORD)[1]}
				fill = {HL_CIRC_COLOR}
				r = {HL_CIRC_R}
			/>


		{/if}



	</svg>

</div>

<style>
	.maps {
		border-style: solid;
		/* the weight? */
		flex:2;
	}
</style>
