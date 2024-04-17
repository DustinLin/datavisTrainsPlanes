
## how to run the app
```
npm install
npm run dev
```

cleanup TODOs
- [x] nuke original elements
- [x] getting importing working for JSON, loading structure set up in `+page.js`
- [x] figure out how to plot the map
- [x] clean up more code and delete unnecessary files
- [ ] maybe get a style guide so it's not code explosion
- [x] write some documentation and merge with `master`
- [ ] fill out data description section down below?
- [ ] can upload the pre-processing scripts on here used, but this is more so for completeness/documentation

## File structure
- `src/routes` contains our components
- `src/utils.js` has some functions for parsing the data that we import that may be useful throughout the components
- `static/` has all the datasets that we are using (and imported from code in `src/routes/+page.js` for all to use)
- `static/ref` has some reference files that we used for preprocessing the data? Purely for reference?

## Our data
- `AmtrakRoutes.geojson`: from [BTS](https://data-usdot.opendata.arcgis.com/maps/baa5a6c4d4ae4034850e99aaca38cfbb)
- `Amtrak_Routes-simplified.geojson`: from [this](https://github.com/binx/amtrak-explorer/tree/main) github source that did some pre-processing of the original rail data from Amtrak
- `cityCordMap.json`: Mapping from cities to their coordinates, used for graphing/projecting on geomap, derived from `usaCities.geojson`
- `cityRouteMap.json`: Mapping from cities to what Amtrak lines they have
- `filteredCityPairToInfo.json`: flight route data
- `formatedIteratedGravityResults.json` - first index of the array contains the top routes to build HSR, rest are extra info on rail lines (eg: rail stops, distance between them)
- `usaCities.geojson`: data of population, geo-location of various cities around the US 
- `usaContGeojson.json`: US geojson map of the contiguous US, derived from `usaGeojson.json`, removing Alaska, Hawaii, etc.
- `usaGeojson.json`: found online, geojson map of the "US"

## potential data for amtrak speed?
https://en.wikipedia.org/wiki/Long-distance_Amtrak_routes

### nice/fast color picker
[linked](https://coolors.co/b5b5b5)
- can input hex, and adjust Hue, saturation, luminance separately