// goal is to create a map from all the cities to coordinates, and maybe population info, preprocessing

const fs = require("fs")

const outPath = "./cityCordMap.json"
const inPath =  "./USA_Major_Cities.geojson"


/* example entry
{
  "type": "Feature",
  "properties": {
    "FID": 1,
    "NAME": "Ammon",
    "CLASS": "city",
    "ST": "ID",
    "STFIPS": "16",
    "PLACEFIPS": "1601990",
    "CAPITAL": " ",
    "POP_CLASS": 6,
    "POPULATION": 15181,
    "POP2010": 13816,
    "WHITE": 13002,
    "BLACK": 73,
    "AMERI_ES": 67,
    "ASIAN": 113,
    "HAWN_PI": 9,
    "HISPANIC": 884,
    "OTHER": 307,
    "MULT_RACE": 245,
    "MALES": 6750,
    "FEMALES": 7066,
    "AGE_UNDER5": 1468,
    "AGE_5_9": 1503,
    "AGE_10_14": 1313,
    "AGE_15_19": 1058,
    "AGE_20_24": 734,
    "AGE_25_34": 2031,
    "AGE_35_44": 1767,
    "AGE_45_54": 1446,
    "AGE_55_64": 1136,
    "AGE_65_74": 665,
    "AGE_75_84": 486,
    "AGE_85_UP": 209,
    "MED_AGE": 29.6,
    "MED_AGE_M": 28,
    "MED_AGE_F": 30.8,
    "HOUSEHOLDS": 4476,
    "AVE_HH_SZ": 3.05,
    "HSEHLD_1_M": 457,
    "HSEHLD_1_F": 648,
    "MARHH_CHD": 1618,
    "MARHH_NO_C": 1131,
    "MHH_CHILD": 106,
    "FHH_CHILD": 335,
    "FAMILIES": 3352,
    "AVE_FAM_SZ": 3.61,
    "HSE_UNITS": 4747,
    "VACANT": 271,
    "OWNER_OCC": 3205,
    "RENTER_OCC": 1271
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      -111.95410287,
      43.475792356
    ]
  }
}

*/



let map = {}

/*
what we actually want
{
    "NAME": "Ammon",
    "ST": "ID",
    "POPULATION": 15181,
    "coordinates": [
      -111.95410287,
      43.475792356
    ]
}

*/
let collisions = 0

// given city of the above form want to strip
// ASSUME BIGGER THAN 100K?
// problem is some cities have the same name, but only 1 key allowed... total number of "collisions" is 103, thats a lot..
cityMap = (city) => {
	if (`${city.properties.NAME}_${city.properties.ST}` in map){
		collisions++;
		console.log(`collision at city name ${city.properties.NAME}_${city.properties.ST}`)
	}

	map[`${city.properties.NAME}_${city.properties.ST}`] = {
		ST: city.properties.ST,
		POPULATION: city.properties.POPULATION,
		COORD: city.geometry.coordinates
	}
}



fs.readFile(inPath, "utf8", (error, data) => {
	if (error) {
		console.log(error);
		return;
	}

  	const usaMajorCities = JSON.parse(data)
	//console.log(`usaMajorCities: ${usaMajorCities.features.length}`) // total length 3886
	
	// add to map
	usaMajorCities.features.forEach((city) => cityMap(city) )

	console.log(`the total number of city name collisions was ${collisions}`)
	/**
	
	 */
	// write map to file:
	fs.writeFile(outPath, JSON.stringify(map, null, 2), (error) => {
		if (error) {
			console.log("An error has occurred ", error);
			return;
		}
			console.log("Data written successfully to disk");
		});
});

