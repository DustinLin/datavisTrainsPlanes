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

	import { cutoffs, cityPairsToCities, roundTo, planeTime, trainTime, planeTotalTime, computeInverse, trainTotalTime, VIS_PROPERTIES   } from '../utils';
	import {inTriangle, planeTimeToTotalTime, planeToTrain, roundUp} from '../utils.js';
	import {TRAVEL_TO_AND_FROM_TIMES, SECURITY_TIMES, convertString} from '../utils.js';

	import Histogram from './Histogram.svelte';


	const trainColor = ""
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

	// total of 3 hover maps: one for all the routes, one for top popular routes, one for routes in triangle
	let hRoutes = {
		highlightedRouteAll: null,
		highlightedRoutePopular: null,
		highlightedRouteTriangle: null,
		// for hovering on the scroll visual
		highlightedRouteBuilt: null, // this property will simply be a city pair string
	}

	function onhover(route, vis){
		// set params for route
		if (route === null) {
			hRoutes[vis] = null
		} else {
			// interesting that these print statements end up printing on the web browser/client side, not sure why
			//console.log(`hovering over route ${route}`)
			hRoutes[vis] = route
		}
	}

	// filtering top routes to show in vis
	let GravTopRes = gravityTopResRoutes[0].slice(0, cutoffs.topGravNumber)

	// doing some route processing to plot certain routes on different <Map>
	let allRouteCities = filteredCityPairToInfo

	let minMapDims = [500, 500];

	let minBarDims = [500, 400];


	let triangleRouteCities = filteredCityPairToInfo.filter(route => 
		route[1].DISTANCE >= cutoffs.triangleLower && route[1].DISTANCE <= cutoffs.triangleUpper
	)

	console.log(`there is a diff between all routes and triangle routes: ${allRouteCities.length}, ${triangleRouteCities.length}`)
	const populationConversion = 1000 * 1000

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
                                {AVG_TOTAL_TIME: trainTime(info.DISTANCE) / timeUnitConversion, 
				DISTANCE: info.DISTANCE,
                                NUM_DEPARTURES: info.NUM_DEPARTURES}]);


	console.log("new time length");
	console.log(trianglePairsNewTime.length);

	// data for each step bar chart
	let averageTotalTime = d3.mean(cityPairToTime.map(([pair, info]) => info.AVG_TOTAL_FLIGHT_TIME));
	let averageAirTime = d3.mean(cityPairToTime.map(([pair, info]) => info.AVG_AIR_TIME));
	let averageExtraTime = averageTotalTime - averageAirTime;

	// let withTrainAverageTime = d3.mean(cityPairToTime, ([pair, info]) => planeToTrain(info));

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

	flyTimeBreakdown.push(['Plane Total Time', {time: totalTime}])

	let averagePlaneTimeInTriangle = d3.mean(trianglePairsOldTime.map(([pair, info]) => info.AVG_TOTAL_FLIGHT_TIME));
	let averageTrainTimeInTriangle = d3.mean(trianglePairsNewTime.map(([pair, info]) => info.AVG_TOTAL_TIME));
	let averageAirTimeInTriangle = d3.mean(trianglePairsOldTime.map(([pair, info]) => info.AVG_AIR_TIME));
	let averageExtraTimeInTriangle = averagePlaneTimeInTriangle - averageAirTimeInTriangle;

	// console.log('testing 123', trianglePairsOldTime)
	console.log('times', averagePlaneTimeInTriangle, averageTrainTimeInTriangle)
	// if (averageTrainTimeInTriangle > averagePlaneTimeInTriangle) {
	// 	console.log('times', averagePlaneTimeInTriangle, averageTrainTimeInTriangle)
	// 	throw Error("planes went faster")
	// }
	

	let planeInfo = [
		['Travel to/from airport', {time: TRAVEL_TO_AND_FROM_TIMES['plane']}],
		['Time in Airport', {time: SECURITY_TIMES.plane }],
		['Average Airplane Time on Ground', {time: averageExtraTimeInTriangle * timeUnitConversion}], 
		['Average Airplane Time in Air', {time: averageAirTimeInTriangle * timeUnitConversion}]
	]
	
	const planeTotal = d3.sum(planeInfo, (d) => d[1][timeFeature])
	console.log('the total for planes', planeTotal)

	planeInfo.push(['Plane Total Time', {time: planeTotal}])

	let trainInfo = [
		['Travel to/from train station', {time: TRAVEL_TO_AND_FROM_TIMES['train'], color: VIS_PROPERTIES.TRAIN_COLOR}],
		['Time in station', {time: SECURITY_TIMES.train, color: VIS_PROPERTIES.TRAIN_COLOR }],
		['Average Train Startup Time', {time: trainTime(0), color: VIS_PROPERTIES.TRAIN_COLOR}],
		['Average Train Travel Time', {time: averageTrainTimeInTriangle * timeUnitConversion - trainTime(0), color: VIS_PROPERTIES.TRAIN_COLOR}]
	]
	
	console.log(trainInfo)
	const trainTotal = d3.sum(trainInfo, (d) => d[1][timeFeature])
	console.log('the total for trains', trainTotal)


	trainInfo.push(['Train Total Time', {time: trainTotal, color: VIS_PROPERTIES.TRAIN_COLOR}])
	
	const bigKahuna = []
	const nothingBurger = planeInfo.map(function(e, i) {
		bigKahuna.push(e);
		bigKahuna.push(trainInfo[i]);
		return [e, trainInfo[i]];
	});


		

