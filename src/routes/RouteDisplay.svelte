<script>
	//import * as d3 from 'd3';

	export let highlightedRoute; 

	import {cityPairsToCities, cityStToCity, cityStToState, numberWithCommas} from '../utils';


	/* What a highlightedRoute looks like:
	[ [ "(Boston_MA, New York_NY)",
	  { DEPARTURES_PERFORMED: 35030,
		SEATS: 3529952,
		RAMP_TO_RAMP: 2707512,
		PASSENGERS: 2662158,
		FREIGHT: 577035,
		DEST: "EWR",
		ORIGIN: "BOS",
		DISTANCE: 193,
		GRAVITY: 65.42354467661713 }
	 ]
	 */

	/**
	 * only show cities, airports are unreliable, and not matched: city pairs sorted by alpha order so could be a mismatch
	 * 
	 * 
		<li>Origin Airport: {highlightedRoute[1].ORIGIN} </li>
		<li>Destination Airport: {highlightedRoute[1].DEST} </li>
	*/
</script>

{#if highlightedRoute}
<div class="routeInfo">
	<ul>
		<li>Origin City: {cityStToCity(cityPairsToCities(highlightedRoute[0])[0])}, {cityStToState(cityPairsToCities(highlightedRoute[0])[0])}</li>
		<li>Destination City: {cityStToCity(cityPairsToCities(highlightedRoute[0])[1])}, {cityStToState(cityPairsToCities(highlightedRoute[0])[1])}</li>
		<li>Distance: {Math.floor(highlightedRoute[1].DISTANCE)} miles </li>
		<li>Passengers: {numberWithCommas(highlightedRoute[1].PASSENGERS)}</li>
	</ul>

</div>

{:else}
<div class="routeInfo">
	<ul>
		<li>Origin City: N/A</li>
		<li>Origin Airport: N/A</li>
		<li>Destination City: N/A</li>
		<li>Destination Airport: N/A</li>
		<li>Distance: N/A</li>
		<li>Passengers: N/A</li>
	</ul>
</div>

{/if}

<style>
	/* todo styling is scuffed but it looks ok with hard coded values */
	.routeInfo {
		width: 300px;
	}
</style>

