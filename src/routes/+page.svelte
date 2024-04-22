<script>
	/**
	 * the landing page, idea is to have a giant scroll area?
	 * 
	*/

	import './style.css';
	import * as d3 from 'd3';
	//import BarChart from './BarChart.svelte';
	import BarChart from './BarChartNew.svelte';

	import Map from './Map.svelte'
  	import RouteDisplay from './RouteDisplay.svelte';
	import RailMap from './RailMap.svelte';
    import TimeTriangle from './TimeTriangle.svelte';
  	import TopChart from './TopChart.svelte';
  	import RailMapSubset from './RailMapSubset.svelte';
	import MapStatic from './MapStatic.svelte';
	import RailMapIntersect from './RailMapIntersect.svelte';

	import { cutoffs, cityPairsToCities, roundTo } from '../utils';
	import Histogram from './Histogram.svelte';


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
	

	//  console.log(categories);

</script>

<div class="container">
	<div class="header">
		<h3>Header class to put stuff?</h3>
	</div>


	<div class="main">
		<h2>How do people travel between cities in the US</h2>
		<div class="infoMap" id="allRoutes">
			<Map map={usaGeoContig} cities={manyRouteCities} cityCordMap={cityCordMap} onhover={onhover} showCityName={false} dims={[975, 610]}/>
			<RouteDisplay highlightedRoute={highlightedRoute}/>
		</div>

		<!-- compoenent -->
		<h2>What are the popular airline routes in the US?</h2>
		<div class="infoMap" id="popularAirlines">
			<Map map={usaGeoContig} cities={topFlightRoutesPass} cityCordMap={cityCordMap} onhover={onhover} showCityName={true} dims={[975,610]}/>
			<RouteDisplay highlightedRoute={highlightedRoute}/>
			<!-- <BarChart/> for top routes -->
			<BarChart dataset={filteredCityPairToInfo} feature={"PASSENGERS"} xLabel={"Passengers (in millions)"} color={'#88aed0'} roundValue={100}/> 
		</div>

		<h2>How much time is spent taking these routes?</h2>
		<div class="infoMap" id="airlineTimes">
			<p>idea to put a barchart that outlines different histogram that haneen made here as well as a bar chart the breaks down the flying time, maybe could give a few flight examples<p/>
			<!-- <BarChart/> -->
			<Histogram dataset={filteredCityPairToInfo} xLabel={"Passengers (in millions)"} color={'#88aed0'} triangleColor={'#88aed0'}/> 
		</div>


		<h2>Is there a faster way?</h2>
		<div class="infoMap" id="timeTriangle">
			<p>
				The answer is that it depends on how far you are traveling.
				The fastest way to get across the world is flying, the fastest way to get to the other side of town is likely to drive (but could be an electric bike or subway depending on where you live). 
				In between those distance there is sweet spot where the fastest mode of travel is High Speed Rail (HSR).
				<br>
				To find this sweet spot we find a line of best fit for each of the modes of transportation (Car, HSR, Planes). 
				We very creatively call the area intersection formed by these lines the time triangle which is plotted to the right.
				From this we find that when traveling between {roundTo(cutoffs.triangleLower, 0.1)} miles and {roundTo(cutoffs.triangleUpper, 0.1)} miles HSR is the fastest mode of transportation.
			</p>
			<TimeTriangle/>
		</div>

		<h2>Airline routes that would be faster on HSR</h2>
		<div class="infoMap" id="airlineSpeedUp">
			<Map map={usaGeoContig} cities={triangleRouteCities} cityCordMap={cityCordMap} onhover={onhover} showCityName={false} dims={[975,610]}/>
			<RouteDisplay highlightedRoute={highlightedRoute}/>

			<!-- <Comparison Bar Chart/> -->
		</div>
		<Histogram dataset={filteredCityPairToInfo} xLabel={"Passengers (in millions)"} color={'#88aed0'} triangleColor={'#cfe6ce'}/> 
			

		<p>The United States currently has no functional high speed rail. The fastest train in the US, Amtrak's Acela line, top speed of 160 MPH (257 km/hr) meets the International Union of Railways definition of travel at least 155 MPH (250 km/hr). However, the Acela average speed of 70 MPH (113 km/hr) does not meet the required average speed of 124 MPH (200 km/hr)</p>
		


		<div class="infoMap" id="modifiedHistograms">
			<!-- <HighlightedHistogram highlightedRoute={highlightedRouteRail}/> -->
			<!-- <newHistogram highlightedRoute={highlightedRouteRail}/> -->
		</div>

		<div class="infoMap" id="comparisonBarChart">
			<!-- <ComparisonBarChart highlightedRoute={highlightedRouteRail}/> -->
		</div>
		

		<h2>Which of the X routes should we build</h2>
		<div class="infoMap" id="iterativeGravityExplanation">
			<div class="paragraphWrapper">
				<p>
				We propose 30 HSR rail lines with an Iterative Gravity Model.
				This model is a modification we made to the Gravity Model presented in City Nerd's youtube video <a href="https://www.youtube.com/watch?v=wE5G1kTndI4">"56 High Speed Rail Links We Should've Built Already."</a>
				Highly recommend checking out his video as it was the inspiration for our time triangle and iterative gravity model.
				The gravity model as he presented is modeled after the equation for gravity. ADD MORE
				<br>
				We feel it is necessary to expand on this basic gravity model in two ways:
				</p>
				<ol>
					<li>
						For the attractive force instead of using population as a proxy for where people want to travel to instead use a figure that isn't a proxy - total annual passengers from US flight data.
					</li>
					<li>
						Is to make the model aware of already proposed rail. <br>
						To explain what we mean for the model to be aware consider a hypothetical when deciding where I should put a new HSR connection when some lines are already proposed.
						Suppose New York City to Boston was already proposed. 
						Now the model is considering connecting Washington DC to Boston.
						Our first issue with the basic gravity model is when it computes the score for connecting Washington DC to Boston is considers building a line the entire way when only building to New York City is required.
						The second thing we feel is an issue with the basic model is it doesn't take into consideration the fact that not only did I connect Washington DC to Boston I also connected Boston to New York City.
						<br><br>
						The Iterative Gravity model fixes both of these issues by first considering the direct connection and all possibilities of connecting two cities using existing rails. Secondly the score is now the sum of all scores for all the newly connected cities divided by the length of newly built rail line built.
					</li>
				</ol>
			</div>
		</div>

		<h2>Results</h2>
		<h2>Proposed HSR</h2>
		<div class="infoMap" id="proposedHSRMap">
			<MapStatic map={usaGeoContig} cities={GravTopRes} cityCordMap={cityCordMap} dims={[975,610]}/>
			<!-- <FinalMapDisplay highlightedRoute={highlightedRouteRail}/> -->
		</div>
		
		<h2>Intersection with current rail</h2>

		<p>The United states currently has no functional high speed rail. The fastest train in the US, Amtrak's Acela line, top speed of 160 MPH (257 km/hr) meets the International Union of Railways definition of travel at least 155 MPH (250 km/hr). However, the Acela average speed of 70 MPH (113 km/hr) does not meet the required average speed of 124 MPH (200 km/hr)</p>
		<p>Consider making the above information partly into a table? Comparing speeds?</p>
		<div class="infoMap" id="railIntersection">
			<RailMapIntersect map={usaGeoContig} cities={GravTopRes} cityCordMap={cityCordMap} cityAmtrakRouteMap={cityAmtrakRouteMap} dims={[800,500]}/>
			<RailMap map={usaGeoContig} railMap={amtrakMapSimp} cityCordMap={cityCordMap} citiesPlotSet={citiesPlotSet} dims={[800,500]}/>
			<!-- <RouteDisplay highlightedRoute={highlightedRouteRail}/> -->
			<!-- <Comparison Bar Chart/> -->
		</div>

		<h2>What Now?</h2>
		<p>Want to learn more? go to these resources @cityNerd</p>
		<p>Want to play around with the data or learn more in depth about our computational model? click <a href="https://github.com/DustinLin/datavisTrainsPlanes">here</a>.</p>
		<p>Want to show others? takes these steps: Share our and other resources with others</p>
		
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

	.barChart {
		gap: 2em;
	}

	.histogram {
		gap: 2em;
	}
</style>
