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
	import MapStatic from './MapStatic.svelte';
	import RailMapIntersect from './RailMapIntersect.svelte';
	import Histogram from './Histogram.svelte';

	import { cutoffs, cityPairsToCities, roundTo, trainTime, planeTotalTime, VIS_PROPERTIES,
			inTriangle, planeTimeToTotalTime, planeToTrain, roundUp,
			TRAVEL_TO_AND_FROM_TIMES, SECURITY_TIMES, convertString
	} from '../utils';
	


	const trainColor = ""
	// data comes from the load function in +page.js
	export let data;

	// init data being passed in
	const usaGeoContig = data.dataPayload.usaGeo;
	const cityCordMap = data.dataPayload.cityCordMap;
	const amtrakMap = data.dataPayload.amtrakMap;
	const filteredCityPairToInfo = data.dataPayload.filteredCityPairToInfo;
	const amtrakMapSimp = data.dataPayload.amtrakMapSimp;
	const cityAmtrakRouteMap = data.dataPayload.cityAmtrakRouteMap;
	const gravityTopResRoutes = data.dataPayload.gravityTopResRoutes

	/* making sure data loads properly

	console.log(`there are many states: ${usaGeoContig.features.length}`)
	console.log(`There are many cities in the cord map: ${Object.keys(cityCordMap).length}`)
	console.log(`there are many amtrak routes: ${amtrakMap.features.length}`)
	console.log(`there are many city pairs: ${filteredCityPairToInfo.length}`)
	console.log(`we are builing the top ${gravityTopResRoutes[0].length} grav rail routes`)

	*/




	// for keeping track of which route was highlighted
	// idea is to pass highlightedRoute to some other component
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

	// prob some duplicate computation here

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
	//console.log('group size', groupSize)
	const maxTime = roundUp(d3.max(cityPairToTime, d => d[1].AVG_TOTAL_TIME), groupSize)
	for (let i = 0; i <= maxTime; i += groupSize) {
		histogramThresholds.push(i);
	}

	// const maxBinSize = d3.max(bins, (d) => d3.sum(d, (l) => l[1].NUM_DEPARTURES))
	const maxBinSize = 1.7 * 1000 * 1000 // TODO: fix this so it isn't hard coded

	//console.log('group size', groupSize)

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



	// data for each step bar chart
	let averageTotalTime = d3.mean(cityPairToTime.map(([pair, info]) => info.AVG_TOTAL_FLIGHT_TIME));
	let averageAirTime = d3.mean(cityPairToTime.map(([pair, info]) => info.AVG_AIR_TIME));
	let averageExtraTime = averageTotalTime - averageAirTime;

	/*
	console.log("new time length");
	console.log(trianglePairsNewTime.length);

	console.log("avg total time: ", averageTotalTime);
	console.log("avg air time: ", averageAirTime);
	console.log("avg extra time: ", averageExtraTime);
	*/

	const timeFeature = 'time'
	let flyTimeBreakdown = [['Travel to/from airport', {time: TRAVEL_TO_AND_FROM_TIMES['plane']}], 
				['Time in Airport', {time: SECURITY_TIMES.plane }], 
				['Average Airplane Time on Ground', {time: averageExtraTime * timeUnitConversion}], 
				['Average Airplane Time in Air', {time: averageAirTime * timeUnitConversion}]];

	const totalTime = d3.sum(flyTimeBreakdown, (d) => d[1][timeFeature])

	flyTimeBreakdown.push(['Plane Total Time', {time: totalTime}])

	let averagePlaneTimeInTriangle = d3.mean(trianglePairsOldTime.map(([pair, info]) => info.AVG_TOTAL_FLIGHT_TIME));
	let averageTrainTimeInTriangle = d3.mean(trianglePairsNewTime.map(([pair, info]) => info.AVG_TOTAL_TIME));
	let averageAirTimeInTriangle = d3.mean(trianglePairsOldTime.map(([pair, info]) => info.AVG_AIR_TIME));
	let averageExtraTimeInTriangle = averagePlaneTimeInTriangle - averageAirTimeInTriangle;


	let planeInfo = [
		['Travel to/from airport', {time: TRAVEL_TO_AND_FROM_TIMES['plane']}],
		['Time in Airport', {time: SECURITY_TIMES.plane }],
		['Average Airplane Time on Ground', {time: averageExtraTimeInTriangle * timeUnitConversion}], 
		['Average Airplane Time in Air', {time: averageAirTimeInTriangle * timeUnitConversion}]
	]
	
	const planeTotal = d3.sum(planeInfo, (d) => d[1][timeFeature])

	planeInfo.push(['Plane Total Time', {time: planeTotal}])

	let trainInfo = [
		['Travel to/from train station', {time: TRAVEL_TO_AND_FROM_TIMES['train'], color: VIS_PROPERTIES.TRAIN_COLOR}],
		['Time in station', {time: SECURITY_TIMES.train, color: VIS_PROPERTIES.TRAIN_COLOR }],
		['Average Train Startup Time', {time: trainTime(0), color: VIS_PROPERTIES.TRAIN_COLOR}],
		['Average Train Travel Time', {time: averageTrainTimeInTriangle * timeUnitConversion - trainTime(0), color: VIS_PROPERTIES.TRAIN_COLOR}]
	]
	
	const trainTotal = d3.sum(trainInfo, (d) => d[1][timeFeature])


	trainInfo.push(['Train Total Time', {time: trainTotal, color: VIS_PROPERTIES.TRAIN_COLOR}])
	
	const bigKahuna = []
	const nothingBurger = planeInfo.map(function(e, i) {
		bigKahuna.push(e);
		bigKahuna.push(trainInfo[i]);
		return [e, trainInfo[i]];
	});


		

