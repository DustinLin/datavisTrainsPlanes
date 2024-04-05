<script>
	/**
	 * The "map component"?
	*/

	import * as d3 from 'd3';


	// prov want to rename "dataset" to like map data or smth
	export let map;
	export let cities;

	
	const usaMapProjection = d3.geoAlbersUsa().fitSize([975, 610], map);

	const mapPath = d3.geoPath().projection(usaMapProjection);


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
		{#each cities as city}
		<circle
			cx = {usaMapProjection(city.geometry.coordinates)[0]}
			cy = {usaMapProjection(city.geometry.coordinates)[1]}
			fill = "red"
			r = {3}
		/>
		<text
			font-size = 10
			font-family = "sans-serif"
			dominant-baseline = "hanging"
			x = {usaMapProjection(city.geometry.coordinates)[0]}
			y = {usaMapProjection(city.geometry.coordinates)[1]}
		>
			{city.properties.NAME}
		</text>
		{/each}


		<!-- drawing paths for each state, using projections -->
		{#each map.features as state}
			<path
				fill = "none"
				stroke = "#d3d3d3"
				d={mapPath(state)}
			/>

		{/each}



	</svg>

</div>

<style>
	.maps {
		border-style: solid;
	}

</style>
