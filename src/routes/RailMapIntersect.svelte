
<script>
	/**
	 * map component for plotting subsets of rail and airlines 
	 * Perhaps want to get rid of duplicate code, but low priority and this is not a SWE class
	 * 
	 * Idea is, to plot the proposed HSR, and differentiate those that have existing rail
	 
	*/

	import * as d3 from 'd3';

	export let map; // the USA map
	export let cityCordMap;  // mapping from US cities for coordinates
	export let cityAmtrakRouteMap; // mapping US cities to what Amtrak routes they are on

	// city pairs that we want to plot, are of the form "(Boston_MA, New York_NY)", there is no associated flight data
	export let cities;

	// [width, height]
	export let dims;

	import {VIS_PROPERTIES, cityPairsToCities, cityNamePlacement} from "../utils";

	$: width = borderBoxSize
		? Math.max(borderBoxSize[0].inlineSize, 400)
		: 400;

	$: height = borderBoxSize
		? Math.max(borderBoxSize[0].blockSize, 400)
		: 400;


	/**
	 * Idea is to find a subset of rail lines to draw based on data:
	 * for each route: look at cities, index into cityAmtrakRouteMap, and see if there is intersection
	 * plot intersection routes
	 */

	// revamp idea to just use different colors for if there exists rail between these routes, and not
	// will still mostly use the same logic
	const citiesPlotSet  = new Set()
	// tuple of (cities/route, boolean) for if there exists rail between
	let routesPlot = []

	// process routes: add to cityPlotSet, and see if they have a rail (if they do then plot it)
	cities.forEach((route) => {
		// add the cities to be plotted
		let origin = cityPairsToCities(route)[0]
		let dest = cityPairsToCities(route)[1]
		citiesPlotSet.add(origin)
		citiesPlotSet.add(dest)

		// find which rail stops at that city, and compare
		let originStations = (cityAmtrakRouteMap[origin])
		let destStations = (cityAmtrakRouteMap[dest])

		// if either are undefined then there exists no route, else take intersection

		if (originStations !== undefined && destStations !== undefined) {
			// then look for intersection: 
			// node.js doesn't implement Set::intersection() :(
			let inter = originStations.filter(stat => destStations.includes(stat))
			
			// if inter greater than 0 just add the first one? for now?
			if (inter.length > 0) {
				// add() for sets, push() for arrays
				// pushing inter[0] adds the specific rail route
				//routesPlot.push(inter[0])
				routesPlot.push([route, true])
			} else {
				routesPlot.push([route, false])
			}
		} else {
			// else one of these cities doesn't have any rail
			routesPlot.push([route, false])
		}

	})

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


	/* old code to plot amtrak routes
	// filters to only plot the rail lines that have existing rail on them
	let amtrakPlottedRoutes = railMap.features.filter(route => 
		// using "has()" b/c routesPlots is a set not an array
		routesPlot.includes(route.properties.NAME)
	)
	//console.log(`ploting these amtrak routes ${routesPlot}`)
	
	 */

	// TODO try to make display reactive
	let borderBoxSize;
	// borderBoxSize: has 2 entires: inline-size - width of div, block-size - height of div
	// borderBoxSize could be undefined
	//$: width = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 975
	//$: height = borderBoxSize ? Math.min(borderBoxSize[0].blockSize, borderBoxSize[0].inlineSize) : 610

	// projections
	$: usaMapProjection = d3.geoAlbersUsa().fitSize([width, height], map);

	$: mapPath = d3.geoPath().projection(usaMapProjection);

	const RAIL_EXISTS_COLOR = VIS_PROPERTIES.HSR_ROUTE_COL
	const RAIL_DNE_COLOR = "#33a02c"
	const ROUTE_STROKE_WID = VIS_PROPERTIES.HL_ROUTE_STROKE_WID

	const CITY_CIRCLE_R = VIS_PROPERTIES.CITY_CIRCLE_R
	const CITY_CIRCLE_COL = VIS_PROPERTIES.CITY_CIRCLE_COL
	const MAP_COLOR = VIS_PROPERTIES.MAP_COLOR
	const LINE_OPACITY = VIS_PROPERTIES.LINE_OPACITY


</script>

<div class="maps" bind:borderBoxSize={borderBoxSize}>
	<svg width={width} height={height}>
		<!-- drawing paths for each state, using projections -->
		{#each map.features as state}
			<path
				fill = "none"
				stroke = {MAP_COLOR}
				d={mapPath(state)}
			/>

		{/each}

		{#each routesPlot as [route, railExist]}
		<!--  drawing a line, need to extract coordinates and draw city end points -->

		<line
			x1={routeToCords(route, 0, 0)}
			y1={routeToCords(route, 0, 1)}
			x2={routeToCords(route, 1, 0)}
			y2={routeToCords(route, 1, 1)}
			stroke={railExist ? RAIL_EXISTS_COLOR : RAIL_DNE_COLOR}
			stroke-width={ROUTE_STROKE_WID}
			opacity={LINE_OPACITY}
		/>

		{/each}



		<!-- toggle between "cities" and "citiesPlot"-->
		<!-- for "cities", look at "city.geometry.coordinates", and "city.properties.NAME" -->
		{#each citiesPlotSet as city}
		<circle
			cx = {usaMapProjection(cityCordMap[city].COORD)[0]}
			cy = {usaMapProjection(cityCordMap[city].COORD)[1]}
			fill = {CITY_CIRCLE_COL}
			r = {CITY_CIRCLE_R}
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

		<!-- prob also want to draw the flight paths?-->

	</svg>

</div>

<style>
	.maps {
		border-style: solid;
		/* the weight? */
		flex:2;
	}
</style>