</script>

<div class="container">
	<div class="pageHeader">
		<h2>High Speed Rail (HSR) in the US</h2>
	</div>


	<div class="main">
		<h2>How do people travel long distances in the US?</h2>

		<div class="paragraphWrapper">
		<p>
			One of the most common, and seemingly most convenient, ways to travel long distances within the United States is by flying. In 2023, there were {filteredCityPairToInfo.length} unique flight routes within the continental US. 
			There are typically several flight options to travel between any two cities in the US that make flying an easy, flexible option. 
			In comparison, driving several hours is often not a viable option, especially for weekend trips, where time spent driving would nearly equal time spent at the actual destination. 
			Currently, options for rail travel are limited in many parts of the country and, due to the lack of high speed rail (HSR) in the US, taking a train does not save significant time compared to driving.
		</p>
		</div>

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


			<div class="stackBox">
			<RouteDisplay id="totalFlightRoutesDisplay" highlightedRoute={hRoutes["highlightedRouteAll"]}/>
			</div>
		</div>

		<!-- intro paragraph ab how ppl usually fly places-->

		<!-- component -->
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
		<div class="paragraphWrapper">
			The bar chart on the left shows the average time for each step involved in flying. The histogram on the right displays the distribution of total travel times for all 2023 flights within the continental US.
		</div>

		<div class="infoMap" id="airlineTimes">
			<!-- <p>idea to put a barchart that outlines different histogram that haneen made here as well as a bar chart the breaks down the flying time, maybe could give a few flight examples<p/> -->
			<BarChart dataset={flyTimeBreakdown} feature={timeFeature} yLabel={"Travel Time Breakdown"} xLabel={"Time (in minutes)"} color={'#88aed0'} roundValue={100} minDimSize={minBarDims}/> 

			<Histogram dataset={cityPairToTime} yLabel={"Number of Flights in 2023"} xLabel={"Total Time (in hours)"} color={'#88aed0'} triangleColor={'#88aed0'} thresholds={histogramThresholds} maxBinSize={maxBinSize} minDimSize={minMapDims}/> 
		</div>

		<!-- paragraph after bar chart of travel time breakdown that explains all the extra time spent when flying-->
		<div class="paragraphWrapper">
			<p>
				Besides the time spent in the air on a plane, there are several additional steps involved in air travel that, in total, can add hours to a trip. 
				One major inconvenience associated with flying is the TSA — the restrictions and the time it takes to go through TSA security at the airport. 
				Security lines can be very long, especially when the airport is very busy. 
				Since no one can anticipate how long the wait in the security line will be, TSA recommends that people arrive at the airport two hours before their flight. 
				Thus, even if the security line is short, travelers may still end up spending over an hour at the airport waiting to board. 
				Additionally, commuting to and from the airport often totals to an hour or more. 
				Finally, although the actual air travel is fast, passengers also end up spending significant time on the airplane before takeoff and after landing for taxiing, boarding, preparing the cabin for takeoff and delays.
			</p>
		</div>


		<h2>Is there a faster way?</h2>

		<!-- paragraph before time triangle that introduces HSR-->
		<div class="paragraphWrapper">
		<p>
			When factoring in time spent waiting at the airport or on the plane, along with time it takes to get to and from the airport, there are indeed faster alternatives to flying for certain distances of travel. 
			For example, the fastest way to get across the world is flying, while the fastest way to get to the other side of town is likely to drive. 
			Traveling a distance between these two extremes lends itself to rail travel, specifically high speed rail (HSR). 
			The fastest train in the US, Amtrak's Acela line, has an average speed of 70 MPH (113 km/hr). 
			This does not meet the required average speed of 124 MPH (200 km/hr) to be classified as "high speed." 
			Thus, the United States currently has no functional HSR, despite the prevalence and success of HSR in many other nations including Japan and several European countries such as the UK, France, Italy, and Germany. 
		</p>
		</div>


		<!-- paragraph explaining time triangle that goes next to it-->

		<div class="infoMap" id="timeTriangle">

			<!-- paragraph explaining time triangle that goes next to it-->
			<p class="paragraphWrapper" id="timeTriangleText">

				To assess the potential benefits of implementing HSR in the US, we first determine the range of distances within which the fastest mode of travel would be HSR. 
				To calculate this sweet spot, we find a line of best fit for each of the three considered modes of transportation (car, HSR, and plane) and plot them on the graph shown on the right. 
				We call the area formed by the intersection of these lines the “Time Triangle,” which is plotted to the right. 
				The Time Triangle indicates that for distances between {roundTo(cutoffs.triangleLower, 0.1)} miles and {roundTo(cutoffs.triangleUpper, 0.1)} miles (indicated by the solid grey lines), HSR is the fastest mode of transportation when factoring in all the main steps included with each method of travel. 
				These distances correspond to total travel times of {roundTo(planeTotalTime(cutoffs.triangleLower), 0.1)} minutes ({roundTo(planeTotalTime(cutoffs.triangleLower), 0.1) / timeUnitConversion} hours) and {roundTo(planeTotalTime(cutoffs.triangleUpper), 0.1)} minutes ({roundTo(planeTotalTime(cutoffs.triangleUpper), 0.1) / timeUnitConversion} hours) including all steps of flight travel, respectively (these are indicated by the dashed grey lines in the graph). We show the airline routes that would be traveled faster on HSR on the map below. 
			</p>
			
			<TimeTriangle/>

			<div class="stackBox">
			<div class="swatches">
			<!-- creating a swatch for each color in the scale -->
			<div class="swatch">
				<!-- also set color inside the html-->
				<div class="square" style:background-color={VIS_PROPERTIES.PLANE_COLOR} > </div>
				<div class="swatch-text">Planes</div>
			</div>
			<div class="swatch">
				<!-- also set color inside the html-->
				<div class="square" style:background-color={VIS_PROPERTIES.TRAIN_COLOR} > </div>
				<div class="swatch-text">HSR</div>
			</div>
			<div class="swatch">
				<!-- also set color inside the html-->
				<div class="square" style:background-color={VIS_PROPERTIES.CAR_COLOR} > </div>
				<div class="swatch-text">Cars</div>
			</div>

		</div>

		</div>
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


			<div class="stackBox">
			<RouteDisplay highlightedRoute={hRoutes["highlightedRouteTriangle"]}/>
			<BarChart dataset={triangleRouteCities} feature={"PASSENGERS"} xLabel={"Passengers (millions)"} color={'#88aed0'} roundValue={100} orientation={"horizontal"} unitConversion={populationConversion} firstX={10} stringFormatter={convertString} minDimSize={minBarDims} id="stkBarChartPass" sort={false}/> 
			</div>

			</div>
		</div>
		
		<div class="paragraphWrapper">
		<p>The left histogram below shows the distribution of total flight times for all flights in 2023, with the flights that fall within our Time Triangle highlighted in green.
			The right histogram below shows the theoretical distribution of total travel times when HSR is taken for these Time Triangle flights instead.</p>
		</div>


		<div class="infoMap" id="modifiedHistograms">
			<!-- <Comparison Bar Chart/> -->
			<Histogram dataset={cityPairToTime} xLabel={"Total Travel Time when Flying (hours)"} yLabel={"Number of Trips"} color={'#88aed0'} triangleColor={'#cfe6ce'} timeUnitConversion={timeUnitConversion} thresholds={histogramThresholds} maxBinSize={maxBinSize} minDimSize={minMapDims}/> 

			<Histogram dataset={cityPairToTime} xLabel={"Total Travel Time After HSR is Built)"} yLabel={"Number of Trips"} color={'#88aed0'} triangleColor={'#cfe6ce'} providedAccessorFunction={planeToTrain} timeUnitConversion={timeUnitConversion} thresholds={histogramThresholds} maxBinSize={maxBinSize} minDimSize={minMapDims}/> 

		</div>

		<div class="paragraphWrapper">
			<p>The below bar chart compares the travel time breakdown for flights and HSR for the Time Triangle distances.</p>
		</div>

		<div class="infoMap" id="comparisonBarChart">
			<BarChart dataset={bigKahuna} feature={timeFeature} xLabel={"Time (minutes)"} color={'#88aed0'} roundValue={100} orientation={"vertical"} timeUnitConversion={timeUnitConversion} minDimSize={minBarDims}/> 
		</div>
			

		<h2>Which of these HSR routes should we build first?</h2>
			<div class="paragraphWrapper">
				<p>
				To determine which of the potential rail lines would have the most impact, and thus should be focused on first, we built a mathematical model called an Iterative Gravity Model.
				Based on our model we propose 30 HSR lines. We note that our model was influenced by the Gravity Model presented in a YouTube video by CityNerd titled <a href="https://www.youtube.com/watch?v=wE5G1kTndI4">"56 High Speed Rail Links We Should've Built Already."</a>
				Highly recommend checking out his video as it was the inspiration for our time triangle and iterative gravity model.
				The gravity model as he presented is modeled after the <a href="https://en.wikipedia.org/wiki/Newton's_law_of_universal_gravitation">
				equation for gravity</a>. CityNerd calculates the gravity score by multiplying the population of the 2 cities, and divides by the distance between them squared. This mimics the equation for gravity by relating the "mass" of the two objects with the population of cities.
				<br>
				We improve upon this basic gravity model in two ways:
				</p>
				<ol>
					<li>
						For the part of the equation representing “attractive force,” instead of using population as a proxy for where people want to travel, we use an actual figure that represents this: total annual passengers from US flight data.
					</li>
					<li>
						Our model is aware of already proposed rail when determining where rail should be placed next. <br>
						Consider the following hypothetical: 
						Suppose rail between New York City and Boston was already proposed, and now the model is considering connecting Washington, D.C. to Boston.
						The basic gravity model, when computing the score for connecting Washington, D.C. to Boston, considers building a line the entire way from Washington, D.C. to Boston. However, only building rail between
						Washington, D.C. and New York City is required since New York City and Boston have already been connected by HSR. In addition, if we connect Washington, D.C. to Boston, we also are also connecting Washington, D.C. to New York City so we should get the score for both of these, which the basic gravity model does not account for.
						<br><br>
						The Iterative Gravity model fixes both of these awareness issues by first considering the direct connection and all possibilities of connecting two cities using existing rails. Secondly, the score is now the sum of all scores for all the newly connected cities divided by the length of newly built rail line built.
					</li>
				</ol>
			</div>

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
		<div class="paragraphWrapper">
		<p>
			As explained above the Amtrak it does not meet the qualification for HSR. 
			Nonetheless, we can use the locations of these rail lines to make development of HSR cheaper by saving on clearing costs.
			The below maps compare our proposed HSR routes and the existing Amtrak rail lines, all the cities identified with our Iterative Gravity Model are labeled.
		</p>
		</div>

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

		<div class="paragraphWrapper">

		<p>Want to learn more? go to these resources @cityNerd</p>
		<p>Want to play around with the data or learn more in depth about our computational model? click <a href="https://github.com/DustinLin/datavisTrainsPlanes">here</a>.</p>
		<p>Want to show others? takes these steps: Share our and other resources with others</p>

		</div>
		
	</div>
