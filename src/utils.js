/**
 * contain useful functions for data parsing?
 */

const SECURITY_TIMES = {
	'plane': 120,
	'train': 15,
	'car': 0 
}

const TRAVEL_TO_AND_FROM_TIMES = {
	'plane': 60,
	'train': 45,
	'car': 0
}

export const MOCK_DATA = [ [ "(Boston_MA, New York_NY)",
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


// cities to render around, hard coded?
const CITY_COLLISIONS = [
	"Seattle_WA",
	"Austin_TX",
	"Grand Rapids_MI",
	"Nashville_TN",
	"Knoxville_TN",
	"Asheville_TN",
	"Huntsville_TN"
]

/**
 * Hard coding city name placements to move them around to look nicer
 * @param {string} city 
 * @param {function} projection 
 * @param {map} cityCordMap 
 * @returns  [x,y] cords
 */
export const cityNamePlacement = (city, projection, cityCordMap) => {
	if (city === "Asheville_NC") {
		return [
		projection(cityCordMap[city].COORD)[0] + 5 ,
		projection(cityCordMap[city].COORD)[1] - 7
		]
	}

	if (city === "Huntsville_AL") {
		return [
		projection(cityCordMap[city].COORD)[0] - 50 ,
		projection(cityCordMap[city].COORD)[1] - 7
		]
	}

	if (CITY_COLLISIONS.includes(city)){
		return [
		projection(cityCordMap[city].COORD)[0] + 5,
		projection(cityCordMap[city].COORD)[1] - 10
		]
	} else {
		return [
		projection(cityCordMap[city].COORD)[0] + 4,
		projection(cityCordMap[city].COORD)[1] + 4
		]
	}
}




// based on: https://colorbrewer2.org/?type=qualitative&scheme=Paired&n=10
// ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a']

export const VIS_PROPERTIES = {
	MAP_COLOR: "#d3d3d3",

	CITY_CIRCLE_R: 5,
	// light shade of red
	CITY_CIRCLE_COL: "#737373", //"#fb9a99",

	ROUTE_STROKE_COL: "#b5b5b5", //"#5eaee4",
	ROUTE_STROKE_WID:  0.75,

	// highlighted route colors
	HL_CIRC_COLOR: "#e31a1c", // more saturated red compared to above
	HL_CIRC_R: 5,
	HL_ROUTE_STROKE_WID: 1.5,
	HL_ROUTE_STROKE_COL: "#5eaee4", // more saturated blue compared to reg route

	HSR_ROUTE_COL: "#cc6600",//"#ff7800",
	LINE_OPACITY: 0.6,

}

export let planeTime = (distance) => {
	return 44.5957 + 0.117441*distance
}

export let carTime = (distance) => {
	return 30 + (60 / 55) * distance
}

export let trainTime = (distance) => {
	return (25 + 0.36 * distance)
}

export let createDatapoints = (functionToPlot, maxDistance, xScale, yScale) => {
	const pointNum = 500;
	const data = [];
	const step = maxDistance / 500
	for (let x = 0; x <= maxDistance; x += step) {
	  const y = functionToPlot(x);
	  data.push([xScale(x), yScale(y)])
	}
	return data;
}


/**
 * 
 * @param {*} distance : distance in miles being traveled
 * @returns the time it takes to travel distance x on a plane while accounding for non-riding travel times
 */
export let planeTotalTime = (distance) =>  {
	return planeTimeToTotalTime(planeTime(distance));
}

/**
 * 
 * @param {*} time : time for just the flight
 * @returns : the expected total time of the flight
 */
export let planeTimeToTotalTime = (time) => {
	return time + SECURITY_TIMES.plane + TRAVEL_TO_AND_FROM_TIMES.plane;
}

/**
 * 
 * @param {*} distance : distance in miles being traveled
 * @returns the time it takes to travel distance x on a train while accounding for non-riding travel times
 */
export let trainTotalTime = (distance) => {
	return trainTime(distance) + SECURITY_TIMES.train + TRAVEL_TO_AND_FROM_TIMES.train
}

/**
 * 
 * @param {*} distance : distance in miles being traveled
 * @returns the time it takes to travel distance x in a car while accounding for non-riding travel times
 */
export let carTotalTime = (distance) => {
	return carTime(distance) + SECURITY_TIMES.car + TRAVEL_TO_AND_FROM_TIMES.car
}
/**
 * 
 * @param {*} line1 : a function of a line that takes in a single x input
 * @param {*} line2 : a function of a line that takes in a single x input
 * @returns returns the x value at where the two lines intersect
 */
export let computeIntersection = (line1, line2) => {
	const delta = 10
	const intercept1 = line1(0)
	const slope1 = (line1(delta) - intercept1) / delta

	const intercept2 = line2(0)
	const slope2 = (line2(delta) - intercept2) / delta
	return (intercept1 - intercept2) / (slope2 - slope1)
}

/**
 * 
 * @param {*} lineFunction : linear function to compute the inverse of
 * @param {*} y : y value for the desired x value
 * @returns the solution for x of the equation y = mx + b
 */
export let computeInverse = (lineFunction, y) => {
	const delta = 10
	const intercept = lineFunction(0)
	const slope = (lineFunction(delta) - intercept) / delta
	return 1/slope * (y) - intercept
}

export let cutoffs = {
	triangleUpper: computeIntersection(trainTotalTime, planeTotalTime), // intersection of train with plane
	triangleLower: computeIntersection(carTotalTime, trainTotalTime), // intersection of train with car
	carPlaneIntersection: computeIntersection(carTotalTime, planeTotalTime),
	topRoutesNumber: 100,
	topGravNumber: 30
}

/**
 * eg: "(Boston_MA, Los Angeles_CA)", returns "["Boston_MA", "Los Angeles_CA"]
 * useful for working with Jack plane routes data
 */
export let cityPairsToCities = (cityPair) => {
  return cityPair.slice(1, -1).split(", ");
};

/**
 * eg: "Los Angeles_CA", returns "Los Angeles"
 * useful for working with `cityCordMap.json` data, which encodes city+state names to avoid duplicated
 */
export let cityStToCity = (cityStStr) => {
	return cityStStr.split("_")[0]
}

/**
 * eg: "Los Angeles_CA", returns "CA"
 * useful for working with `cityCordMap.json` data, which encodes city+state names to avoid duplicated
 */
export let cityStToState = (cityStStr) => {
	return cityStStr.split("_")[1]
}

// simple string operation but is being used
export let cityStToPair = (city, state) => {
	return `${city}_${state}`
}


// adding commas so large numbers are more readable
export let numberWithCommas = (x) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// add a function to convert seconds to hours (+ 1 decimals?) for flight data
// need a param for the total num of flights performed since it's cumulative
export let minToHours = (time, numFlights) => {
	return ((time/numFlights)/60).toFixed(1)
}

// function for coloring bars in histogram based on time triangle
export let inTriangle = (flightTime) => {
	const lowerTime = planeTotalTime(cutoffs.triangleLower)
	const upperTime = planeTotalTime(cutoffs.triangleUpper)
	console.log(`lowerX: ${cutoffs.triangleLower}, lowerTime: ${lowerTime}, upperX: ${cutoffs.triangleUpper}, upperTime: ${upperTime}, flightTime: ${flightTime}, bool value: ${(flightTime <= lowerTime) && (flightTime >= upperTime)}`)
	return (flightTime >= lowerTime) && (flightTime <= upperTime)
}
