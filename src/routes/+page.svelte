<script>
	/**
	 * the landing page, idea is to have a giant scroll area?
	 * 
	*/

	import './style.css';
	import * as d3 from 'd3';
	import BarChart from './BarChart.svelte';

	import Map from './Map.svelte'
  	import RouteDisplay from './RouteDisplay.svelte';
	import RailMap from './RailMap.svelte';
    import TimeTriangle from './TimeTriangle.svelte';
  	import TopChart from './TopChart.svelte';
  	import RailMapSubset from './RailMapSubset.svelte';
	import MapStatic from './MapStatic.svelte';
	import RailMapIntersect from './RailMapIntersect.svelte';

	import { cutoffs, cityPairsToCities, computeInverse, trainTotalTime  } from '../utils';
	import Histogram from './Histogram.svelte';

	import {inTriangle, planeTimeToTotalTime, planeToTrain, roundUp} from '../utils.js';
	import {TRAVEL_TO_AND_FROM_TIMES, SECURITY_TIMES, convertString} from '../utils.js';


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

	let triangleRouteCities = filteredCityPairToInfo.filter(route => 
		route[1].DISTANCE >= cutoffs.triangleLower && route[1].DISTANCE <= cutoffs.triangleUpper
	)

	const populationConversion = 1000 * 1000

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


	// data processing for route times histogram 
	const timeUnitConversion = 60;
	let cityPairToTime = filteredCityPairToInfo
                             .map(([pair, info]) => 
                                [pair, 
                                {
									AVG_TOTAL_TIME: planeTimeToTotalTime(info.RAMP_TO_RAMP/info.DEPARTURES_PERFORMED) / timeUnitConversion, 
									AVG_TOTAL_FLIGHT_TIME: (info.RAMP_TO_RAMP/info.DEPARTURES_PERFORMED) / timeUnitConversion,
									AVG_AIR_TIME: info.AIR_TIME / info.DEPARTURES_PERFORMED / timeUnitConversion, 
									DISTANCE: info.DISTANCE,
									NUM_DEPARTURES: info.DEPARTURES_PERFORMED
							}]);

	let histogramThresholds = [];
	const groupSize = 30 / timeUnitConversion;
	console.log('group size', groupSize)
	const maxTime = roundUp(d3.max(cityPairToTime, d => d[1].AVG_TOTAL_TIME), groupSize)
	for (let i = 0; i <= maxTime; i += groupSize) {
		histogramThresholds.push(i);
	}

	// const maxBinSize = d3.max(bins, (d) => d3.sum(d, (l) => l[1].NUM_DEPARTURES))
	const maxBinSize = 1.7 * 1000 * 1000 // TODO: fix this so it isn't hard coded

	console.log('group size', groupSize)

	//console.log("hellooooo");
	//console.log(cityPairToTime);
	// intermediate processing to get cities that are in triangle.
	let trianglePairsOldTime = cityPairToTime
				.filter(([pair, info]) => 
				inTriangle(info.AVG_TOTAL_TIME * timeUnitConversion)); // assuming this takes in total time, in minutes

	// gets new projected time with HSR for cities that are in triangle
	let trianglePairsNewTime = trianglePairsOldTime
				.map(([pair, info]) => 
				[pair, 
                                {AVG_TOTAL_TIME: trainTotalTime(info.DISTANCE) / timeUnitConversion, 
				DISTANCE: info.DISTANCE,
                                NUM_DEPARTURES: info.NUM_DEPARTURES}]);


	console.log("new time length");
	console.log(trianglePairsNewTime.length);

	// data for each step bar chart
	let averageTotalTime = d3.mean(cityPairToTime.map(([pair, info]) => info.AVG_TOTAL_FLIGHT_TIME));
	let averageAirTime = d3.mean(cityPairToTime.map(([pair, info]) => info.AVG_AIR_TIME));
	let averageExtraTime = averageTotalTime - averageAirTime;

	let newAverageTotalTime = d3.mean(cityPairToTime, ([pair, info]) => planeToTrain(info));

	console.log("avg total time: ", averageTotalTime);
	console.log("avg air time: ", averageAirTime);
	console.log("avg extra time: ", averageExtraTime);

	const timeFeature = 'time'
	let flyTimeBreakdown = [['Travel to/from airport', {time: TRAVEL_TO_AND_FROM_TIMES['plane']}], 
				['Time in Airport', {time: SECURITY_TIMES.plane }], 
				['Average Airplane Time on Ground', {time: averageExtraTime * timeUnitConversion}], 
				['Average Airplane Time in Air', {time: averageAirTime * timeUnitConversion}]];
	console.log("example Data", flyTimeBreakdown);

	const totalTime = d3.sum(flyTimeBreakdown, (d) => d[1][timeFeature])

	flyTimeBreakdown.push(['Total Time', {time: totalTime}])

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
			<BarChart dataset={filteredCityPairToInfo} feature={"PASSENGERS"} xLabel={"Passengers (in millions)"} color={'#88aed0'} roundValue={100} orientation={"horizontal"} unitConversion={populationConversion} firstX={10} stringFormatter={convertString}/> 
		</div>

		<h2>How much time is spent taking these routes?</h2>
		<div class="infoMap" id="airlineTimes">
			<p>idea to put a barchart that outlines different histogram that haneen made here as well as a bar chart the breaks down the flying time, maybe could give a few flight examples<p/>
			<!-- <BarChart/> -->
			<Histogram dataset={cityPairToTime} xLabel={"Passengers (in millions)"} color={'#88aed0'} triangleColor={'#88aed0'} thresholds={histogramThresholds} maxBinSize={maxBinSize}/> 
		</div>

		<p>here's a bar chart of all the time it takes for each step to fly somewhere. see how much time is wasted in security</p>
		<BarChart dataset={flyTimeBreakdown} feature={timeFeature} xLabel={"Time (minutes)"} color={'#88aed0'} roundValue={100} orientation={"vertical"} timeUnitConversion={timeUnitConversion}/> 


		<h2>Is there a faster way?</h2>
		<p>introduction into the ideas of the time triangle</p>
		<div class="infoMap" id="timeTriangle">
			<p>Paragraph explaining time triangle</p>
			<TimeTriangle/>
		</div>

		<h2>Airline routes that would be faster on HSR</h2>
		<div class="infoMap" id="airlineSpeedUp">
			<Map map={usaGeoContig} cities={triangleRouteCities} cityCordMap={cityCordMap} onhover={onhover} showCityName={false} dims={[975,610]}/>
			<RouteDisplay highlightedRoute={highlightedRoute}/>

			<!-- <Comparison Bar Chart/> -->
		</div>
		<Histogram dataset={cityPairToTime} xLabel={"Total Travel Time when Flying (Hours)"} color={'#88aed0'} triangleColor={'#cfe6ce'} timeUnitConversion={timeUnitConversion} thresholds={histogramThresholds} maxBinSize={maxBinSize}/> 

		<p>Here's what the time distribution of these triangle routes looks like with HSR: </p>

		<Histogram dataset={cityPairToTime} xLabel={"Total Travel time taking train when faster (Hours)"} color={'#cfe6ce'} triangleColor={'#cfe6ce'} providedAccessorFunction={planeToTrain} timeUnitConversion={timeUnitConversion} thresholds={histogramThresholds} maxBinSize={maxBinSize}/> 

		<p>The United States currently has no functional high speed rail. The fastest train in the US, Amtrak's Acela line, top speed of 160 MPH (257 km/hr) meets the International Union of Railways definition of travel at least 155 MPH (250 km/hr). However, the Acela average speed of 70 MPH (113 km/hr) does not meet the required average speed of 124 MPH (200 km/hr)</p>
		

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
		<p>What to play around with the data? click <a href="https://github.com/DustinLin/datavisTrainsPlanes">here</a>.</p>
		<p>Want to get involved? takes these steps: Share our and other resources with others</p>
		
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
