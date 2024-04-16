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
	'train': 60,
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
	return planeTime(distance) + SECURITY_TIMES.plane + TRAVEL_TO_AND_FROM_TIMES.plane
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

export let cutoffs = {
	triangleUpper: 451.75,
	triangleLower: 75.25,
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
	return true;
}
