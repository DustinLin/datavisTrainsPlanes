
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
- `AmtrakRoutes.geojson`:
- `Amtrak_Routes-simplified.geojson`: from [this](https://github.com/binx/amtrak-explorer/tree/main) github source that did some pre-processing of the original rail data from Amtrak
- `cityCordMap.json`:
- `cityRouteMap.json`: