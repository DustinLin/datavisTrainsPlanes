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

// idk if this one needed tbh
export let cityStToPair = (city, state) => {
	return `${city}_${state}`
}

