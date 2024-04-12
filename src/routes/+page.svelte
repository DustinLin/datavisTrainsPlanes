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
    import TimeTriangle from './TimeTriangle.svelte';
  	import TopChart from './TopChart.svelte';
  	import RailMapSubset from './RailMapSubset.svelte';
	import MapStatic from './MapStatic.svelte';
	import RailMapIntersect from './RailMapIntersect.svelte';

	import { cutoffs, cityPairsToCities  } from '../utils';

	// data comes from the load function in +page.js
	export let data;

	const usaGeoContig = data.dataPayload.usaGeo;
	const cityCordMap = data.dataPayload.cityCordMap;
	const amtrakMap = data.dataPayload.amtrakMap;
	const filteredCityPairToInfo = data.dataPayload.filteredCityPairToInfo;
	const amtrakMapSimp = data.dataPayload.amtrakMapSimp;
	const cityAmtrakRouteMap = data.dataPayload.cityAmtrakRouteMap;
	const gravityTopResRoutes = data.dataPayload.gravityTopResRoutes


	console.log(`there are many states: ${usaGeoContig.features.length}`)
	console.log(`There are many cities in the cord map: ${Object.keys(cityCordMap).length}`)
	console.log(`there are many amtrak routes: ${amtrakMap.features.length}`)
	console.log(`there are many city pairs: ${filteredCityPairToInfo.length}`)
	console.log(`we are builing the top ${gravityTopResRoutes[0].length} grav rail routes`)




	// for keeping track of which route was highlighted
	// idea is to pass highlightedRoute to some other component
	// TODO: for multiple maps will need to create a diff variable.. or else they all point to the same thing
	// data type is the the route object
	let highlightedRoute = null;

	function onhover(route){
		// set params for route
		console.log(`hihglighted route is: ${route}`)
		if (route === null) {
			highlightedRoute = null
		} else {
			// interesting that these print statements end up printing on the web browser/client side, not sure why
			//console.log(`hovering over route ${route}`)
			highlightedRoute = route
		}
	}

	let GravTopRes = gravityTopResRoutes[0].slice(0, cutoffs.topGravNumber)

	// doing some route processing to plot certain routes on different <Map>
	let manyRouteCities = filteredCityPairToInfo

	let triangleRouteCities= filteredCityPairToInfo.filter(route => 
		route[1].DISTANCE >= cutoffs.triangleLower && route[1].DISTANCE <= cutoffs.triangleUpper
	)

	console.log(`there is a diff between many routes and triangle routes: ${manyRouteCities.length}, ${triangleRouteCities.length}`)

	// sorting data by top that carry passengers, taking top N
	let topFlightRoutesPass = filteredCityPairToInfo 
			.sort(([cities1, data1], [cities2, data2]) => {
			const score1 = data1.PASSENGERS
			const score2 = data2.PASSENGERS
			return d3.descending(score1, score2)
			}).slice(0,cutoffs.topRoutesNumber)


	let citiesPlotSet = new Set()

	// for plotting cities that are going to be plotted on our gravity model
	GravTopRes.forEach(route => {
		citiesPlotSet.add(cityPairsToCities(route)[0])
		citiesPlotSet.add(cityPairsToCities(route)[1])
	});
	


</script>

<div class="container">
	<div class="header">
		<h3>Header class to put stuff?</h3>
	</div>

	<TimeTriangle/>

	<div class="main">
		<h2>How do people travel between cities in the US</h2>
		<Map map={usaGeoContig} cities={manyRouteCities} cityCordMap={cityCordMap} onhover={onhover} showCityName={false} dims={[975, 610]}/>
		<RouteDisplay highlightedRoute={highlightedRoute}/>

		<!-- compoenent -->
		<h2>What are the popular airline routes in the US?</h2>
		<div class="infoMap" id="popularAirlines">
			<Map map={usaGeoContig} cities={topFlightRoutesPass} cityCordMap={cityCordMap} onhover={onhover} showCityName={true} dims={[975,610]}/>
			<RouteDisplay highlightedRoute={highlightedRoute}/>
			<!-- <BarChart/> for top routes -->
		</div>

		<h2>How much time is spent taking these routes?</h2>
		<div class="infoMap" id="airlineTimes">
			<p>idea to put the histogram that haneen made here as well as a bar chart the breaks down the flying time, maybe could give a few flight examples<p/>
			<!-- <BarChart/> for times -->
			<!-- <Histogram/> -->
		</div>

		<h2>Is there a faster way?</h2>
		<p>introduction into the ideas of the time triangle</p>
		<div class="infoMap" id="timeTriangle">
			<!-- <TimeTriangle/> -->
		</div>

		<h2>Airline routes that would be faster on HSR</h2>
		<div class="infoMap" id="airlineSpeedUp">
			<Map map={usaGeoContig} cities={triangleRouteCities} cityCordMap={cityCordMap} onhover={onhover} showCityName={false} dims={[975,610]}/>
			<RouteDisplay highlightedRoute={highlightedRoute}/>

			<!-- <HighlightedHistogram highlightedRoute={highlightedRouteRail}/> -->
			<!-- <newHistogram highlightedRoute={highlightedRouteRail}/> -->
			<!-- <Comparison Bar Chart/> -->
		</div>

		<p>The United states currently has no functional high speed rail. The fastest train in the US, Amtrak's Acela line, top speed of 160 MPH (257 km/hr) meets the Internation Union of Railways defintion of travel at least 155 MPH (250 km/hr). However, the Acela average speed of 70 MPH (113 km/hr) does not meet the required average speed of 124 MPH (200 km/hr)</p>
		

		<h2>Proposed HSR</h2>
		<div class="infoMap" id="proposedHSRMap">
			<MapStatic map={usaGeoContig} cities={GravTopRes} cityCordMap={cityCordMap} dims={[975,610]}/>
			<!-- <FinalMapDisplay highlightedRoute={highlightedRouteRail}/> -->
		</div>

		<h2>Intersection with current rail</h2>
		<div class="infoMap" id="railIntersection">
			<RailMapIntersect map={usaGeoContig} cities={GravTopRes} cityCordMap={cityCordMap} cityAmtrakRouteMap={cityAmtrakRouteMap} dims={[800,500]}/>
			<RailMap map={usaGeoContig} railMap={amtrakMapSimp} cityCordMap={cityCordMap} citiesPlotSet={citiesPlotSet} dims={[800,500]}/>
			<!-- <RouteDisplay highlightedRoute={highlightedRouteRail}/> -->
		</div>

		<h2>Room for upgrade how to decide which</h2>
		<div class="infoMap" id="iterativeGravity">
			<!-- <GravityModel highlightedRoute={highlightedRouteRail}/> -->
		</div>



		<p>What to access the data? click <a href="https://github.com/DustinLin/datavisTrainsPlanes">here</a>.</p>
		
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
