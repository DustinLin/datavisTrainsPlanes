export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["AmtrakRoutes.geojson","Amtrak_Routes-simplified.geojson","cityCordMap.json","cityRouteMap.json","cityTrainsPreprocessing/MajorCitiesMap.js","cityTrainsPreprocessing/cityRouteSeg.js","cityTrainsPreprocessing/usaGeoFilter.js","favicon.png","filteredCityPairToInfo.json","formatedIteratedGravityResults.json","pythonProcessing/airportCodes.csv","pythonProcessing/airportCodes.html","pythonProcessing/codeToCityScraping.ipynb","usaCities.geojson","usaContGeojson.json","usaGeojson.json"]),
	mimeTypes: {".geojson":"application/geo+json",".json":"application/json",".js":"text/javascript",".png":"image/png",".csv":"text/csv",".html":"text/html"},
	_: {
		client: {"start":"_app/immutable/entry/start.h9IKiwFl.js","app":"_app/immutable/entry/app.vTQdSnV_.js","imports":["_app/immutable/entry/start.h9IKiwFl.js","_app/immutable/chunks/entry.EdqGqwWD.js","_app/immutable/chunks/scheduler.2Iq1zJtK.js","_app/immutable/entry/app.vTQdSnV_.js","_app/immutable/chunks/scheduler.2Iq1zJtK.js","_app/immutable/chunks/index.zlyRD2dz.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
