/**
 * contain useful functions for data parsing?
 */

/**
 * eg: "(Boston, Los Angeles)", returns "["Boston", "Los Angeles"]
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
