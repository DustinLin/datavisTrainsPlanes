/**
 * contain useful functions for data parsing?
 */

export let SECURITY_TIMES = {
	'plane': 120,
	'train': 15,
	'car': 0 
}

export let TRAVEL_TO_AND_FROM_TIMES = {
	'plane': 60,
	'train': 45,
	'car': 0
}


export let planeTime = (distance) => {
	return 44.5957 + 0.117441 * distance
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
	const delta = 10;
	const intercept = lineFunction(0);
	const slope = (lineFunction(delta) - intercept) / delta;
	return 1/slope * ((y) - intercept);
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

export let formateCityTuple = (cityPair) => {
	return cityPair.map(pair => {
		const [city, state] = pair.split('_');
		return `${city}, ${state}`;
	});
}

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
	//console.log(`lowerX: ${cutoffs.triangleLower}, lowerTime: ${lowerTime}, upperX: ${cutoffs.triangleUpper}, upperTime: ${upperTime}, flightTime: ${flightTime}, bool value: ${(flightTime <= lowerTime) && (flightTime >= upperTime)}`)
	//console.log("lower and upper time")
	//console.log(lowerTime)
	//console.log(upperTime)
	return (flightTime >= lowerTime) && (flightTime <= upperTime)
}


/**
 * @param {*} number the number that should be rounded
 * @param {*} place number of place to round the result two. e.g. (place = 1; nearest whole number) (place = 0.1; nearest 0.1)
 */
export let roundUp = (number, place) => {
	return Math.ceil(number / place) * place
}

/**
 * @param {*} number the number that should be rounded
 * @param {*} place number of place to round the result two. e.g. (place = 1; nearest whole number) (place = 0.1; nearest 0.1)
 */
export let roundDown = (number, place) => {
	return Math.floor(number / place) * place
}

export let convertString = (input) => {
	const pairs = cityPairsToCities(input)
	const formattedPairs = formateCityTuple(pairs)
	return formattedPairs.join('\n to \n');
}

export let planeToTrain = (rowData, timeUnitConversion) => {
	const flightTime = rowData.AVG_TOTAL_TIME * timeUnitConversion;
	if (inTriangle(flightTime)) {
		const distance = computeInverse(planeTotalTime, flightTime)
		return trainTotalTime(distance) / timeUnitConversion
	}
	else {
		return flightTime / timeUnitConversion
	}
	
	
}
