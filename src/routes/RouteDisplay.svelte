<script>
	//import * as d3 from 'd3';

	export let highlightedRoute; 

	const hintString = "hover over route to see"

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
	const width = 450;

	/**
	 * only show cities, airports are unreliable, and not matched: city pairs sorted by alpha order so could be a mismatch
	 * 
	 * 
		<li>Origin Airport: {highlightedRoute[1].ORIGIN} </li>
		<li>Destination Airport: {highlightedRoute[1].DEST} </li>
	*/
</script>

{#if highlightedRoute}
<div class="routeDisplay" width={width}>
	<ul>
		<li>Origin City: {cityStToCity(cityPairsToCities(highlightedRoute[0])[0])}, {cityStToState(cityPairsToCities(highlightedRoute[0])[0])}</li>
		<li>Destination City: {cityStToCity(cityPairsToCities(highlightedRoute[0])[1])}, {cityStToState(cityPairsToCities(highlightedRoute[0])[1])}</li>
		<li>Distance: {Math.floor(highlightedRoute[1].DISTANCE)} miles </li>
		<li>Passengers: {numberWithCommas(highlightedRoute[1].PASSENGERS)}</li>
	</ul>

</div>

{:else}
<div class="routeDisplay" width={width}>
	<ul>
		<li>Origin City: {hintString}</li>
		<li>Destination City: {hintString}</li>
		<li>Distance: {hintString}</li>
		<li>Passengers: {hintString}</li>
	</ul>
</div>
{/if}


<style>
	/* todo styling is scuffed but it looks ok with hard coded values */
	.routeDisplay {
		min-width: 450px;
		background-color: #ffffff;
		/* rounded corners and padding to make more roomy */
		border-radius: 2em;
		padding: 1em;

	}
</style>

