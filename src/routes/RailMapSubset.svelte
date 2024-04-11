
<script>
	/**
	 * map component for plotting subsets of rail and airlines 
	 * Perhaps want to get rid of duplicate code, but low priority and this is not a SWE class
	 * 
	 * Idea is, to plot rail that connects city pairs?
	 
	*/

	import * as d3 from 'd3';

	export let map; // the USA map
	export let railMap; // amtrak map
	export let cityCordMap;  // mapping from US cities for coordinates
	export let cityAmtrakRouteMap; // mapping US cities to what Amtrak routes they are on

	import {cityPairsToCities} from "../utils";



	// projections
	const usaMapProjection = d3.geoAlbersUsa().fitSize([975, 610], map);

	const mapPath = d3.geoPath().projection(usaMapProjection);

	const mockData = [ [ "(Boston_MA, New York_NY)",
	  { DEPARTURES_PERFORMED: 35030,
		SEATS: 3529952,
		RAMP_TO_RAMP: 2707512,
		PASSENGERS: 2662158,
		FREIGHT: 577035,
		DEST: "EWR",
		ORIGIN: "BOS",
		DISTANCE: 193,
		GRAVITY: 65.42354467661713 }
	 ],
    
  	[ "(Las Vegas_NV, Los Angeles_CA)",
		{ DEPARTURES_PERFORMED: 19538,
		SEATS: 3182337,
		RAMP_TO_RAMP: 1426792,
		PASSENGERS: 2504847,
		FREIGHT: 3161983,
		DEST: "LAX",
		DEST_STATE: "CA",
		ORIGIN: "LAS",
		ORIGIN_STATE: "NV",
		DISTANCE: 236,
		GRAVITY: 34.3296697359362, }
	]
	]


	/**
	 * Idea is to find a subset of rail lines to draw based on data:
	 * for each route: look at cities, index into cityAmtrakRouteMap, and see if there is intersection
	 * plot intersection routes
	 */

	// revamp idea to just use different colors for if there exists rail between these routes, and not
	// will still mostly use the same logic
	const citiesPlotSet  = new Set()
	let routesPlot = []

	// process routes: add to cityPlotSet, and see if they have a rail (if they do then plot it)
	mockData.forEach((route) => {
		// add the cities to be plotted
		let origin = cityPairsToCities(route[0])[0]
		let dest = cityPairsToCities(route[0])[1]
		citiesPlotSet.add(origin)
		citiesPlotSet.add(dest)

		// find which rail stops at that city, and compare
		let originStations = (cityAmtrakRouteMap[origin])
		let destStations = (cityAmtrakRouteMap[dest])

		// if either are undefined then there exists no route, else take intersection

		console.log(`the origin ${origin} and dest ${dest} sets are: ${originStations}, ${destStations}`)

		if (originStations !== undefined && destStations !== undefined) {
			// then look for intersection: 
			// node.js doesn't implement Set::intersection() :(
			let inter = originStations.filter(stat => destStations.includes(stat))
			
			// if inter greater than 0 just add the first one? for now?
			if (inter.length > 0) {
				// add() for sets, push() for arrays
				routesPlot.push(inter[0])
			}
		}
		// else one of these cities doesn't have any rail

	})


	// filters to only plot the rail lines that have existing rail on them
	let amtrakPlottedRoutes = railMap.features.filter(route => 
		// using "has()" b/c routesPlots is a set not an array
		routesPlot.includes(route.properties.NAME)
	)
	//console.log(`ploting these amtrak routes ${routesPlot}`)
	

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

		<!-- drawing maps for SUBSET of rail routes using same projection -->
		{#each amtrakPlottedRoutes as route}
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
			fill = "red"
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