</div>


<style>
	/* Old styling */
	.paragraphWrapper {
		background-color: #ffffff;
		/* rounded corners and padding to make more roomy */
		border-radius: 2em;
		padding: 1em;
	}

	h2 {
		/* add more space between each section by padding upper? */
		padding-top: 2em;
	}
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

	.pageHeader {
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
		width: 100vw;
		min-height: 500px;
		padding: 0.5em;
		gap: 0.5em;
	}
	.maps {
		height: 100vh;
		width: 100%;
	}
	.stackBox {
		/* create a vertical stacking */
		gap: 2em;
		height: 100%; /* take 100% height from parent */
		display: flex;
		flex-direction: column;
	}

	.histogram {
		gap: 2em;
	}
	#stkBarChartPass {
		height: calc(75% - 2em)
	}

	#timeTriangleText {
		width: 50%;
	}

	#totalFlightRoutesDisplay {
		height: 25%
	}

	:global(body){
		background: #f0fcf1;
	}

	.swatches {
		gap: 0.5em; /* adding some space between the <div>s inside swatches */
		padding-left: 0.5em;
	}

	.swatch {
		display: flex;
		align-items: center;
		gap: 0.25em; /* adding some space between the <div>s inside swatch */
	}

	.swatch-text {
		font-size:13px
	}

	.square {
		width: 15px;
		height: 15px;
	}
</style>
