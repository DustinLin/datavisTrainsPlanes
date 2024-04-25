// preprocessing Geo data to remove Alaska, Hawaii and PR

const fs = require("fs");

const outPath = "./usaContGeojson.json";
const inPath = "./usaGeojson.json"


/* example entry
{
    "type": "Feature",
    "properties": {
        "GEO_ID": "0400000US01",
        "STATE": "01",
        "NAME": "Alabama",
        "LSAD": "",
        "CENSUSAREA": 50645.326
    },
    "geometry": {
        "type": "MultiPolygon",
        "coordinates": [A BUNCH OF POINTS]
    }
}
*/



let map = {}



fs.readFile(inPath, "utf8", (error, data) => {
	if (error) {
		console.log(error);
		return;
	}

  const usaMap = JSON.parse(data)
  usaMap.features = usaMap.features.filter(
    (fea) =>
      !(
        fea.properties.NAME === "Alaska" ||
        fea.properties.NAME === "Hawaii" ||
        fea.properties.NAME === "Puerto Rico"
      )
  );
	
	/**
	
	 */
	// write map to file:
	fs.writeFile(outPath, JSON.stringify(usaMap, null, 2), (error) => {
		if (error) {
			console.log("An error has occurred ", error);
			return;
		}
			console.log("Data written successfully to disk");
		});
});