</script>

<div class="container">
	<div class="header">
		<h3>High Speed Rail (HSR) in the US</h3>
	</div>


	<div class="main">
		<h2>How do people travel long distances in the US?</h2>
		<div class="infoMap" id="allRoutes">
			<Map
				map={usaGeoContig} 
				cities={allRouteCities} 
				cityCordMap={cityCordMap} 
				showCityName={false} 
				dims={minMapDims}
				onhover={onhover} 
				highlightedRoute={hRoutes["highlightedRouteAll"]}
				mapId={"highlightedRouteAll"}/>
			<RouteDisplay highlightedRoute={hRoutes["highlightedRouteAll"]}/>
		</div>

		<!-- intro paragraph ab how ppl usually fly places-->
		<p>
			One of the most common, and seemingly most convenient, ways to travel relatively long distances within the United States is by flying. In 2023, there were {filteredCityPairToInfo.length} unique flight routes within the continental US. 
			There are typically several flight options to travel between any two cities in the US that make flying an easy, flexible option. 
			In comparison, driving several hours is often not a viable option, especially for short trips where time spent driving would nearly equal time spent at the actual destination. 
			Currently, options for rail travel are limited in many parts of the country and, due to the lack of high speed rail (HSR) in the US, taking a train does not save significant time compared to driving.
		</p>

		<!-- compoenent -->
		<h2>What are the popular airline routes in the US?</h2>
		<div class="infoMap" id="popularAirlines">
			<Map
				map={usaGeoContig} 
				cities={topFlightRoutesPass} 
				cityCordMap={cityCordMap} 
				onhover={onhover} 
				showCityName={true} 
				dims={minMapDims}
				highlightedRoute={hRoutes["highlightedRoutePopular"]}
				mapId={"highlightedRoutePopular"}
			/>

			<div class="stackBox">
				<RouteDisplay highlightedRoute={hRoutes["highlightedRoutePopular"]}/>
				<!-- <BarChart/> for top routes -->
				<BarChart dataset={filteredCityPairToInfo} feature={"PASSENGERS"} xLabel={"Passengers (in millions)"} color={'#88aed0'} roundValue={100} orientation={"horizontal"} unitConversion={populationConversion} firstX={10} stringFormatter={convertString} minDimSize={minBarDims} id="stkBarChartPass" sort={false}/> 
			</div>

		</div>

		<h2>How much time is spent taking these routes?</h2>
		<div class="infoMap" id="airlineTimes">
			<!-- <p>idea to put a barchart that outlines different histogram that haneen made here as well as a bar chart the breaks down the flying time, maybe could give a few flight examples<p/> -->
			<BarChart dataset={flyTimeBreakdown} feature={timeFeature} xLabel={"Total time taken (in minutes)"} color={'#88aed0'} roundValue={100} minDimSize={minBarDims}/> 

			<Histogram dataset={cityPairToTime} yLabel={"Total number of flights in a year"} xLabel={"Passengers (in millions)"} color={'#88aed0'} triangleColor={'#88aed0'} thresholds={histogramThresholds} maxBinSize={maxBinSize} minDimSize={minMapDims}/> 
		</div>

		<!-- paragraph after bar chart of travel time breakdown that explains all the extra time spent when flying-->
		<p>
			Besides the time spent in the air on a plane, there are several additional steps involved in air travel that, in total, can add hours to a trip. 
			One major inconvenience associated with flying is TSA — the restrictions and the time it takes to go through TSA security at the airport. 
			Security lines can be very long, especially when the airport is very busy. 
			Since no one can anticipate how long the wait in the security line will be, TSA recommends that people arrive at the airport two hours before their flight. 
			Thus, even if the security line is short, travelers may still end up spending over an hour at the airport waiting to board. 
			Additionally, commuting to and from the airport may total to an hour or more for people that live outside of major cities. 
			Finally, although the actual air travel is fast, passengers also end up spending significant time on the airplane before takeoff and after landing for various reasons.
		</p>

		<p>here's a bar chart of all the time it takes for each step to fly somewhere. see how much time is wasted in security</p>

		<h2>Is there a faster way?</h2>

		<!-- paragraph before time triangle that introduces HSR-->
		<p>
			When factoring in time spent waiting at the airport or on the plane, along with time it takes to get to and from the airport, there are indeed faster alternatives to flying for certain distances of travel. 
			For example, the fastest way to get across the world is flying, while the fastest way to get to the other side of town is likely to drive. 
			Traveling a distance between these two extremes lends itself to rail travel, specifically high speed rail (HSR). 
			The fastest train in the US, Amtrak's Acela line, has an average speed of 70 MPH (113 km/hr). 
			This does not meet the required average speed of 124 MPH (200 km/hr) to be classified as high speed by the International Union of Railways. 
			Thus, the United States currently has no functional HSR, despite the prevalence and success of HSR in many other nations including Japan and several European countries such as the UK, France, Italy, and Germany. 
		</p>

		<div class="infoMap" id="timeTriangle">


			<!-- paragraph explaining time triangle that goes next to it-->
			<p id="timeTriangleText">
				To assess the potential benefits of implementing HSR in the US, we first determine the range of distances within which the fastest mode of travel would be HSR. 
				To calculate this sweet spot, we find a line of best fit for each of the three modes of transportation (car, HSR, planes) considered here. 
				We call the area formed by the intersection of these lines the “Time Triangle,” which is plotted to the right. 
				The Time Triangle indicates that for distances between {roundTo(cutoffs.triangleLower, 0.1)} miles and {roundTo(cutoffs.triangleUpper, 0.1)} miles HSR is the fastest mode of transportation when factoring in all the main steps included with each method of travel. 
				These distances correspond to flight times of {roundTo(planeTotalTime(cutoffs.triangleLower), 0.1)} minutes and {roundTo(planeTotalTime(cutoffs.triangleUpper), 0.1)} minutes, respectively. We show the airline routes that would be traveled quicker using HSR below. 
			</p>
			
			<TimeTriangle/>
		</div>

		<h2>Airline routes that would be faster on HSR</h2>
		<div class="infoMap" id="fasterRoutes">
			<div class="infoMap" id="airlineSpeedUp">
				<Map 
					map={usaGeoContig} 
					cities={triangleRouteCities} 
					cityCordMap={cityCordMap} 
					onhover={onhover} 
					mapId={"highlightedRouteTriangle"}
					highlightedRoute={hRoutes["highlightedRouteTriangle"]}
					showCityName={false} 
					dims={minMapDims}/>


			<RouteDisplay highlightedRoute={hRoutes["highlightedRouteTriangle"]}/>
			</div>
		</div>
		<p>The United States currently has no functional high speed rail. The fastest train in the US, Amtrak's Acela line, top speed of 160 MPH (257 km/hr) meets the International Union of Railways definition of travel at least 155 MPH (250 km/hr). However, the Acela average speed of 70 MPH (113 km/hr) does not meet the required average speed of 124 MPH (200 km/hr)</p>
		
		<p>Here's what the time distribution of these triangle routes looks like with HSR: </p>


		<div class="infoMap" id="modifiedHistograms">
			<!-- <Comparison Bar Chart/> -->
			<Histogram dataset={cityPairToTime} xLabel={"Total Travel Time when Flying (Hours)"} color={'#88aed0'} triangleColor={'#cfe6ce'} timeUnitConversion={timeUnitConversion} thresholds={histogramThresholds} maxBinSize={maxBinSize} minDimSize={minMapDims}/> 

			<Histogram dataset={cityPairToTime} xLabel={"Total Travel time taking train when faster (Hours)"} color={'#cfe6ce'} triangleColor={'#cfe6ce'} providedAccessorFunction={planeToTrain} timeUnitConversion={timeUnitConversion} thresholds={histogramThresholds} maxBinSize={maxBinSize} minDimSize={minMapDims}/> 

		</div>

		<div class="infoMap" id="comparisonBarChart">
			<BarChart dataset={bigKahuna} feature={timeFeature} xLabel={"Time (minutes)"} color={'#88aed0'} roundValue={100} orientation={"vertical"} timeUnitConversion={timeUnitConversion} minDimSize={minBarDims}/> 
		</div>
			

		<p>The United States currently has no functional high speed rail. The fastest train in the US, Amtrak's Acela line, top speed of 160 MPH (257 km/hr) meets the International Union of Railways definition of travel at least 155 MPH (250 km/hr). However, the Acela average speed of 70 MPH (113 km/hr) does not meet the required average speed of 124 MPH (200 km/hr)</p>

		<h2>Which of the X routes should we build</h2>
		<div class="paragraphWrapper" id="iterativeGravityExplanation">
			<p>
			To determine which of the potential rail lines would be the most impact, and thus should be focused on first, we built a mathematical model called an Iterative Gravity Model.
			We propose 30 HSR lines that identified with by our model which was a modification we made to the Gravity Model presented in a YouTube video by CityNerd titled <a href="https://www.youtube.com/watch?v=wE5G1kTndI4">"56 High Speed Rail Links We Should've Built Already."</a>
			Highly recommend checking out his video as it was the inspiration for our time triangle and iterative gravity model.
			The gravity model as he presented is modeled after the equation for gravity.
			<br>
			We improve upon this basic gravity model in two ways:
			</p>
			<ol>
				<li>
					For the part of the equation representing “attractive force,” instead of using population as a proxy for where people want to travel, we use an actual figure that represents this: total annual passengers from US flight data.					</li>
				<li>
					The model is aware of already proposed rail when determining where rail should be placed next. <br>
					Consider the following hypothetical: 
					Suppose rail between New York City and Boston was already proposed, and now the model is considering connecting Washington DC to Boston.
					The basic gravity model, when computing the score for connecting Washington DC to Boston, considers building a line the entire way from Washington DC to Boston when only building to New York City is required since New York City and Boston have already been connected by HSR.
					<br><br>
					The Iterative Gravity model fixes both of these issues by first considering the direct connection and all possibilities of connecting two cities using existing rails. Secondly, the score is now the sum of all scores for all the newly connected cities divided by the length of newly built rail line built.
				</li>
			</ol>
		</div>

		<h2>Results</h2>
		<h2>Proposed HSR</h2>
		<div class="infoMap" id="proposedHSRMap">
			<MapStatic map={usaGeoContig} cities={GravTopRes} cityCordMap={cityCordMap} 
				dims={minMapDims}
				highlightedRoute={hRoutes["highlightedRouteBuilt"]}
				/>
			<TopChart railLines={gravityTopResRoutes[0]} onhover={onhover} mapId={"highlightedRouteBuilt"} />
			<!-- <FinalMapDisplay highlightedRoute={highlightedRouteRail}/> -->
		</div>
		
		<h2>Intersection with current rail</h2>

		<!-- paragraph talking ab current rail-->
		<p>
			As explained above, while Amtrak is the fastest rail in the US, it does not meet the qualification for HSR. 
			Nonetheless, we can use the locations of these rail lines to guide future plans for building HSR using the existing infrastructure. 
			The below maps show our proposed HSR routes (left) and the existing Amtrak rail lines (right), with all the cities identified with our Iterative Gravity Model labeled.
		</p>

		<div class="infoMap" id="railIntersection">
			<RailMapIntersect 
				map={usaGeoContig}
				cities={GravTopRes} 
				cityCordMap={cityCordMap} 
				cityAmtrakRouteMap={cityAmtrakRouteMap} 
				dims={minMapDims}

				/>
			<RailMap map={usaGeoContig} railMap={amtrakMapSimp} cityCordMap={cityCordMap} citiesPlotSet={citiesPlotSet} dims={minMapDims}/>
			<!-- <RouteDisplay highlightedRoute={highlightedRouteRail}/> -->
			<!-- <Comparison Bar Chart/> -->
		</div>

		<h2>What Now?</h2>
		<p>Want to learn more? go to these resources @cityNerd</p>
		<p>Want to play around with the data or learn more in depth about our computational model? click <a href="https://github.com/DustinLin/datavisTrainsPlanes">here</a>.</p>
		<p>Want to show others? takes these steps: Share our and other resources with others</p>
		
	</div>
</div>

<style>
	/* Old styling */
	.container {
		/* set the font */
		font-family: system-ui, sans-serif;
		font-size: 16px;
		/* add 32px of padding around the div */
		padding: 2em;
		/* put the controls on top of the plots with 32px of space in between */
		/* display: flex;
		flex-direction: column; */
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
		/* Creating a horizontal flex */
		display: flex;
		/* make the div take up the entire screen */
		height: 85vh;
		width: calc(100vw - 4em);
		gap: 2em;
		margin: auto;
	}


	.maps {
		height: 100vh;
		width: 100%;
	}

	.stackBox {
		/* create a vertical stacking */
		gap: 2em;
		height: 100vh;
	}

	.histogram {
		gap: 2em;
	}

	#stkBarChartPass{
		height: calc(75% - 2em)
	}

	#timeTriangleText {
		width: 50%
	}
</style>
