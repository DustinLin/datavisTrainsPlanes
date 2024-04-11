
<script>
	/**
	 * The "map component"?
	*/

	import {cityPairsToCities, cityStToCity, numberWithCommas, minToHours} from '../utils';


	/**
	 * TODO, want to export routes and connect with data want to plot
	 * 
	 * Design choice of if should import from Map.svelte for main page:
	 * 	- seems like former would be better? since each top-routes should be map specific
	 */

	//export let routes;

	// trying to plot lines and add interaction?
	// from observable its an array of arrays
	const mockData = [ [ "(Boston_MA, New York_NY)",
	  { DEPARTURES_PERFORMED: 35030,
		SEATS: 3529952,
		RAMP_TO_RAMP: 2707512,
		PASSENGERS: 2662158,
		FREIGHT: 577035,
		DEST: "EWR",
		ORIGIN: "BOS",
		DISTANCE: 193,
		GRAVITY: 65.42354467661713 }
	 ],
    
  	[ "(Las Vegas_NV, Los Angeles_CA)",
		{ DEPARTURES_PERFORMED: 19538,
		SEATS: 3182337,
		RAMP_TO_RAMP: 1426792,
		PASSENGERS: 2504847,
		FREIGHT: 3161983,
		DEST: "LAX",
		DEST_STATE: "CA",
		ORIGIN: "LAS",
		ORIGIN_STATE: "NV",
		DISTANCE: 236,
		GRAVITY: 34.3296697359362, }
	]
	]

	
</script>

<div class="TopChart">
<h3>Top flights by passengers carried</h3>

<table>
  <tr>
    <th>Origin City</th>
    <th>Destination City</th>
    <th>Num. Passengers</th>
    <!-- <th>Distance (miles)</th>
    <th>Time: Ramp to Ramp (hours)</th> -->
  </tr>
  {#each mockData as route}
  <tr>
    <td>{cityStToCity(cityPairsToCities(route[0])[0])}</td>
    <td>{cityStToCity(cityPairsToCities(route[0])[1])}</td>
    <td>{numberWithCommas(route[1].PASSENGERS)} People</td>
    <!-- <td>{numberWithCommas(route[1].DISTANCE)} Miles</td>
    <td>{minToHours(route[1].RAMP_TO_RAMP, route[1].DEPARTURES_PERFORMED)} Hours</td> -->
  </tr>

  {/each}
</table> 



</div>

<style>
	.TopChart{
	}
	table {
		font-family: arial, sans-serif;
		border-collapse: collapse;
		width: 100%;
	}

	td, th {
	border: 1px solid #dddddd;
	text-align: left;
	padding: 8px;
	}

	tr:nth-child(even) {
	background-color: #dddddd;
	}

</style>
