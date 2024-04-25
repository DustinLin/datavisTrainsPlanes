import "d3";
async function load({ fetch }) {
  const res = await fetch("/usaContGeojson.json");
  const datasetUSAGeo = await res.json();
  const res3 = await fetch("/cityCordMap.json");
  const cityCordMap = await res3.json();
  const res4 = await fetch("/AmtrakRoutes.geojson");
  const amtrakMap = await res4.json();
  const res5 = await fetch("/filteredCityPairToInfo.json");
  const filteredCityPairToInfo = await res5.json();
  const res6 = await fetch("/Amtrak_Routes-simplified.geojson");
  const amtrakMapSimp = await res6.json();
  const res7 = await fetch("/cityRouteMap.json");
  const cityAmtrakRouteMap = await res7.json();
  const res8 = await fetch("/formatedIteratedGravityResults.json");
  const gravityTopResRoutes = await res8.json();
  const dataPayload = {
    // want to pass the entire GEO obj as that helps make the projection?
    usaGeo: datasetUSAGeo,
    cityCordMap,
    amtrakMap,
    filteredCityPairToInfo,
    amtrakMapSimp,
    cityAmtrakRouteMap,
    gravityTopResRoutes
  };
  return { dataPayload };
}
export {
  load
};
