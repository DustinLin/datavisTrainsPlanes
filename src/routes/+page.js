import * as d3 from 'd3';

// https://kit.svelte.dev/docs/load
// "A +page.svelte file can have a sibling +page.js that exports a load function, the return value of which is available to the page via the data prop:"

export async function load({ fetch }) {

	// loading geojson data, can confirm loads correctly
	const res = await fetch('/usaGeojson.json');
	const datasetUSAGeo = await res.json();

	const res2 = await fetch('/usaCities.geojson');
	const datasetCities = await res2.json();


	// want to prefilter?
	datasetUSAGeo.features =  datasetUSAGeo.features.filter(
    (fea) =>
      !(
        fea.properties.NAME === "Alaska" ||
        fea.properties.NAME === "Hawaii" ||
        fea.properties.NAME === "Puerto Rico"
      )
  	);

	const datasetCitiesBig =  datasetCities.features.filter(
    (city) =>
      city.properties.POPULATION > 600000 &&
      !(city.properties.ST === "AK" && city.properties.ST === "HI")
  	);

	// include more stuff as we load in more data?
	const dataPayload = {
		// want to pass the entire GEO obj as that helps make the projection?
		usaGeo: datasetUSAGeo,
		citiesBig: datasetCitiesBig
	}


	// data is being loaded properly, but can't be returned?
	return { dataPayload };
}

