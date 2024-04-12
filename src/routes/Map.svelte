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

	export let showCityName; // to toggle if map wants to plot city names or not for clutter

	// [width, height]
	export let dims;
	

	// trying to plot lines and add interaction?
	// from observable its an array of arrays
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
	console.log(`total unmapped cities: ${unMap}`)

	// now have some cities that we want to plot


	/**
	 *  reference code
		.join("text")
		.attr('font-size', 10)
		.attr('font-family', 'sans-serif')
		.attr('dominant-baseline', 'hanging') // to edit to make pretty
		.attr('x', city => usaMapProjection(city.geometry.coordinates)[0]) // using same projection as circles for cities
		.attr('y', city => usaMapProjection(city.geometry.coordinates)[1])
		.text(city => city.properties.NAME);

	   // code for making a path in d3
		  g.selectAll("path")
    		.data(usaGeo.features)
    		.join("path")
			.attr("d", mapPath)
			.attr("fill", '#d3d3d3')
			.attr("stroke", "white");
	*/

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
	const ROUTE_STROKE_WID = 0.5

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
			on:mouseover={() => onhover(route)}
			on:mouseleave={() => onhover(null)}
			on:focus={() => onhover(route)}
			on:focusout={() => onhover(null)}
		/>

		{/each}


		<!-- toggle between "cities" and "citiesPlot"-->
		<!-- for "cities", look at "city.geometry.coordinates", and "city.properties.NAME" -->
		<!-- city of the form "Boston_MA"-->
		{#each citiesPlotSet as city}

		<circle
			cx = {usaMapProjection(cityCordMap[city].COORD)[0]}
			cy = {usaMapProjection(cityCordMap[city].COORD)[1]}
			fill = {"red"}
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



	</svg>

</div>

<style>
	.maps {
		border-style: solid;
		/* the weight? */
		flex:2;
	}
	line:hover {
		stroke: rgb(40, 147, 65);
		/* can't access js variables in <style> section? */
		stroke-width: 4; 
	}
</style>
