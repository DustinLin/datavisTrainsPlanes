
const { ADDRGETNETWORKPARAMS } = require("dns");
const fs = require("fs");

const outPath = "./cityRouteMap.json";
const inPath = "./route_segments.json"

// Idea is want to know if exists rail between 2 cities

// map from city -> [routes?]

// then query cities and see if there is an intersection between routes?


/* example entry
    {
        "route": "Empire Builder",
        "segments":
        [
            {
                "segments":
                [
                    {
                        "depth": 1,
                        "stations":
                        [
                            "Portland, OR",
                            "Vancouver, WA",
                            "Bingen-White Salmon, WA",
                            "Wishram, WA",
                            "Pasco, WA"
                        ]
                    },
                    {
                        "depth": 3,
                        "linksUp": true,
                        "stations":
                        [
                            "Seattle, WA",
                            "Edmonds, WA",
                            "Everett, WA",
                            "Leavenworth, WA",
                            "Wenatchee, WA",
                            "Ephrata, WA"
                        ]
                    }
                ]
            },
            {
                "depth": 2,
                "stations":
                [
                    "Spokane, WA",
                    "Sandpoint, ID",
                    "Libby, MT",
                    "Whitefish, MT",
                    "West Glacier, MT",
                    "Essex, MT",
                    "East Glacier Park, MT",
                    "Browning, MT",
                    "Cut Bank, MT",
                    "Shelby, MT",
                    "Havre, MT",
                    "Malta, MT",
                    "Glasgow, MT",
                    "Wolf Point, MT",
                    "Williston, ND",
                    "Stanley, ND",
                    "Minot, ND",
                    "Rugby, ND",
                    "Devils Lake, ND",
                    "Grand Forks, ND",
                    "Fargo, ND",
                    "Detroit Lakes, MN",
                    "Staples, MN",
                    "St. Cloud, MN",
                    "St. Paul-Minneapolis, MN",
                    "Red Wing, MN",
                    "Winona, MN",
                    "La Crosse, WI",
                    "Tomah, WI",
                    "Wisconsin Dells, WI",
                    "Portage, WI",
                    "Columbus, WI",
                    "Milwaukee-Downtown, WI",
                    "Glenview, IL",
                    "Chicago, IL"
                ]
            }
        ]
    },
*/



let map = {}

let addToMap = (station, routeName) => {
	let key = strFormat(station);
	console.log(`trying to add ${routeName} to key ${key}`)
	if (map[key] === undefined) {
		//map[key] = new Set([routeName])
		map[key] = [routeName]
	} else {
		// don't need to worry about duplicates, since each route is unique
		(map[key]).push(routeName)
	}

}

// need a function that turns "Los Angeles, CA" to "Los Angeles_CA"
let strFormat = (cityState) => {
	return `${cityState.split(",")[0]}_${cityState.split(",")[1].substring(1)}`
}

fs.readFile(inPath, "utf8", (error, data) => {
	if (error) {
		console.log(error);
		return;
	}

	const routeSegments= JSON.parse(data)

	routeSegments.forEach((obj) => {
		let segments = obj["segments"]
		let routeName = obj["route"]

		// console.log(`currently looking at route name ${routeName}`)

		// could be the case where there are multiple segments?
		if (segments.length == 1){
			// iterate through each stop and add routeName to map
			segments[0]["stations"].forEach((station) => {
				addToMap(station, routeName)
			})

		} else {
			// then there are mutliple segments each with a "stations" attr, just iterate and combine?

			let stk = []
			segments.forEach(obj => stk.push(obj))

			while (stk.length !== 0) {
				//remove last obj from the qu
				curr = stk.pop()
				if (curr["stations"] === undefined){
					// ASSUME: if it doesn't have "stations", then it must have a "segments" attr
					curr["segments"].forEach(seg => stk.push(seg))

				} else {
					// then reached "leaf" and can just add
					curr["stations"].forEach((station) => {
						addToMap(station, routeName)
					})
				}
			}

		}
	})



	/*
		summary of manual edits:
		- "BWI Marshal Airport" -> combine with Baltimore_MD
		- nuking QC - idc about Canada
		- "Santa Clara - Great America" -> combine with Santa Clara_CA
		- "St. Paul-Minneapolis" -> break into 2
		- "Milwaukee-downtown" -> Milwaukee
		- "New Haven State Street" -> "New Haven"
		- Nuke "Milwaukee aiport"
		- "Newark Penn" -> Newark, also get rid of "Neward Liberty Internaltional Airport"
		- combine "San Diego Old Town" and "San Diego Santa Fe Depot"
	*/

	// will do some manual post processing of combine "cities" like 
	fs.writeFile(outPath, JSON.stringify(map, null, 2), (error) => {
		if (error) {
			console.log("An error has occurred ", error);
			return;
		}
			console.log("Data written successfully to disk");
		});
});

