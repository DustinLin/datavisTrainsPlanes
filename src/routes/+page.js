import * as d3 from 'd3';

// https://kit.svelte.dev/docs/load
// "A +page.svelte file can have a sibling +page.js that exports a load function, the return value of which is available to the page via the data prop:"

export async function load({ fetch }) {

	// loading geojson data, can confirm loads correctly
	// pre-filtered to remove Alaska, Hawaii, Puerto Rico
	const res = await fetch('/usaContGeojson.json');
	const datasetUSAGeo = await res.json();

	const res3 = await fetch('/cityCordMap.json');
	const cityCordMap = await res3.json();

	const res4 = await fetch('/AmtrakRoutes.geojson');
	const amtrakMap= await res4.json();

	const res5 = await fetch('/filteredCityPairToInfo.json');
	const filteredCityPairToInfo = await res5.json();

	const res6 = await fetch('/Amtrak_Routes-simplified.geojson');
	const amtrakMapSimp= await res6.json();

	const res7 = await fetch('/cityRouteMap.json');
	const cityAmtrakRouteMap = await res7.json();

	const res8 = await fetch('/formatedIteratedGravityResults.json');
	const gravityTopResRoutes = await res8.json();




	// include more stuff as we load in more data?
	const dataPayload = {
		// want to pass the entire GEO obj as that helps make the projection?
		usaGeo: datasetUSAGeo,
		cityCordMap: cityCordMap,
		amtrakMap: amtrakMap,
		filteredCityPairToInfo: filteredCityPairToInfo,
		amtrakMapSimp: amtrakMapSimp,
		cityAmtrakRouteMap: cityAmtrakRouteMap,
		gravityTopResRoutes: gravityTopResRoutes
	}


	// data is being loaded properly, but can't be returned?
	return { dataPayload };
}

