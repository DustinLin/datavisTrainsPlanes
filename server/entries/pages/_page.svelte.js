import { c as create_ssr_component, e as escape, d as each, f as add_attribute, v as validate_component, h as add_styles } from "../../chunks/ssr.js";
import * as d3 from "d3";
const Axis = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ticks;
  let offset;
  let { orientation } = $$props;
  let { margin } = $$props;
  let { width: width2 } = $$props;
  let { height } = $$props;
  let { scale } = $$props;
  let { label = "" } = $$props;
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0)
    $$bindings.orientation(orientation);
  if ($$props.margin === void 0 && $$bindings.margin && margin !== void 0)
    $$bindings.margin(margin);
  if ($$props.width === void 0 && $$bindings.width && width2 !== void 0)
    $$bindings.width(width2);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  if ($$props.scale === void 0 && $$bindings.scale && scale !== void 0)
    $$bindings.scale(scale);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  ticks = scale.bandwidth ? scale.domain() : scale.ticks();
  offset = scale.bandwidth ? scale.bandwidth() / 2 : 0;
  return ` <g>${orientation === "left" ? `<g transform="${"translate(" + escape(margin.left, true) + ")"}">${each(ticks, (tick) => {
    return `<g transform="${"translate(0," + escape(scale(tick) + offset, true) + ")"}"><line${add_attribute("x2", -6, 0)} stroke="black"></line><text text-anchor="end" dominant-baseline="middle" fill="black"${add_attribute("x", -10, 0)}${add_attribute("font-size", 15, 0)}>${escape(tick)}</text></g>`;
  })}${label ? `<text text-anchor="start" dominant-baseline="hanging" fill="black"${add_attribute("x", -margin.left + 10, 0)}${add_attribute("y", 10, 0)}>${escape(label)}</text>` : ``}</g>` : `<g transform="${"translate(0," + escape(height - margin.bottom, true) + ")"}">${each(ticks, (tick) => {
    return `<g transform="${"translate(" + escape(scale(tick) + offset, true) + ")"}"><line${add_attribute("y2", 6, 0)} stroke="black"></line><text text-anchor="middle" dominant-baseline="hanging" fill="black"${add_attribute("y", 10, 0)}>${escape(tick)}</text></g>`;
  })}${label ? `<text text-anchor="end" dominant-baseline="hanging" fill="black"${add_attribute("x", width2 - 55, 0)}${add_attribute("y", 25, 0)}>${escape(label)}</text>` : ``}</g>`}</g>`;
});
const css$9 = {
  code: ".BarChart.svelte-1r92p4l{background-color:#ffffff;border-radius:2em;flex:1}rect.svelte-1r92p4l{transition:width 250ms}",
  map: null
};
const BarChart = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let width2;
  let height;
  let x;
  let y;
  let { dataset } = $$props;
  let { feature } = $$props;
  let { xLabel } = $$props;
  let { yLabel } = $$props;
  let { color } = $$props;
  let { roundValue } = $$props;
  let { unitConversion = 1 } = $$props;
  let { firstX = -1 } = $$props;
  let { stringFormatter } = $$props;
  let { minDimSize } = $$props;
  let { sort } = $$props;
  let sortedFeature = dataset;
  if (sort) {
    sortedFeature = dataset.sort(([cities1, data1], [cities2, data2]) => {
      const score1 = data1[feature];
      const score2 = data2[feature];
      return d3.descending(score1, score2);
    });
  }
  if (firstX !== -1) {
    sortedFeature = sortedFeature.slice(0, firstX);
  }
  const unitCovertFunction = (info) => {
    const newInfo = { ...info };
    newInfo[feature] = newInfo[feature] / unitConversion;
    newInfo["color"] = newInfo["color"] ? newInfo["color"] : color;
    return newInfo;
  };
  sortedFeature = sortedFeature.map(([pair, info]) => [pair, unitCovertFunction(info)]);
  stringFormatter = stringFormatter ? stringFormatter : (d) => d;
  sortedFeature = sortedFeature.map(([pair, info]) => [stringFormatter(pair), info]);
  const maxVal = d3.max(sortedFeature, (d) => d[1][feature]);
  const margin = {
    top: 45,
    bottom: 45,
    left: 270,
    right: 80
  };
  if ($$props.dataset === void 0 && $$bindings.dataset && dataset !== void 0)
    $$bindings.dataset(dataset);
  if ($$props.feature === void 0 && $$bindings.feature && feature !== void 0)
    $$bindings.feature(feature);
  if ($$props.xLabel === void 0 && $$bindings.xLabel && xLabel !== void 0)
    $$bindings.xLabel(xLabel);
  if ($$props.yLabel === void 0 && $$bindings.yLabel && yLabel !== void 0)
    $$bindings.yLabel(yLabel);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.roundValue === void 0 && $$bindings.roundValue && roundValue !== void 0)
    $$bindings.roundValue(roundValue);
  if ($$props.unitConversion === void 0 && $$bindings.unitConversion && unitConversion !== void 0)
    $$bindings.unitConversion(unitConversion);
  if ($$props.firstX === void 0 && $$bindings.firstX && firstX !== void 0)
    $$bindings.firstX(firstX);
  if ($$props.stringFormatter === void 0 && $$bindings.stringFormatter && stringFormatter !== void 0)
    $$bindings.stringFormatter(stringFormatter);
  if ($$props.minDimSize === void 0 && $$bindings.minDimSize && minDimSize !== void 0)
    $$bindings.minDimSize(minDimSize);
  if ($$props.sort === void 0 && $$bindings.sort && sort !== void 0)
    $$bindings.sort(sort);
  $$result.css.add(css$9);
  width2 = minDimSize[0];
  height = minDimSize[1];
  x = d3.scaleLinear().domain([0, maxVal]).range([margin.left, width2 - margin.right]);
  y = d3.scaleBand().domain(sortedFeature.map(([pair, info]) => pair)).range([margin.top, height - margin.bottom]).padding(0.1);
  return `<div class="BarChart svelte-1r92p4l"><svg${add_attribute("height", height, 0)}${add_attribute("width", width2, 0)}><g>${each(sortedFeature, ([cityPair, info]) => {
    return `<rect${add_attribute("x", x(0), 0)}${add_attribute("y", y(cityPair), 0)}${add_attribute("height", y.bandwidth(), 0)}${add_attribute("width", x(info[feature]) - x(0), 0)}${add_attribute("fill", info["color"], 0)} class="svelte-1r92p4l"></rect> <text class="bar-label" font-family="sans-serif" font-size="12px"${add_attribute("x", x(info[feature]) + 5, 0)}${add_attribute("y", y(cityPair) + y.bandwidth() / 2 + 5, 0)} text-anchor="start">${escape(Math.round(info[feature] * roundValue) / roundValue)}</text>`;
  })}</g>${validate_component(Axis, "Axis").$$render(
    $$result,
    {
      orientation: "bottom",
      scale: x,
      width: width2,
      height,
      margin,
      label: xLabel
    },
    {},
    {}
  )}${validate_component(Axis, "Axis").$$render(
    $$result,
    {
      orientation: "left",
      scale: y,
      width: width2,
      height,
      margin,
      label: yLabel
    },
    {},
    {}
  )}</svg> </div>`;
});
let SECURITY_TIMES = {
  "plane": 120,
  "train": 15,
  "car": 0
};
let TRAVEL_TO_AND_FROM_TIMES = {
  "plane": 60,
  "train": 45,
  "car": 0
};
const CITY_COLLISIONS = [
  "Seattle_WA",
  "Austin_TX",
  "Grand Rapids_MI",
  "Nashville_TN",
  "Asheville_TN",
  "Huntsville_TN"
];
const cityNamePlacement = (city, projection, cityCordMap) => {
  if (city === "Asheville_NC") {
    return [
      projection(cityCordMap[city].COORD)[0] + 5,
      projection(cityCordMap[city].COORD)[1] - 7
    ];
  }
  if (city === "Huntsville_AL") {
    return [
      projection(cityCordMap[city].COORD)[0] - 50,
      projection(cityCordMap[city].COORD)[1] - 7
    ];
  }
  if (city === "Nashville_TN") {
    return [
      projection(cityCordMap[city].COORD)[0] - 50,
      projection(cityCordMap[city].COORD)[1]
    ];
  }
  if (city === "Knoxville_TN") {
    return [
      projection(cityCordMap[city].COORD)[0] - 10,
      projection(cityCordMap[city].COORD)[1] - 10
    ];
  }
  if (CITY_COLLISIONS.includes(city)) {
    return [
      projection(cityCordMap[city].COORD)[0] + 5,
      projection(cityCordMap[city].COORD)[1] - 10
    ];
  } else {
    return [
      projection(cityCordMap[city].COORD)[0] + 4,
      projection(cityCordMap[city].COORD)[1] + 4
    ];
  }
};
const VIS_PROPERTIES = {
  MAP_COLOR: "#d3d3d3",
  CITY_CIRCLE_R: 5,
  // light shade of red
  CITY_CIRCLE_COL: "#737373",
  //"#fb9a99",
  ROUTE_STROKE_COL: "#b5b5b5",
  //"#5eaee4",
  ROUTE_STROKE_WID: 0.75,
  // highlighted route colors
  HL_CIRC_COLOR: "#e31a1c",
  // more saturated red compared to above
  HL_CIRC_R: 5,
  HL_ROUTE_STROKE_WID: 1.5,
  HL_ROUTE_STROKE_COL: "#5eaee4",
  // more saturated blue compared to reg route
  AMTRAK_RAIL_COL: "#6a3d9a",
  TRAIN_COLOR: "#cfe6ce",
  PLANE_COLOR: "#88aed0",
  CAR_COLOR: "#CFA287",
  HSR_ROUTE_COL: "#cc6600",
  //"#ff7800",
  LINE_OPACITY: 0.6
};
let planeTime = (distance) => {
  return 44.5957 + 0.117441 * distance;
};
let carTime = (distance) => {
  return 30 + 60 / 55 * distance;
};
let trainTime = (distance) => {
  return 25 + 0.36 * distance;
};
let createDatapoints = (functionToPlot, maxDistance, xScale, yScale) => {
  const data = [];
  const step = maxDistance / 500;
  for (let x = 0; x <= maxDistance; x += step) {
    const y = functionToPlot(x);
    data.push([xScale(x), yScale(y)]);
  }
  return data;
};
let vertLine = (vert, maxDistance, xScale, yScale) => {
  const data = [];
  const step = maxDistance / 500;
  for (let x = 0; x <= planeTotalTime(vert) + step; x += step) {
    const y = vert;
    data.push([xScale(y), yScale(x)]);
  }
  return data;
};
let triangleDashedLine = (vert, maxDistance, xScale, yScale) => {
  const data = [];
  const step = maxDistance / 500;
  for (let x = 0; x <= vert; x += step) {
    const y = planeTotalTime(vert);
    data.push([xScale(x), yScale(y)]);
  }
  return data;
};
let planeTotalTime = (distance) => {
  return planeTimeToTotalTime(planeTime(distance));
};
let planeTimeToTotalTime = (time) => {
  return time + SECURITY_TIMES.plane + TRAVEL_TO_AND_FROM_TIMES.plane;
};
let trainTotalTime = (distance) => {
  return trainTime(distance) + SECURITY_TIMES.train + TRAVEL_TO_AND_FROM_TIMES.train;
};
let carTotalTime = (distance) => {
  return carTime(distance) + SECURITY_TIMES.car + TRAVEL_TO_AND_FROM_TIMES.car;
};
let computeIntersection = (line1, line2) => {
  const delta = 10;
  const intercept1 = line1(0);
  const slope1 = (line1(delta) - intercept1) / delta;
  const intercept2 = line2(0);
  const slope2 = (line2(delta) - intercept2) / delta;
  return (intercept1 - intercept2) / (slope2 - slope1);
};
let computeInverse = (lineFunction, y) => {
  const delta = 10;
  const intercept = lineFunction(0);
  const slope = (lineFunction(delta) - intercept) / delta;
  return 1 / slope * (y - intercept);
};
let cutoffs = {
  triangleUpper: computeIntersection(trainTotalTime, planeTotalTime),
  // intersection of train with plane
  triangleLower: computeIntersection(carTotalTime, trainTotalTime),
  // intersection of train with car
  carPlaneIntersection: computeIntersection(carTotalTime, planeTotalTime),
  topRoutesNumber: 100,
  topGravNumber: 30
};
let cityPairsToCities = (cityPair) => {
  return cityPair.slice(1, -1).split(", ");
};
let formateCityTuple = (cityPair) => {
  return cityPair.map((pair) => {
    const [city, state] = pair.split("_");
    return `${city}, ${state}`;
  });
};
let cityStToCity = (cityStStr) => {
  return cityStStr.split("_")[0];
};
let cityStToState = (cityStStr) => {
  return cityStStr.split("_")[1];
};
let numberWithCommas = (x) => {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
let inTriangle = (flightTime) => {
  const lowerTime = planeTotalTime(cutoffs.triangleLower);
  const upperTime = planeTotalTime(cutoffs.triangleUpper);
  return flightTime >= lowerTime && flightTime <= upperTime;
};
let roundTo = (number, place) => {
  return Math.round(number / place) * place;
};
let roundUp = (number, place) => {
  return Math.ceil(number / place) * place;
};
let roundDown = (number, place) => {
  return Math.floor(number / place) * place;
};
let convertString = (input) => {
  const pairs = cityPairsToCities(input);
  const formattedPairs = formateCityTuple(pairs);
  return formattedPairs.join("\n - \n");
};
let planeToTrain = (rowData, timeUnitConversion2) => {
  const flightTime = rowData.AVG_TOTAL_TIME * timeUnitConversion2;
  if (inTriangle(flightTime)) {
    const distance = computeInverse(planeTotalTime, flightTime);
    return trainTotalTime(distance) / timeUnitConversion2;
  } else {
    return flightTime / timeUnitConversion2;
  }
};
const css$8 = {
  code: ".maps.svelte-csasca{border-style:solid;flex:2;background:#ffffff;border-radius:2em}",
  map: null
};
const Map = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let routeToCords;
  let usaMapProjection;
  let mapPath;
  let { map } = $$props;
  let { cities } = $$props;
  let { cityCordMap } = $$props;
  let { onhover } = $$props;
  let { mapId } = $$props;
  let { highlightedRoute } = $$props;
  let { showCityName } = $$props;
  let { dims } = $$props;
  let width2;
  let height;
  let citiesRoutePoints = [];
  let citiesRouteFiltered = [];
  cities.forEach((route) => {
    let c1 = cityPairsToCities(route[0])[0];
    let c2 = cityPairsToCities(route[0])[1];
    if (cityCordMap[c1] === void 0 || cityCordMap[c2] === void 0)
      ;
    else {
      citiesRoutePoints.push(c1);
      citiesRoutePoints.push(c2);
      citiesRouteFiltered.push(route);
    }
  });
  const citiesPlotSet = new Set(citiesRoutePoints);
  const CITY_CIRCLE_R = VIS_PROPERTIES.CITY_CIRCLE_R;
  const CITY_CIRCLE_COL = VIS_PROPERTIES.CITY_CIRCLE_COL;
  const ROUTE_STROKE_COL = VIS_PROPERTIES.ROUTE_STROKE_COL;
  const ROUTE_STROKE_WID = VIS_PROPERTIES.ROUTE_STROKE_WID;
  const MAP_COLOR = VIS_PROPERTIES.MAP_COLOR;
  const HL_CIRC_COLOR = VIS_PROPERTIES.HL_CIRC_COLOR;
  const HL_CIRC_R = VIS_PROPERTIES.HL_CIRC_R;
  const HL_ROUTE_STROKE_WID = VIS_PROPERTIES.HL_ROUTE_STROKE_WID;
  const HL_ROUTE_STROKE_COL = VIS_PROPERTIES.HL_ROUTE_STROKE_COL;
  if ($$props.map === void 0 && $$bindings.map && map !== void 0)
    $$bindings.map(map);
  if ($$props.cities === void 0 && $$bindings.cities && cities !== void 0)
    $$bindings.cities(cities);
  if ($$props.cityCordMap === void 0 && $$bindings.cityCordMap && cityCordMap !== void 0)
    $$bindings.cityCordMap(cityCordMap);
  if ($$props.onhover === void 0 && $$bindings.onhover && onhover !== void 0)
    $$bindings.onhover(onhover);
  if ($$props.mapId === void 0 && $$bindings.mapId && mapId !== void 0)
    $$bindings.mapId(mapId);
  if ($$props.highlightedRoute === void 0 && $$bindings.highlightedRoute && highlightedRoute !== void 0)
    $$bindings.highlightedRoute(highlightedRoute);
  if ($$props.showCityName === void 0 && $$bindings.showCityName && showCityName !== void 0)
    $$bindings.showCityName(showCityName);
  if ($$props.dims === void 0 && $$bindings.dims && dims !== void 0)
    $$bindings.dims(dims);
  $$result.css.add(css$8);
  width2 = dims[0];
  height = dims[0];
  usaMapProjection = d3.geoAlbersUsa().fitSize([width2, height], map);
  routeToCords = (route, city, cord) => {
    return usaMapProjection(cityCordMap[cityPairsToCities(route[0])[city]].COORD)[cord];
  };
  mapPath = d3.geoPath().projection(usaMapProjection);
  return `<div class="maps svelte-csasca"><svg${add_attribute("width", width2, 0)}${add_attribute("height", height, 0)}>${each(map.features, (state) => {
    return `<path fill="none"${add_attribute("stroke", MAP_COLOR, 0)}${add_attribute("d", mapPath(state), 0)}></path>`;
  })}${each(citiesRouteFiltered, (route) => {
    return `   <line${add_attribute("x1", routeToCords(route, 0, 0), 0)}${add_attribute("y1", routeToCords(route, 0, 1), 0)}${add_attribute("x2", routeToCords(route, 1, 0), 0)}${add_attribute("y2", routeToCords(route, 1, 1), 0)}${add_attribute("stroke", ROUTE_STROKE_COL, 0)}${add_attribute("stroke-width", ROUTE_STROKE_WID, 0)}></line>`;
  })}${each(citiesPlotSet, (city) => {
    return `<circle${add_attribute("cx", usaMapProjection(cityCordMap[city].COORD)[0], 0)}${add_attribute("cy", usaMapProjection(cityCordMap[city].COORD)[1], 0)}${add_attribute("fill", CITY_CIRCLE_COL, 0)}${add_attribute("r", CITY_CIRCLE_R, 0)}></circle>`;
  })}${showCityName ? `${each(citiesPlotSet, (city) => {
    return `<text font-size="10" font-family="sans-serif" dominant-baseline="hanging"${add_attribute("x", usaMapProjection(cityCordMap[city].COORD)[0] + 4, 0)}${add_attribute("y", usaMapProjection(cityCordMap[city].COORD)[1] + 4, 0)} font-weight="bold">${escape(city.split("_")[0])}</text>`;
  })}` : ``}${highlightedRoute ? `<line${add_attribute("x1", routeToCords(highlightedRoute, 0, 0), 0)}${add_attribute("y1", routeToCords(highlightedRoute, 0, 1), 0)}${add_attribute("x2", routeToCords(highlightedRoute, 1, 0), 0)}${add_attribute("y2", routeToCords(highlightedRoute, 1, 1), 0)}${add_attribute("stroke", HL_ROUTE_STROKE_COL, 0)}${add_attribute("stroke-width", HL_ROUTE_STROKE_WID, 0)}></line> <circle${add_attribute("cx", usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute[0])[0]].COORD)[0], 0)}${add_attribute("cy", usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute[0])[0]].COORD)[1], 0)}${add_attribute("fill", HL_CIRC_COLOR, 0)}${add_attribute("r", HL_CIRC_R, 0)}></circle> <circle${add_attribute("cx", usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute[0])[1]].COORD)[0], 0)}${add_attribute("cy", usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute[0])[1]].COORD)[1], 0)}${add_attribute("fill", HL_CIRC_COLOR, 0)}${add_attribute("r", HL_CIRC_R, 0)}></circle>` : ``}</svg> </div>`;
});
const css$7 = {
  code: ".routeDisplay.svelte-1iml2i0{min-width:450px;background-color:#ffffff;border-radius:2em;padding:1em}",
  map: null
};
const hintString = "hover over route to see";
const width = 450;
const RouteDisplay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { highlightedRoute } = $$props;
  if ($$props.highlightedRoute === void 0 && $$bindings.highlightedRoute && highlightedRoute !== void 0)
    $$bindings.highlightedRoute(highlightedRoute);
  $$result.css.add(css$7);
  return `${highlightedRoute ? `<div class="routeDisplay svelte-1iml2i0"${add_attribute("width", width, 0)}><ul><li>City: ${escape(cityStToCity(cityPairsToCities(highlightedRoute[0])[0]))}, ${escape(cityStToState(cityPairsToCities(highlightedRoute[0])[0]))}</li> <li>Other City: ${escape(cityStToCity(cityPairsToCities(highlightedRoute[0])[1]))}, ${escape(cityStToState(cityPairsToCities(highlightedRoute[0])[1]))}</li> <li>Distance: ${escape(Math.floor(highlightedRoute[1].DISTANCE))} miles</li> <li>Passengers: ${escape(numberWithCommas(highlightedRoute[1].PASSENGERS))}</li></ul></div>` : `<div class="routeDisplay svelte-1iml2i0"${add_attribute("width", width, 0)}><ul><li>City: ${escape(hintString)}</li> <li>Other City: ${escape(hintString)}</li> <li>Distance: ${escape(hintString)}</li> <li>Passengers: ${escape(hintString)}</li></ul></div>`}`;
});
const css$6 = {
  code: ".maps.svelte-exr5s4{border-style:solid;flex:2;background:#ffffff;border-radius:2em}h3.svelte-exr5s4{padding-left:0.5em}.swatches.svelte-exr5s4{display:flex;align-items:center;gap:0.5em;padding-left:0.5em}.swatch.svelte-exr5s4{display:flex;align-items:center;gap:0.25em}.swatch-text.svelte-exr5s4{font-size:13px\n	}.square.svelte-exr5s4{width:15px;height:15px}",
  map: null
};
const RailMap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let width2;
  let height;
  let usaMapProjection;
  let mapPath;
  let { map } = $$props;
  let { railMap } = $$props;
  let { cityCordMap } = $$props;
  let { citiesPlotSet } = $$props;
  let { dims } = $$props;
  citiesPlotSet.forEach((city) => {
    if (cityCordMap[city] === void 0) {
      console.log(`ERRROR RENDERING RAIL MAP FOR CITY ${city}`);
    }
  });
  const RAIL_EXISTS_COLOR = VIS_PROPERTIES.AMTRAK_RAIL_COL;
  const CITY_CIRCLE_R = VIS_PROPERTIES.CITY_CIRCLE_R;
  const CITY_CIRCLE_COL = VIS_PROPERTIES.CITY_CIRCLE_COL;
  const MAP_COLOR = VIS_PROPERTIES.MAP_COLOR;
  const LINE_OPACITY = VIS_PROPERTIES.LINE_OPACITY;
  if ($$props.map === void 0 && $$bindings.map && map !== void 0)
    $$bindings.map(map);
  if ($$props.railMap === void 0 && $$bindings.railMap && railMap !== void 0)
    $$bindings.railMap(railMap);
  if ($$props.cityCordMap === void 0 && $$bindings.cityCordMap && cityCordMap !== void 0)
    $$bindings.cityCordMap(cityCordMap);
  if ($$props.citiesPlotSet === void 0 && $$bindings.citiesPlotSet && citiesPlotSet !== void 0)
    $$bindings.citiesPlotSet(citiesPlotSet);
  if ($$props.dims === void 0 && $$bindings.dims && dims !== void 0)
    $$bindings.dims(dims);
  $$result.css.add(css$6);
  width2 = dims[0];
  height = dims[1];
  usaMapProjection = d3.geoAlbersUsa().fitSize([width2, height], map);
  mapPath = d3.geoPath().projection(usaMapProjection);
  return `<div class="maps svelte-exr5s4"><h3 class="svelte-exr5s4" data-svelte-h="svelte-1k21a4o">Existing Amtrak rail in the Untied States</h3> <div class="swatches svelte-exr5s4"> <div class="swatch svelte-exr5s4"> <div class="square svelte-exr5s4"${add_styles({ "background-color": RAIL_EXISTS_COLOR })} data-svelte-h="svelte-16j7ecd"></div> <div class="swatch-text svelte-exr5s4" data-svelte-h="svelte-chq59k">Amtrak Rail Lines</div></div></div> <svg${add_attribute("width", width2, 0)}${add_attribute("height", height, 0)}>${each(map.features, (state) => {
    return `<path fill="none"${add_attribute("stroke", MAP_COLOR, 0)}${add_attribute("d", mapPath(state), 0)}${add_attribute("opacity", LINE_OPACITY, 0)}></path>`;
  })}${each(railMap.features, (route) => {
    return `<path fill="none"${add_attribute("stroke", RAIL_EXISTS_COLOR, 0)}${add_attribute("d", mapPath(route), 0)}></path>`;
  })}${each(citiesPlotSet, (city) => {
    return `<circle${add_attribute("cx", usaMapProjection(cityCordMap[city].COORD)[0], 0)}${add_attribute("cy", usaMapProjection(cityCordMap[city].COORD)[1], 0)}${add_attribute("fill", CITY_CIRCLE_COL, 0)}${add_attribute("r", CITY_CIRCLE_R - 2, 0)}></circle>`;
  })}${each(citiesPlotSet, (city) => {
    return `<text font-size="10" font-family="sans-serif" dominant-baseline="hanging" font-weight="bold"${add_attribute("x", cityNamePlacement(city, usaMapProjection, cityCordMap)[0], 0)}${add_attribute("y", cityNamePlacement(city, usaMapProjection, cityCordMap)[1], 0)}>${escape(city.split("_")[0])}</text>`;
  })}</svg> </div>`;
});
const css$5 = {
  code: ".timeTriangle.svelte-bgzitl{height:100%;background-color:#ffffff;border-radius:2em;width:100%}",
  map: null
};
const ratio = 1.25;
const baseSize = 500;
const MAX_DISTANCE = 2724;
const TimeTriangle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let width2;
  let height;
  let STROKE_WIDTH;
  let smallXScale;
  let smallYScale;
  const triangleLower = cutoffs.triangleLower;
  const triangleUpper = cutoffs.triangleUpper;
  const marginTriangle = { top: 50, right: 50, bottom: 50, left: 50 };
  const functions = [planeTotalTime, trainTotalTime, carTotalTime];
  const transportTypeColorScale = d3.scaleOrdinal().domain(functions).range([
    VIS_PROPERTIES.PLANE_COLOR,
    VIS_PROPERTIES.TRAIN_COLOR,
    VIS_PROPERTIES.CAR_COLOR
  ]);
  $$result.css.add(css$5);
  width2 = baseSize * ratio;
  height = baseSize;
  STROKE_WIDTH = width2 / 200;
  smallXScale = d3.scaleLinear().domain([0, 600]).range([marginTriangle.left, width2 - marginTriangle.right]);
  smallYScale = d3.scaleLinear().domain([0, 350]).range([height - marginTriangle.bottom, marginTriangle.top]);
  return `<div class="timeTriangle svelte-bgzitl"><svg${add_attribute("height", height, 0)}${add_attribute("width", width2, 0)}><g>${each(functions, (theFunction) => {
    return `<path${add_attribute("d", d3.line()(createDatapoints(theFunction, MAX_DISTANCE, smallXScale, smallYScale)), 0)}${add_attribute("stroke", transportTypeColorScale(theFunction), 0)}${add_attribute("stroke-width", STROKE_WIDTH, 0)}></path>`;
  })}<path${add_attribute("d", d3.line()(vertLine(triangleLower, MAX_DISTANCE, smallXScale, smallYScale)), 0)}${add_attribute("stroke", VIS_PROPERTIES.ROUTE_STROKE_COL, 0)}${add_attribute("stroke-width", STROKE_WIDTH, 0)}></path><path${add_attribute("d", d3.line()(vertLine(triangleUpper, MAX_DISTANCE, smallXScale, smallYScale)), 0)}${add_attribute("stroke", VIS_PROPERTIES.ROUTE_STROKE_COL, 0)}${add_attribute("stroke-width", STROKE_WIDTH, 0)}></path><path${add_attribute("d", d3.line()(triangleDashedLine(triangleLower, MAX_DISTANCE, smallXScale, smallYScale)), 0)}${add_attribute("stroke", VIS_PROPERTIES.ROUTE_STROKE_COL, 0)}${add_attribute("stroke-width", STROKE_WIDTH, 0)}${add_attribute("stroke-dasharray", "3,3", 0)}></path><path${add_attribute("d", d3.line()(triangleDashedLine(triangleUpper, MAX_DISTANCE, smallXScale, smallYScale)), 0)}${add_attribute("stroke", VIS_PROPERTIES.ROUTE_STROKE_COL, 0)}${add_attribute("stroke-width", STROKE_WIDTH, 0)}${add_attribute("stroke-dasharray", "3,3", 0)}></path></g>${validate_component(Axis, "Axis").$$render(
    $$result,
    {
      orientation: "bottom",
      scale: smallXScale,
      width: width2,
      height,
      margin: marginTriangle,
      label: "Distance (miles)"
    },
    {},
    {}
  )}${validate_component(Axis, "Axis").$$render(
    $$result,
    {
      orientation: "left",
      scale: smallYScale,
      width: width2,
      height,
      margin: marginTriangle,
      label: "Time (minutes)"
    },
    {},
    {}
  )}</svg> </div>`;
});
const css$4 = {
  code: ".TopChart.svelte-oe0yqr{overflow:scroll}table.svelte-oe0yqr{font-family:arial, sans-serif;border-collapse:collapse;width:100%}td.svelte-oe0yqr,th.svelte-oe0yqr{border:1px solid #dddddd;text-align:left;padding:8px}tr.svelte-oe0yqr:nth-child(even){background-color:#dddddd}tr.svelte-oe0yqr:hover{background-color:#FF4D4D }",
  map: null
};
const TopChart = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { railLines } = $$props;
  let { mapId } = $$props;
  let { onhover } = $$props;
  let routeOrder = 1;
  const routeInc = () => routeOrder++;
  if ($$props.railLines === void 0 && $$bindings.railLines && railLines !== void 0)
    $$bindings.railLines(railLines);
  if ($$props.mapId === void 0 && $$bindings.mapId && mapId !== void 0)
    $$bindings.mapId(mapId);
  if ($$props.onhover === void 0 && $$bindings.onhover && onhover !== void 0)
    $$bindings.onhover(onhover);
  $$result.css.add(css$4);
  return `<div class="TopChart svelte-oe0yqr"><h3 data-svelte-h="svelte-1jy95lp">Iterated gravity model results: rail locations</h3> <table class="svelte-oe0yqr"><tr class="svelte-oe0yqr" data-svelte-h="svelte-bxijdv"><th class="svelte-oe0yqr">Order Built</th> <th class="svelte-oe0yqr">Pairwise City</th></tr> ${each(railLines, (railLine) => {
    return `<tr class="svelte-oe0yqr"><td class="svelte-oe0yqr">${escape(routeInc())}</td> <td class="svelte-oe0yqr">${escape(cityStToCity(cityPairsToCities(railLine)[0]))}, ${escape(cityStToState(cityPairsToCities(railLine)[0]))} - ${escape(cityStToCity(cityPairsToCities(railLine)[1]))}, ${escape(cityStToState(cityPairsToCities(railLine)[1]))}</td> </tr>`;
  })}</table> </div>`;
});
const css$3 = {
  code: ".maps.svelte-1k7tti5{border-style:solid;flex:2;background:#ffffff;border-radius:2em;padding:1em}",
  map: null
};
const col = "#FF4D4D";
const MapStatic = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usaMapProjection;
  let mapPath;
  let routeToCords;
  let { map } = $$props;
  let { cities } = $$props;
  let { cityCordMap } = $$props;
  let { highlightedRoute } = $$props;
  let { dims } = $$props;
  let { width: width2 } = $$props;
  let { height } = $$props;
  let citiesRoutePoints = [];
  let citiesRouteFiltered = [];
  cities.forEach((route) => {
    let c1 = cityPairsToCities(route)[0];
    let c2 = cityPairsToCities(route)[1];
    if (cityCordMap[c1] === void 0 || cityCordMap[c2] === void 0)
      ;
    else {
      citiesRoutePoints.push(c1);
      citiesRoutePoints.push(c2);
      citiesRouteFiltered.push(route);
    }
  });
  const citiesPlotSet = new Set(citiesRoutePoints);
  const CITY_CIRCLE_R = VIS_PROPERTIES.CITY_CIRCLE_R;
  const ROUTE_STROKE_COL = VIS_PROPERTIES.HSR_ROUTE_COL;
  const MAP_COL = VIS_PROPERTIES.MAP_COLOR;
  const LINE_OPACITY = VIS_PROPERTIES.LINE_OPACITY;
  if ($$props.map === void 0 && $$bindings.map && map !== void 0)
    $$bindings.map(map);
  if ($$props.cities === void 0 && $$bindings.cities && cities !== void 0)
    $$bindings.cities(cities);
  if ($$props.cityCordMap === void 0 && $$bindings.cityCordMap && cityCordMap !== void 0)
    $$bindings.cityCordMap(cityCordMap);
  if ($$props.highlightedRoute === void 0 && $$bindings.highlightedRoute && highlightedRoute !== void 0)
    $$bindings.highlightedRoute(highlightedRoute);
  if ($$props.dims === void 0 && $$bindings.dims && dims !== void 0)
    $$bindings.dims(dims);
  if ($$props.width === void 0 && $$bindings.width && width2 !== void 0)
    $$bindings.width(width2);
  if ($$props.height === void 0 && $$bindings.height && height !== void 0)
    $$bindings.height(height);
  $$result.css.add(css$3);
  width2 = dims[0];
  height = dims[1];
  usaMapProjection = d3.geoAlbersUsa().fitSize([width2, height], map);
  mapPath = d3.geoPath().projection(usaMapProjection);
  routeToCords = (route, city, cord) => {
    return usaMapProjection(cityCordMap[cityPairsToCities(route)[city]].COORD)[cord];
  };
  return `<div class="maps svelte-1k7tti5"><svg${add_attribute("width", width2, 0)}${add_attribute("height", height, 0)}>${each(map.features, (state) => {
    return `<path fill="none"${add_attribute("stroke", MAP_COL, 0)}${add_attribute("d", mapPath(state), 0)}></path>`;
  })}${each(citiesRouteFiltered, (route) => {
    return `  <line${add_attribute("x1", routeToCords(route, 0, 0), 0)}${add_attribute("y1", routeToCords(route, 0, 1), 0)}${add_attribute("x2", routeToCords(route, 1, 0), 0)}${add_attribute("y2", routeToCords(route, 1, 1), 0)}${add_attribute("stroke", ROUTE_STROKE_COL, 0)}${add_attribute("stroke-width", 2.5, 0)}${add_attribute("opacity", LINE_OPACITY, 0)}></line>`;
  })}${each(citiesPlotSet, (city) => {
    return `<circle${add_attribute("cx", usaMapProjection(cityCordMap[city].COORD)[0], 0)}${add_attribute("cy", usaMapProjection(cityCordMap[city].COORD)[1], 0)}${add_attribute("fill", ROUTE_STROKE_COL, 0)}${add_attribute("r", CITY_CIRCLE_R - 2, 0)}></circle>`;
  })}${each(citiesPlotSet, (city) => {
    return `<text font-size="10" font-family="sans-serif" dominant-baseline="hanging" font-weight="bold"${add_attribute("x", cityNamePlacement(city, usaMapProjection, cityCordMap)[0], 0)}${add_attribute("y", cityNamePlacement(city, usaMapProjection, cityCordMap)[1], 0)}>${escape(city.split("_")[0])}</text>`;
  })}${highlightedRoute ? `<line${add_attribute("x1", routeToCords(highlightedRoute, 0, 0), 0)}${add_attribute("y1", routeToCords(highlightedRoute, 0, 1), 0)}${add_attribute("x2", routeToCords(highlightedRoute, 1, 0), 0)}${add_attribute("y2", routeToCords(highlightedRoute, 1, 1), 0)}${add_attribute("stroke", col, 0)}${add_attribute("stroke-width", 3.5, 0)}${add_attribute("opacity", LINE_OPACITY, 0)}></line> <circle${add_attribute("cx", usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute)[0]].COORD)[0], 0)}${add_attribute("cy", usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute)[0]].COORD)[1], 0)}${add_attribute("fill", col, 0)}${add_attribute("r", CITY_CIRCLE_R + 1.75, 0)}></circle> <circle${add_attribute("cx", usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute)[1]].COORD)[0], 0)}${add_attribute("cy", usaMapProjection(cityCordMap[cityPairsToCities(highlightedRoute)[1]].COORD)[1], 0)}${add_attribute("fill", col, 0)}${add_attribute("r", CITY_CIRCLE_R + 1.75, 0)}></circle>` : ``}</svg> </div>`;
});
const css$2 = {
  code: ".maps.svelte-v1l0py{border-style:solid;flex:2;background:#ffffff;border-radius:2em}h3.svelte-v1l0py{padding-left:0.5em}.swatches.svelte-v1l0py{display:flex;align-items:center;gap:0.5em;padding-left:0.5em}.swatch.svelte-v1l0py{display:flex;align-items:center;gap:0.25em}.swatch-text.svelte-v1l0py{font-size:13px\n	}.square.svelte-v1l0py{width:15px;height:15px}",
  map: null
};
const RAIL_DNE_COLOR = "#33a02c";
const RailMapIntersect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let width2;
  let height;
  let routeToCords;
  let usaMapProjection;
  let mapPath;
  let { map } = $$props;
  let { cityCordMap } = $$props;
  let { cities } = $$props;
  let { dims } = $$props;
  const citiesPlotSet = /* @__PURE__ */ new Set();
  let routesPlot = [];
  const amtrakConnectedness = {
    "(Las Vegas_NV, Los Angeles_CA)": false,
    "(Boston_MA, New York_NY)": true,
    "(New York_NY, Washington_DC)": true,
    "(Dallas_TX, Houston_TX)": true,
    "(Austin_TX, Dallas_TX)": true,
    "(Portland_OR, Seattle_WA)": true,
    "(Charlotte_NC, Raleigh_NC)": true,
    "(Los Angeles_CA, San Francisco_CA)": true,
    "(Austin_TX, Houston_TX)": true,
    "(Austin_TX, San Antonio_TX)": true,
    "(Norfolk_VA, Washington_DC)": true,
    "(Miami_FL, Orlando_FL)": true,
    "(Fort Lauderdale_FL, Miami_FL)": true,
    "(Atlanta_GA, Greenville_SC)": true,
    "(Chicago_IL, Grand Rapids_MI)": true,
    "(Dallas_TX, Oklahoma City_OK)": true,
    "(Charleston_SC, Charlotte_NC)": false,
    "(Atlanta_GA, Birmingham_AL)": true,
    "(Las Vegas_NV, Phoenix_AZ)": false,
    "(Las Vegas_NV, San Diego_CA)": false,
    "(Chicago_IL, Detroit_MI)": true,
    "(Charlotte_NC, Greenville_SC)": true,
    "(Atlanta_GA, Nashville_TN)": false,
    "(Charlotte_NC, Myrtle Beach_SC)": false,
    "(Chicago_IL, Indianapolis_IN)": true,
    "(Raleigh_NC, Washington_DC)": true,
    "(Asheville_NC, Greenville_SC)": false,
    "(Seattle_WA, Spokane_WA)": true,
    "(Atlanta_GA, Huntsville_AL)": false,
    "(Atlanta_GA, Knoxville_TN)": false
  };
  cities.forEach((route) => {
    let origin = cityPairsToCities(route)[0];
    let dest = cityPairsToCities(route)[1];
    citiesPlotSet.add(origin);
    citiesPlotSet.add(dest);
    routesPlot.push([route, amtrakConnectedness[route]]);
  });
  const RAIL_EXISTS_COLOR = VIS_PROPERTIES.HSR_ROUTE_COL;
  const CITY_CIRCLE_R = VIS_PROPERTIES.CITY_CIRCLE_R;
  const CITY_CIRCLE_COL = VIS_PROPERTIES.CITY_CIRCLE_COL;
  const MAP_COLOR = VIS_PROPERTIES.MAP_COLOR;
  const LINE_OPACITY = VIS_PROPERTIES.LINE_OPACITY;
  if ($$props.map === void 0 && $$bindings.map && map !== void 0)
    $$bindings.map(map);
  if ($$props.cityCordMap === void 0 && $$bindings.cityCordMap && cityCordMap !== void 0)
    $$bindings.cityCordMap(cityCordMap);
  if ($$props.cities === void 0 && $$bindings.cities && cities !== void 0)
    $$bindings.cities(cities);
  if ($$props.dims === void 0 && $$bindings.dims && dims !== void 0)
    $$bindings.dims(dims);
  $$result.css.add(css$2);
  width2 = 400;
  height = 400;
  usaMapProjection = d3.geoAlbersUsa().fitSize([width2, height], map);
  routeToCords = (route, city, cord) => {
    return usaMapProjection(cityCordMap[cityPairsToCities(route)[city]].COORD)[cord];
  };
  mapPath = d3.geoPath().projection(usaMapProjection);
  return `<div class="maps svelte-v1l0py"><h3 class="svelte-v1l0py" data-svelte-h="svelte-v4gm52">Proposed HSR routes which already have existing Amtrak rail connections</h3> <div class="swatches svelte-v1l0py"> <div class="swatch svelte-v1l0py"> <div class="square svelte-v1l0py"${add_styles({ "background-color": RAIL_DNE_COLOR })} data-svelte-h="svelte-dkmyak"></div> <div class="swatch-text svelte-v1l0py" data-svelte-h="svelte-hsr8qc">There does not exist Amtrak rail connection</div></div> <div class="swatch svelte-v1l0py"> <div class="square svelte-v1l0py"${add_styles({ "background-color": RAIL_EXISTS_COLOR })} data-svelte-h="svelte-16j7ecd"></div> <div class="swatch-text svelte-v1l0py" data-svelte-h="svelte-1vmyyfm">Exists a direct Amtrak rail connection between 2 cities</div></div></div> <svg${add_attribute("width", width2, 0)}${add_attribute("height", height, 0)}>${each(map.features, (state) => {
    return `<path fill="none"${add_attribute("stroke", MAP_COLOR, 0)}${add_attribute("d", mapPath(state), 0)}></path>`;
  })}${each(routesPlot, ([route, railExist]) => {
    return ` <line${add_attribute("x1", routeToCords(route, 0, 0), 0)}${add_attribute("y1", routeToCords(route, 0, 1), 0)}${add_attribute("x2", routeToCords(route, 1, 0), 0)}${add_attribute("y2", routeToCords(route, 1, 1), 0)}${add_attribute("stroke", railExist ? RAIL_EXISTS_COLOR : RAIL_DNE_COLOR, 0)}${add_attribute("stroke-width", 2.5, 0)}${add_attribute("opacity", LINE_OPACITY, 0)}></line>`;
  })}${each(citiesPlotSet, (city) => {
    return `<circle${add_attribute("cx", usaMapProjection(cityCordMap[city].COORD)[0], 0)}${add_attribute("cy", usaMapProjection(cityCordMap[city].COORD)[1], 0)}${add_attribute("fill", CITY_CIRCLE_COL, 0)}${add_attribute("r", CITY_CIRCLE_R - 2, 0)}></circle>`;
  })}${each(citiesPlotSet, (city) => {
    return `<text font-size="10" font-family="sans-serif" dominant-baseline="hanging" font-weight="bold"${add_attribute("x", cityNamePlacement(city, usaMapProjection, cityCordMap)[0], 0)}${add_attribute("y", cityNamePlacement(city, usaMapProjection, cityCordMap)[1], 0)}>${escape(city.split("_")[0])}</text>`;
  })}</svg> </div>`;
});
const css$1 = {
  code: ".histogram.svelte-1a0i2ae{flex:1;height:100%;background-color:#ffffff;border-radius:2em}rect.svelte-1a0i2ae{transition:width 250ms}",
  map: null
};
function defaultAccessor(rowData, timeUnitConversion2) {
  return rowData.AVG_TOTAL_TIME;
}
const Histogram = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let width2;
  let height;
  let x;
  let y;
  let boxWidth;
  let { dataset } = $$props;
  let { xLabel } = $$props;
  let { yLabel } = $$props;
  let { color } = $$props;
  let { triangleColor } = $$props;
  let { minDimSize } = $$props;
  let { providedAccessorFunction } = $$props;
  let { timeUnitConversion: timeUnitConversion2 } = $$props;
  let { thresholds } = $$props;
  let { maxBinSize } = $$props;
  const accessorFunction = providedAccessorFunction ? providedAccessorFunction : defaultAccessor;
  let cityPairToTime = dataset;
  let bins = d3.bin().thresholds(thresholds).value((d) => accessorFunction(d[1], timeUnitConversion2))(cityPairToTime);
  const margin = {
    top: 45,
    bottom: 45,
    left: 120,
    right: 80
  };
  const thresholdWidth = thresholds[1] - thresholds[0];
  if ($$props.dataset === void 0 && $$bindings.dataset && dataset !== void 0)
    $$bindings.dataset(dataset);
  if ($$props.xLabel === void 0 && $$bindings.xLabel && xLabel !== void 0)
    $$bindings.xLabel(xLabel);
  if ($$props.yLabel === void 0 && $$bindings.yLabel && yLabel !== void 0)
    $$bindings.yLabel(yLabel);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.triangleColor === void 0 && $$bindings.triangleColor && triangleColor !== void 0)
    $$bindings.triangleColor(triangleColor);
  if ($$props.minDimSize === void 0 && $$bindings.minDimSize && minDimSize !== void 0)
    $$bindings.minDimSize(minDimSize);
  if ($$props.providedAccessorFunction === void 0 && $$bindings.providedAccessorFunction && providedAccessorFunction !== void 0)
    $$bindings.providedAccessorFunction(providedAccessorFunction);
  if ($$props.timeUnitConversion === void 0 && $$bindings.timeUnitConversion && timeUnitConversion2 !== void 0)
    $$bindings.timeUnitConversion(timeUnitConversion2);
  if ($$props.thresholds === void 0 && $$bindings.thresholds && thresholds !== void 0)
    $$bindings.thresholds(thresholds);
  if ($$props.maxBinSize === void 0 && $$bindings.maxBinSize && maxBinSize !== void 0)
    $$bindings.maxBinSize(maxBinSize);
  $$result.css.add(css$1);
  width2 = minDimSize[0];
  height = minDimSize[1];
  x = d3.scaleLinear().domain([thresholds[0], thresholds[thresholds.length - 1]]).range([margin.left, width2 - margin.right]);
  y = d3.scaleLinear().domain([0, maxBinSize]).range([height - margin.bottom, margin.top]);
  boxWidth = x(thresholds[1]) - x(thresholds[0]) - 1;
  return `<div class="histogram svelte-1a0i2ae"><svg${add_attribute("height", height, 0)}${add_attribute("width", width2, 0)}><g>${each(bins, (bin) => {
    return `<rect${add_attribute("x", x(roundDown(bin.x0, thresholdWidth)) + 1, 0)}${add_attribute("y", y(d3.sum(bin, (d) => d[1].NUM_DEPARTURES)), 0)}${add_attribute("height", y(0) - y(d3.sum(bin, (d) => d[1].NUM_DEPARTURES)), 0)}${add_attribute("width", boxWidth, 0)}${add_attribute(
      "fill",
      inTriangle(bin.x0 * timeUnitConversion2) ? triangleColor : color,
      0
    )} class="svelte-1a0i2ae"></rect>`;
  })}</g>${validate_component(Axis, "Axis").$$render(
    $$result,
    {
      orientation: "bottom",
      scale: x,
      width: width2,
      height,
      margin,
      label: xLabel
    },
    {},
    {}
  )}${validate_component(Axis, "Axis").$$render(
    $$result,
    {
      orientation: "left",
      scale: y,
      width: width2,
      height,
      margin,
      label: yLabel
    },
    {},
    {}
  )}</svg> </div>`;
});
const css = {
  code: ".paragraphWrapper.svelte-51pmeo{background-color:#ffffff;border-radius:2em;padding:1em}h2.svelte-51pmeo{padding-top:2em}.container.svelte-51pmeo{font-family:system-ui, sans-serif;font-size:16px;padding:2em}.pageHeader.svelte-51pmeo{display:flex;gap:2em;align-items:center}.main.svelte-51pmeo{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2em}.infoMap.svelte-51pmeo{display:flex;height:85vh;width:100vw;min-height:500px;padding:0.5em;gap:0.5em}.stackBox.svelte-51pmeo{gap:2em;height:100%;display:flex;flex-direction:column}#timeTriangleText.svelte-51pmeo{width:50%}body{background:#f0fcf1}.swatches.svelte-51pmeo{gap:0.5em;padding-left:0.5em}.swatch.svelte-51pmeo{display:flex;align-items:center;gap:0.25em}.swatch-text.svelte-51pmeo{font-size:13px\n	}.square.svelte-51pmeo{width:15px;height:15px}",
  map: null
};
const timeUnitConversion = 60;
const timeFeature = "time";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const usaGeoContig = data.dataPayload.usaGeo;
  const cityCordMap = data.dataPayload.cityCordMap;
  data.dataPayload.amtrakMap;
  const filteredCityPairToInfo = data.dataPayload.filteredCityPairToInfo;
  const amtrakMapSimp = data.dataPayload.amtrakMapSimp;
  const cityAmtrakRouteMap = data.dataPayload.cityAmtrakRouteMap;
  const gravityTopResRoutes = data.dataPayload.gravityTopResRoutes;
  let hRoutes = {
    highlightedRouteAll: null,
    highlightedRoutePopular: null,
    highlightedRouteTriangle: null,
    // for hovering on the scroll visual
    highlightedRouteBuilt: null
    // this property will simply be a city pair string
  };
  function onhover(route, vis) {
    if (route === null) {
      hRoutes[vis] = null;
    } else {
      hRoutes[vis] = route;
    }
  }
  let GravTopRes = gravityTopResRoutes[0].slice(0, cutoffs.topGravNumber);
  let allRouteCities = filteredCityPairToInfo;
  let minMapDims = [500, 500];
  let minBarDims = [500, 400];
  let triangleRouteCities = filteredCityPairToInfo.filter((route) => route[1].DISTANCE >= cutoffs.triangleLower && route[1].DISTANCE <= cutoffs.triangleUpper);
  console.log(`there is a diff between all routes and triangle routes: ${allRouteCities.length}, ${triangleRouteCities.length}`);
  const populationConversion = 1e3 * 1e3;
  let topFlightRoutesPass = filteredCityPairToInfo.sort(([cities1, data1], [cities2, data2]) => {
    const score1 = data1.PASSENGERS;
    const score2 = data2.PASSENGERS;
    return d3.descending(score1, score2);
  }).slice(0, cutoffs.topRoutesNumber);
  let citiesPlotSet = /* @__PURE__ */ new Set();
  GravTopRes.forEach((route) => {
    citiesPlotSet.add(cityPairsToCities(route)[0]);
    citiesPlotSet.add(cityPairsToCities(route)[1]);
  });
  let cityPairToTime = filteredCityPairToInfo.map(([pair, info]) => [
    pair,
    {
      AVG_TOTAL_TIME: planeTimeToTotalTime(info.RAMP_TO_RAMP / info.DEPARTURES_PERFORMED) / timeUnitConversion,
      AVG_TOTAL_FLIGHT_TIME: info.RAMP_TO_RAMP / info.DEPARTURES_PERFORMED / timeUnitConversion,
      AVG_AIR_TIME: info.AIR_TIME / info.DEPARTURES_PERFORMED / timeUnitConversion,
      DISTANCE: info.DISTANCE,
      NUM_DEPARTURES: info.DEPARTURES_PERFORMED
    }
  ]);
  let histogramThresholds = [];
  const groupSize = 30 / timeUnitConversion;
  const maxTime = roundUp(d3.max(cityPairToTime, (d) => d[1].AVG_TOTAL_TIME), groupSize);
  for (let i = 0; i <= maxTime; i += groupSize) {
    histogramThresholds.push(i);
  }
  const maxBinSize = 1.7 * 1e3 * 1e3;
  let trianglePairsOldTime = cityPairToTime.filter(([pair, info]) => inTriangle(info.AVG_TOTAL_TIME * timeUnitConversion));
  let trianglePairsNewTime = trianglePairsOldTime.map(([pair, info]) => [
    pair,
    {
      AVG_TOTAL_TIME: trainTime(info.DISTANCE) / timeUnitConversion,
      DISTANCE: info.DISTANCE,
      NUM_DEPARTURES: info.NUM_DEPARTURES
    }
  ]);
  let averageTotalTime = d3.mean(cityPairToTime.map(([pair, info]) => info.AVG_TOTAL_FLIGHT_TIME));
  let averageAirTime = d3.mean(cityPairToTime.map(([pair, info]) => info.AVG_AIR_TIME));
  let averageExtraTime = averageTotalTime - averageAirTime;
  let flyTimeBreakdown = [
    ["Travel to/from airport", { time: TRAVEL_TO_AND_FROM_TIMES["plane"] }],
    ["Time in Airport", { time: SECURITY_TIMES.plane }],
    [
      "Average Airplane Time on Ground",
      {
        time: averageExtraTime * timeUnitConversion
      }
    ],
    [
      "Average Airplane Time in Air",
      {
        time: averageAirTime * timeUnitConversion
      }
    ]
  ];
  const totalTime = d3.sum(flyTimeBreakdown, (d) => d[1][timeFeature]);
  flyTimeBreakdown.push(["Plane Total Time", { time: totalTime }]);
  let averagePlaneTimeInTriangle = d3.mean(trianglePairsOldTime.map(([pair, info]) => info.AVG_TOTAL_FLIGHT_TIME));
  let averageTrainTimeInTriangle = d3.mean(trianglePairsNewTime.map(([pair, info]) => info.AVG_TOTAL_TIME));
  let averageAirTimeInTriangle = d3.mean(trianglePairsOldTime.map(([pair, info]) => info.AVG_AIR_TIME));
  let averageExtraTimeInTriangle = averagePlaneTimeInTriangle - averageAirTimeInTriangle;
  let planeInfo = [
    ["Travel to/from airport", { time: TRAVEL_TO_AND_FROM_TIMES["plane"] }],
    ["Time in Airport", { time: SECURITY_TIMES.plane }],
    [
      "Average Airplane Time on Ground",
      {
        time: averageExtraTimeInTriangle * timeUnitConversion
      }
    ],
    [
      "Average Airplane Time in Air",
      {
        time: averageAirTimeInTriangle * timeUnitConversion
      }
    ]
  ];
  const planeTotal = d3.sum(planeInfo, (d) => d[1][timeFeature]);
  planeInfo.push(["Plane Total Time", { time: planeTotal }]);
  let trainInfo = [
    [
      "Travel to/from train station",
      {
        time: TRAVEL_TO_AND_FROM_TIMES["train"],
        color: VIS_PROPERTIES.TRAIN_COLOR
      }
    ],
    [
      "Time in station",
      {
        time: SECURITY_TIMES.train,
        color: VIS_PROPERTIES.TRAIN_COLOR
      }
    ],
    [
      "Average Train Startup Time",
      {
        time: trainTime(0),
        color: VIS_PROPERTIES.TRAIN_COLOR
      }
    ],
    [
      "Average Train Travel Time",
      {
        time: averageTrainTimeInTriangle * timeUnitConversion - trainTime(0),
        color: VIS_PROPERTIES.TRAIN_COLOR
      }
    ]
  ];
  const trainTotal = d3.sum(trainInfo, (d) => d[1][timeFeature]);
  trainInfo.push([
    "Train Total Time",
    {
      time: trainTotal,
      color: VIS_PROPERTIES.TRAIN_COLOR
    }
  ]);
  const bigKahuna = [];
  planeInfo.map(function(e, i) {
    bigKahuna.push(e);
    bigKahuna.push(trainInfo[i]);
    return [e, trainInfo[i]];
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<div class="container svelte-51pmeo"><div class="pageHeader svelte-51pmeo" data-svelte-h="svelte-162r1d0"><h2 class="svelte-51pmeo">High Speed Rail (HSR) in the US</h2></div> <div class="main svelte-51pmeo"><h2 class="svelte-51pmeo" data-svelte-h="svelte-dc65or">How do people travel long distances in the US?</h2> <div class="paragraphWrapper svelte-51pmeo"><p>One of the most common, and seemingly most convenient, ways to travel long distances within the United States is by flying. In 2023, there were ${escape(filteredCityPairToInfo.length)} unique flight routes within the continental US. 
			There are typically several flight options to travel between any two cities in the US that make flying an easy, flexible option. 
			In comparison, driving several hours is often not a viable option, especially for weekend trips, where time spent driving would nearly equal time spent at the actual destination. 
			Currently, options for rail travel are limited in many parts of the country and, due to the lack of high speed rail (HSR) in the US, taking a train does not save significant time compared to driving.</p></div> <div class="infoMap svelte-51pmeo" id="allRoutes">${validate_component(Map, "Map").$$render(
    $$result,
    {
      map: usaGeoContig,
      cities: allRouteCities,
      cityCordMap,
      showCityName: false,
      dims: minMapDims,
      onhover,
      highlightedRoute: hRoutes["highlightedRouteAll"],
      mapId: "highlightedRouteAll"
    },
    {},
    {}
  )} <div class="stackBox svelte-51pmeo">${validate_component(RouteDisplay, "RouteDisplay").$$render(
    $$result,
    {
      id: "totalFlightRoutesDisplay",
      highlightedRoute: hRoutes["highlightedRouteAll"]
    },
    {},
    {}
  )}</div></div>   <h2 class="svelte-51pmeo" data-svelte-h="svelte-ytz771">What are the popular airline routes in the US?</h2> <div class="infoMap svelte-51pmeo" id="popularAirlines">${validate_component(Map, "Map").$$render(
    $$result,
    {
      map: usaGeoContig,
      cities: topFlightRoutesPass,
      cityCordMap,
      onhover,
      showCityName: true,
      dims: minMapDims,
      highlightedRoute: hRoutes["highlightedRoutePopular"],
      mapId: "highlightedRoutePopular"
    },
    {},
    {}
  )} <div class="stackBox svelte-51pmeo">${validate_component(RouteDisplay, "RouteDisplay").$$render(
    $$result,
    {
      highlightedRoute: hRoutes["highlightedRoutePopular"]
    },
    {},
    {}
  )}  ${validate_component(BarChart, "BarChart").$$render(
    $$result,
    {
      dataset: filteredCityPairToInfo,
      feature: "PASSENGERS",
      xLabel: "Passengers (in millions)",
      color: "#88aed0",
      roundValue: 100,
      orientation: "horizontal",
      unitConversion: populationConversion,
      firstX: 10,
      stringFormatter: convertString,
      minDimSize: minBarDims,
      id: "stkBarChartPass",
      sort: false
    },
    {},
    {}
  )}</div></div> <h2 class="svelte-51pmeo" data-svelte-h="svelte-le66yy">How much time is spent taking these routes?</h2> <div class="paragraphWrapper svelte-51pmeo" data-svelte-h="svelte-wum8z3">The bar chart on the left shows the average time for each step involved in flying. The histogram on the right displays the distribution of total travel times for all 2023 flights within the continental US.</div> <div class="infoMap svelte-51pmeo" id="airlineTimes"> ${validate_component(BarChart, "BarChart").$$render(
    $$result,
    {
      dataset: flyTimeBreakdown,
      feature: timeFeature,
      yLabel: "Travel Time Breakdown",
      xLabel: "Time (in minutes)",
      color: "#88aed0",
      roundValue: 100,
      minDimSize: minBarDims
    },
    {},
    {}
  )} ${validate_component(Histogram, "Histogram").$$render(
    $$result,
    {
      dataset: cityPairToTime,
      yLabel: "Number of Flights in 2023",
      xLabel: "Total Time (in hours)",
      color: "#88aed0",
      triangleColor: "#88aed0",
      thresholds: histogramThresholds,
      maxBinSize,
      minDimSize: minMapDims
    },
    {},
    {}
  )}</div>  <div class="paragraphWrapper svelte-51pmeo" data-svelte-h="svelte-11z2jbx"><p>Besides the time spent in the air on a plane, there are several additional steps involved in air travel that, in total, can add hours to a trip. 
				One major inconvenience associated with flying is the TSA — the restrictions and the time it takes to go through TSA security at the airport. 
				Security lines can be very long, especially when the airport is very busy. 
				Since no one can anticipate how long the wait in the security line will be, TSA recommends that people arrive at the airport two hours before their flight. 
				Thus, even if the security line is short, travelers may still end up spending over an hour at the airport waiting to board. 
				Additionally, commuting to and from the airport often totals to an hour or more. 
				Finally, although the actual air travel is fast, passengers also end up spending significant time on the airplane before takeoff and after landing for taxiing, boarding, preparing the cabin for takeoff and delays.</p></div> <h2 class="svelte-51pmeo" data-svelte-h="svelte-7g09cc">Is there a faster way?</h2>  <div class="paragraphWrapper svelte-51pmeo" data-svelte-h="svelte-13zt062"><p>When factoring in time spent waiting at the airport or on the plane, along with time it takes to get to and from the airport, there are indeed faster alternatives to flying for certain distances of travel. 
			For example, the fastest way to get across the world is flying, while the fastest way to get to the other side of town is likely to drive. 
			Traveling a distance between these two extremes lends itself to rail travel, specifically high speed rail (HSR). 
			The fastest train in the US, Amtrak&#39;s Acela line, has an average speed of 70 MPH (113 km/hr). 
			This does not meet the required average speed of 124 MPH (200 km/hr) to be classified as &quot;high speed.&quot; 
			Thus, the United States currently has no functional HSR, despite the prevalence and success of HSR in many other nations including Japan and several European countries such as the UK, France, Italy, and Germany.</p></div>  <div class="infoMap svelte-51pmeo" id="timeTriangle"> <p class="paragraphWrapper svelte-51pmeo" id="timeTriangleText">To assess the potential benefits of implementing HSR in the US, we first determine the range of distances within which the fastest mode of travel would be HSR. 
				To calculate this sweet spot, we find a line of best fit for each of the three considered modes of transportation (car, HSR, and plane) and plot them on the graph shown on the right. 
				We call the area formed by the intersection of these lines the “Time Triangle,” which is plotted to the right. 
				The Time Triangle indicates that for distances between ${escape(roundTo(cutoffs.triangleLower, 0.1))} miles and ${escape(roundTo(cutoffs.triangleUpper, 0.1))} miles (indicated by the solid grey lines), HSR is the fastest mode of transportation when factoring in all the main steps included with each method of travel. 
				These distances correspond to total travel times of ${escape(roundTo(planeTotalTime(cutoffs.triangleLower), 0.1))} minutes (${escape(roundTo(planeTotalTime(cutoffs.triangleLower), 0.1) / timeUnitConversion)} hours) and ${escape(roundTo(planeTotalTime(cutoffs.triangleUpper), 0.1))} minutes (${escape(roundTo(planeTotalTime(cutoffs.triangleUpper), 0.1) / timeUnitConversion)} hours) including all steps of flight travel, respectively (these are indicated by the dashed grey lines in the graph). We show the airline routes that would be traveled faster on HSR on the map below.</p> ${validate_component(TimeTriangle, "TimeTriangle").$$render($$result, {}, {}, {})} <div class="stackBox svelte-51pmeo"><div class="swatches svelte-51pmeo"> <div class="swatch svelte-51pmeo"> <div class="square svelte-51pmeo"${add_styles({
    "background-color": VIS_PROPERTIES.PLANE_COLOR
  })} data-svelte-h="svelte-twdjp0"></div> <div class="swatch-text svelte-51pmeo" data-svelte-h="svelte-myvn1o">Planes</div></div> <div class="swatch svelte-51pmeo"> <div class="square svelte-51pmeo"${add_styles({
    "background-color": VIS_PROPERTIES.TRAIN_COLOR
  })} data-svelte-h="svelte-1w8z2u4"></div> <div class="swatch-text svelte-51pmeo" data-svelte-h="svelte-3duas2">HSR</div></div> <div class="swatch svelte-51pmeo"> <div class="square svelte-51pmeo"${add_styles({
    "background-color": VIS_PROPERTIES.CAR_COLOR
  })} data-svelte-h="svelte-hm2uig"></div> <div class="swatch-text svelte-51pmeo" data-svelte-h="svelte-r1dxwc">Cars</div></div></div></div></div> <h2 class="svelte-51pmeo" data-svelte-h="svelte-10dvn34">Airline routes that would be faster on HSR</h2> <div class="infoMap svelte-51pmeo" id="fasterRoutes"><div class="infoMap svelte-51pmeo" id="airlineSpeedUp">${validate_component(Map, "Map").$$render(
    $$result,
    {
      map: usaGeoContig,
      cities: triangleRouteCities,
      cityCordMap,
      onhover,
      mapId: "highlightedRouteTriangle",
      highlightedRoute: hRoutes["highlightedRouteTriangle"],
      showCityName: false,
      dims: minMapDims
    },
    {},
    {}
  )} <div class="stackBox svelte-51pmeo">${validate_component(RouteDisplay, "RouteDisplay").$$render(
    $$result,
    {
      highlightedRoute: hRoutes["highlightedRouteTriangle"]
    },
    {},
    {}
  )} ${validate_component(BarChart, "BarChart").$$render(
    $$result,
    {
      dataset: triangleRouteCities,
      feature: "PASSENGERS",
      xLabel: "Passengers (millions)",
      color: "#88aed0",
      roundValue: 100,
      orientation: "horizontal",
      unitConversion: populationConversion,
      firstX: 10,
      stringFormatter: convertString,
      minDimSize: minBarDims,
      id: "stkBarChartPass",
      sort: true
    },
    {},
    {}
  )}</div></div></div> <div class="paragraphWrapper svelte-51pmeo" data-svelte-h="svelte-13dco1t"><p>The left histogram below shows the distribution of total flight times for all flights in 2023, with the flights that fall within our Time Triangle highlighted in green.
			The right histogram below shows the theoretical distribution of total travel times when HSR is taken for these Time Triangle flights instead.</p></div> <div class="infoMap svelte-51pmeo" id="modifiedHistograms"> ${validate_component(Histogram, "Histogram").$$render(
    $$result,
    {
      dataset: cityPairToTime,
      xLabel: "Total Travel Time when Flying (hours)",
      yLabel: "Number of Trips",
      color: "#88aed0",
      triangleColor: "#cfe6ce",
      timeUnitConversion,
      thresholds: histogramThresholds,
      maxBinSize,
      minDimSize: minMapDims
    },
    {},
    {}
  )} ${validate_component(Histogram, "Histogram").$$render(
    $$result,
    {
      dataset: cityPairToTime,
      xLabel: "Total Travel Time After HSR is Built)",
      yLabel: "Number of Trips",
      color: "#88aed0",
      triangleColor: "#cfe6ce",
      providedAccessorFunction: planeToTrain,
      timeUnitConversion,
      thresholds: histogramThresholds,
      maxBinSize,
      minDimSize: minMapDims
    },
    {},
    {}
  )}</div> <div class="paragraphWrapper svelte-51pmeo" data-svelte-h="svelte-1hcku1d"><p>The below bar chart compares the travel time breakdown for flights and HSR for the Time Triangle distances.</p></div> <div class="infoMap svelte-51pmeo" id="comparisonBarChart">${validate_component(BarChart, "BarChart").$$render(
    $$result,
    {
      dataset: bigKahuna,
      feature: timeFeature,
      xLabel: "Time (minutes)",
      color: "#88aed0",
      roundValue: 100,
      orientation: "vertical",
      timeUnitConversion,
      minDimSize: minBarDims
    },
    {},
    {}
  )}</div> <h2 class="svelte-51pmeo" data-svelte-h="svelte-6bnc14">Which of these HSR routes should we build first?</h2> <div class="paragraphWrapper svelte-51pmeo" data-svelte-h="svelte-n48m6t"><p>To determine which of the potential rail lines would have the most impact, and thus should be focused on first, we built a mathematical model called an Iterative Gravity Model.
				Based on our model we propose 30 HSR lines. We note that our model was influenced by the Gravity Model presented in a YouTube video by CityNerd titled <a href="https://www.youtube.com/watch?v=wE5G1kTndI4">&quot;56 High Speed Rail Links We Should&#39;ve Built Already.&quot;</a>
				Highly recommend checking out his video as it was the inspiration for our time triangle and iterative gravity model.
				The gravity model as he presented is modeled after the <a href="https://en.wikipedia.org/wiki/Newton's_law_of_universal_gravitation">equation for gravity</a>. CityNerd calculates the gravity score by multiplying the population of the 2 cities, and divides by the distance between them squared. This mimics the equation for gravity by relating the &quot;mass&quot; of the two objects with the population of cities.
				<br>
				We improve upon this basic gravity model in two ways:</p> <ol><li>For the part of the equation representing “attractive force,” instead of using population as a proxy for where people want to travel, we use an actual figure that represents this: total annual passengers from US flight data.</li> <li>Our model is aware of already proposed rail when determining where rail should be placed next. <br>
						Consider the following hypothetical: 
						Suppose rail between New York City and Boston was already proposed, and now the model is considering connecting Washington, D.C. to Boston.
						The basic gravity model, when computing the score for connecting Washington, D.C. to Boston, considers building a line the entire way from Washington, D.C. to Boston. However, only building rail between
						Washington, D.C. and New York City is required since New York City and Boston have already been connected by HSR. In addition, if we connect Washington, D.C. to Boston, we also are also connecting Washington, D.C. to New York City so we should get the score for both of these, which the basic gravity model does not account for.
						<br><br>
						The Iterative Gravity model fixes both of these awareness issues by first considering the direct connection and all possibilities of connecting two cities using existing rails. Secondly, the score is now the sum of all scores for all the newly connected cities divided by the length of newly built rail line built.</li></ol></div> <h2 class="svelte-51pmeo" data-svelte-h="svelte-1rtwwht">Proposed HSR</h2> <div class="infoMap svelte-51pmeo" id="proposedHSRMap">${validate_component(MapStatic, "MapStatic").$$render(
    $$result,
    {
      map: usaGeoContig,
      cities: GravTopRes,
      cityCordMap,
      dims: minMapDims,
      highlightedRoute: hRoutes["highlightedRouteBuilt"]
    },
    {},
    {}
  )} ${validate_component(TopChart, "TopChart").$$render(
    $$result,
    {
      railLines: gravityTopResRoutes[0],
      onhover,
      mapId: "highlightedRouteBuilt"
    },
    {},
    {}
  )} </div> <h2 class="svelte-51pmeo" data-svelte-h="svelte-wmkdo">Intersection with current rail</h2>  <div class="paragraphWrapper svelte-51pmeo" data-svelte-h="svelte-1y043ng"><p>As explained above the Amtrak it does not meet the qualification for HSR. 
			Nonetheless, we can use the locations of these rail lines to make development of HSR cheaper by saving on clearing costs.
			The below maps compare our proposed HSR routes and the existing Amtrak rail lines, all the cities identified with our Iterative Gravity Model are labeled.</p></div> <div class="infoMap svelte-51pmeo" id="railIntersection">${validate_component(RailMapIntersect, "RailMapIntersect").$$render(
    $$result,
    {
      map: usaGeoContig,
      cities: GravTopRes,
      cityCordMap,
      cityAmtrakRouteMap,
      dims: minMapDims
    },
    {},
    {}
  )} ${validate_component(RailMap, "RailMap").$$render(
    $$result,
    {
      map: usaGeoContig,
      railMap: amtrakMapSimp,
      cityCordMap,
      citiesPlotSet,
      dims: minMapDims
    },
    {},
    {}
  )}  </div> <h2 class="svelte-51pmeo" data-svelte-h="svelte-51amv3">What Now?</h2> <div class="paragraphWrapper svelte-51pmeo" data-svelte-h="svelte-1y0wver"><p>Want to learn more? go to these resources @cityNerd</p> <p>Want to play around with the data or learn more in depth about our computational model? click <a href="https://github.com/DustinLin/datavisTrainsPlanes">here</a>.</p> <p>Want to show others? takes these steps: Share our and other resources with others</p></div></div> </div>`;
});
export {
  Page as default
};
