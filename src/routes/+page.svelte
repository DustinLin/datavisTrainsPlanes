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
	const filteredCityPairToInfo = data.dataPayload.filteredCityPairToInfo;


	console.log(`there are many states: ${usaGeoContig.features.length}`)
	console.log(`There are many big cities: ${bigCities.length}`)
	console.log(`There are many cities in the cord map: ${Object.keys(cityCordMap).length}`)
	console.log(`there are many amtrak routes: ${amtrakMap.features.length}`)
	console.log(`there are many city pairs: ${filteredCityPairToInfo.length}`)



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
	<div class="header">
		<h3>Header class to put stuff?</h3>
	</div>

	<div class="main">
		<h2>How do people travel between cities in the US</h2>
		<div class="infoMap" id="allRoutes">
			<Map map={usaGeoContig} cities={bigCities} cordMap={cityCordMap} onhover={onhover} highlightedRoute={highlightedRoute}/>
		</div>
		<!-- compoenent -->
		<h2>What are the popular airline routes in the US?</h2>
		<div class="infoMap" id="popularAirlines">
			<Map map={usaGeoContig} cities={bigCities} cordMap={cityCordMap} onhover={onhover} highlightedRoute={highlightedRoute}/>
			<!-- <BarChart/> -->
		</div>
		<h2>How much time is spent taking these routes?</h2>
		<div class="infoMap" id="airlineTimes">
			<p>idea to put a barchart that outlines different histogram that haneen made here as well as a bar chart the breaks down the flying time, maybe could give a few flight examples<p/>
			<!-- <BarChart/>
			<Histogram/> -->
		</div>

		<h2>Is there a faster way?</h2>
		<p>introduction into the ideas of the time triangle</p>
		<div class="infoMap" id="timeTriangle">
			<!-- <TimeTriangle/> -->
			<p>Paragraph explaining time triangle</p>
		</div>

		<h2>Airline routes that would be faster on HSR</h2>
		<div class="infoMap" id="airlineSpeedUp">
			<Map map={usaGeoContig} cities={bigCities} cordMap={cityCordMap} highlightedRoute={highlightedRoute}/>
			<!-- <Comparison Bar Chart/> -->
		</div>

		<div class="infoMap" id="modifiedHistograms">
			<!-- <HighlightedHistogram highlightedRoute={highlightedRouteRail}/> -->
			<!-- <newHistogram highlightedRoute={highlightedRouteRail}/> -->
		</div>

		<div class="infoMap" id="comparisonBarChart">
			<!-- <ComparisonBarChart highlightedRoute={highlightedRouteRail}/> -->
		</div>
		

		<h2>Which of the X routes should we build</h2>
		<div class="infoMap" id="iterativeGravityExplanation"><p>
			Explanation of the iterative gravity model
		</p></div>

		<h2>Results</h2>
		<div class="infoMap" id="proposedHSRMap">
			<Map map={usaGeoContig} cities={bigCities} cordMap={cityCordMap} onhover={onhover} highlightedRoute={highlightedRoute}/>
			<!-- <FinalMapDisplay highlightedRoute={highlightedRouteRail}/> -->
		</div>
		
		<h2>Intersection with current rail</h2>
		<p>The United states currently has no functional high speed rail. The fastest train in the US, Amtrak's Acela line, top speed of 160 MPH (257 km/hr) meets the Internation Union of Railways defintion of travel at least 155 MPH (250 km/hr). However, the Acela average speed of 70 MPH (113 km/hr) does not meet the required average speed of 124 MPH (200 km/hr)</p>
		<p>Consider making the above information partly into a table? Comparing speeds?</p>
		<div class="infoMap" id="railIntersection">
			<RailMap map={usaGeoContig} railMap={amtrakMap} onhover={onhover} cordMap={cityCordMap}/>
			<!-- <RouteDisplay highlightedRoute={highlightedRouteRail}/> -->
		</div>


		<h2>What Now?</h2>
		<p>Want to learn more? go to these rouceses @cityNerd</p>
		<p>What to play around with the data? click <a href="https://github.com/DustinLin/datavisTrainsPlanes">here</a>.</p>
		<p>Want to get involved? takes these steps: Share our and other resources with others</p>
		

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
