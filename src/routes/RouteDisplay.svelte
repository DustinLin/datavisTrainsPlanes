<script>
	//import * as d3 from 'd3';

	export let highlightedRoute; 

	import {cityPairsToCities, cityStToCity} from '../utils';


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
</script>

{#if highlightedRoute}
<div class="routeInfo">
	<ul>
		<li>Origin City: {cityStToCity(cityPairsToCities(highlightedRoute[0])[0])}</li>
		<li>Origin Airport: {highlightedRoute[1].ORIGIN} </li>
		<li>Destination City: {cityStToCity(cityPairsToCities(highlightedRoute[0])[1])}</li>
		<li>Destination Airport: {highlightedRoute[1].DEST} </li>
		<li>Distance: {highlightedRoute[1].DISTANCE} miles </li>
		<li>Passengers: {highlightedRoute[1].PASSENGERS}</li>
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
	/* todo styling */
	.routeInfo {
		flex: 1;
		width: 500px;
	}
</style>

