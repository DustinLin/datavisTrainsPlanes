<script>
	/**
	 * the landing page, idea is to have a giant scroll area?
	 * 
	*/

	import './style.css';
	import * as d3 from 'd3';
	import Scatterplot from './Scatterplot.svelte';
	import FeatureControls from './FeatureControls.svelte';
	import BarChart from './BarChart.svelte';
	import PlayerList from './PlayerList.svelte';
	import ColorLegend from './ColorLegend.svelte';

	import Map from './Map.svelte'
  	import RouteDisplay from './RouteDisplay.svelte';
	import RailMap from './RailMap.svelte';
  import TopChart from './TopChart.svelte';

	// data comes from the load function in +page.js
	export let data;

	const usaGeoContig = data.dataPayload.usaGeo;
	const bigCities = data.dataPayload.citiesBig;
	const cityCordMap = data.dataPayload.cityCordMap;
	const amtrakMap = data.dataPayload.amtrakMap;


	console.log(`there are many states: ${usaGeoContig.features.length}`)
	console.log(`There are many big cities: ${bigCities.length}`)
	console.log(`There are many cities in the cord map: ${Object.keys(cityCordMap).length}`)
	console.log(`there are many amtrak routes: ${amtrakMap.features.length}`)



	// for keeping track of which route was highlighted
	// idea is to pass highlightedRoute to some other component
	// TODO: for multiple maps will need to create a diff variable.. or else they all point to the same thing
	let highlightedRoute = null;

	function onhover(route){
		// set params for route
		if (route === null) {
			highlightedRoute = null
		} else {
			// interesting that these print statements end up printing on the web browser/client side, not sure why
			//console.log(`hovering over route ${route}`)
			highlightedRoute = route
		}
	}

	/* TODO: think about highlighting rail lines for <RailMap/> ?
	let highlightedRouteRail = null;

	function onhoverRail(route){
		// set params for route
		if (route === null) {
			highlightedRouteRail = null
		} else {
			// interesting that these print statements end up printing on the web browser/client side, not sure why
			//console.log(`hovering over route ${route}`)
			highlightedRouterRail = route
		}
	}
	*/




	//$: color = d3.scaleOrdinal().domain(categories).range(d3.schemeTableau10);
</script>

<div class="container">
	<h2>Title: I like trains</h2>
	<div class="header">
		<h3>Header class to put stuff?</h3>
	</div>

	<div class="main">
		<p>Here is where we want to start putting out visuals?, and implement a scroll</p>
		<!-- compoenent -->
		<div class="infoMap">
			<Map map={usaGeoContig} cities={bigCities} cordMap={cityCordMap} onhover={onhover} highlightedRoute={highlightedRoute}/>
			<RouteDisplay highlightedRoute={highlightedRoute}/>
		</div>
		<p>More text/transition, how to make pretty...</p>
		<div class="infoMap">
			<RailMap map={usaGeoContig} railMap={amtrakMap} cordMap={cityCordMap}/>
			<!-- <RouteDisplay highlightedRoute={highlightedRouteRail}/> -->
		</div>
		<TopChart/>

	</div>
</div>

<style>
	/* Old styling */
	.container {
		/* set the font */
		font-family: system-ui, sans-serif;
		font-size: 16px;
		/* make the div take up the entire screen */
		height: 100vh;
		width: 100vw;
		/* add 32px of padding around the div */
		padding: 2em;
		/* put the controls on top of the plots with 32px of space in between */
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	/* place the feature controls and color legend next to each other */
	.header {
		display: flex;
		gap: 2em;
		align-items: center;
	}

	.main {
		/* changed to a vertical flex, with overflow scroll */
		display:flex;
		flex-direction: column;

		align-items: center;
		justify-content: center;

		gap: 2em;
	}

	.infoMap {
		/* want a horizonal flex? */
		display: flex;
		gap: 2em;

	}
</style>
