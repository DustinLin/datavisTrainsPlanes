<script>
	/**
	 * The "map component"?
	*/

	import * as d3 from 'd3';
	import {cityPairsToCities, cityStToCity} from '../utils';


	// prov want to rename "dataset" to like map data or smth
	export let map;
	export let cities;
	export let cordMap;  

	// trying to plot lines and add interaction?
	// from observable its an array of arrays
	// TODO ask jack to append state at the end?
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

	
	// projections
	const usaMapProjection = d3.geoAlbersUsa().fitSize([975, 610], map);

	const mapPath = d3.geoPath().projection(usaMapProjection);


	/**
	 * helper function to compute the PROJECTED coordinates for lines
	 * @param route: [city_pair, data]
	 * @param 0 or 1 for which city in pair
	 * @param 0 or 1 for which cord (x,y) you want
	 * to get the 4 points: x1 = (route, 0, 0), y1 =(route, 0, 1),  x2 = (route, 1, 0), y2 = (route, 1,1)
	 */
	const routeToCords = (route, city, cord) => {
		return usaMapProjection(cordMap[cityPairsToCities(route[0])[city]].COORD)[cord]
	}


	// ideally only want to plot cities that we are drawing routes between
	// all cities that we are drawing lines for
	let citiesRoutePoints = []
	mockData.forEach( (route) => {
		citiesRoutePoints.push(cityPairsToCities(route[0])[0])
		citiesRoutePoints.push(cityPairsToCities(route[0])[1])
	})
	
	const citiesPlotSet  = new Set(citiesRoutePoints)

	// now have some cities that we want to plot





	/**
	 * 
	 * debugging
		let city = cities[0]
		cx = {usaMapProjection(city.geometry.coordinates)[0]}
		cy = {usaMapProjection(city.geometry.coordinates)[1]}

		console.log(`for city ${city}, the cx and cy coordinates are ${cx}, ${cy}`)
	 * 
	*/

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

</script>

<div class="maps">
	<p>map</p>

	<svg width="975" height="610">
		<!-- drawing paths for each state, using projections -->
		{#each map.features as state}
			<path
				fill = "none"
				stroke = "#d3d3d3"
				d={mapPath(state)}
			/>

		{/each}

		<!-- toggle between "cities" and "citiesPlot"-->
		<!-- for "cities", look at "city.geometry.coordinates", and "city.properties.NAME" -->
		{#each citiesPlotSet as city}
		<circle
			cx = {usaMapProjection(cordMap[city].COORD)[0]}
			cy = {usaMapProjection(cordMap[city].COORD)[1]}
			fill = "red"
			r = {3}
		/>
		<text
			font-size = 10
			font-family = "sans-serif"
			dominant-baseline = "hanging"
			x = {usaMapProjection(cordMap[city].COORD)[0]}
			y = {usaMapProjection(cordMap[city].COORD)[1]}
		>
			{city.split("_")[0]}
		</text>
		{/each}

		{#each mockData as route}
		<!-- todo, refactor to a separate file/component?-->
		<!--  drawing a line, need to extract coordinates and draw city end points -->

		<line
			x1={routeToCords(route, 0, 0)}
			y1={routeToCords(route, 0, 1)}
			x2={routeToCords(route, 1, 0)}
			y2={routeToCords(route, 1, 1)}
			stroke="blue"
			stroke-width=1
		/>

	
		{/each}



	</svg>

</div>

<style>
	.maps {
		border-style: solid;
	}

</style>
