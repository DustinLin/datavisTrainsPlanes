
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
### raw data
- `AmtrakRoutes.geojson`: from [BTS](https://data-usdot.opendata.arcgis.com/maps/baa5a6c4d4ae4034850e99aaca38cfbb)
- `Amtrak_Routes-simplified.geojson`: from [this](https://github.com/binx/amtrak-explorer/tree/main) github source that did some pre-processing of the original rail data from Amtrak
- `USA_Major_Cities.geojson`: IDK WHERE THIS IS FROM, contains city, state, population, and coordinate data of cities across the US
- `usaGeojson.json`: geojson map of the "US", same as the ones used in class on observable


### derived data
- `cityCordMap.json`: Mapping from cities to their coordinates removing excess data, used for graphing/projecting on geomap, derived from `USA_Major_Cities.geojson`
- `cityRouteMap.json`: Mapping from cities to what Amtrak lines they have, derived also from the [github where we got amtrak routes](https://github.com/binx/amtrak-explorer/tree/main)
- `filteredCityPairToInfo.json`: flight route data @Jack write about this
- `formatedIteratedGravityResults.json` - first index of the array contains the top routes to build HSR, rest are extra info on rail lines (eg: rail stops, distance between them) @Jack write about this 
- `usaContGeojson.json`: US geojson map of the contiguous US, derived from `usaGeojson.json`, removing Alaska, Hawaii, etc.


### Sample datas
- `cityCordMap.json` - used for mapping cities to a map:
```
  "Boston_MA": {
    "ST": "MA",
    "POPULATION": 661977,
    "COORD": [
      -71.0567128929999,
      42.3595932750001
    ]
  },
```

- `filteredCityPairToInfo.json` - a "flight route"
```
    [
        "(Las Vegas_NV, Los Angeles_CA)",
        {
            "DEPARTURES_PERFORMED": 45419,
            "SEATS": 7225894,
            "RAMP_TO_RAMP": 3103194,
            "AIR_TIME": 1951889,
            "PASSENGERS": 5413420,
            "FREIGHT": 4103870,
            "DEST": "LAX",
            "DEST_STATE": "CA",
            "ORIGIN": "LAS",
            "ORIGIN_STATE": "NV",
            "DISTANCE": 227.41557128412538,
            "GRAVITY": 83.07735023785848
        }
    ],
```

- `formatedIteratedGravityResults.json` - simply city pairs of where we should build rail, all other info is contained `cityCordMap.json`

```
[
    "(Las Vegas_NV, Los Angeles_CA)",
    "(Boston_MA, New York_NY)",
    "(New York_NY, Washington_DC)",
	...
]
```
- The geo maps are not that interesting - just line objects for d3 to draw


## potential data for amtrak speed?
https://en.wikipedia.org/wiki/Long-distance_Amtrak_routes

### nice/fast color picker
[linked](https://coolors.co/b5b5b5)
- can input hex, and adjust Hue, saturation, luminance separately