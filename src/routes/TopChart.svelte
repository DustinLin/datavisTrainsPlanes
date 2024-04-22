
<script>
	/**
	 * The "map component"?
	*/

	import {cityPairsToCities, cityStToCity, cityStToState} from '../utils';


	/**
	 * TODO, want to export routes and connect with data want to plot
	 * 
	 * Design choice of if should import from Map.svelte for main page:
	 * 	- seems like former would be better? since each top-routes should be map specific
	 */

	//export let routes;

	// trying to plot lines and add interaction?
	// from observable its an array of arrays
	export let railLines;
	export let mapId;
	export let onhover;

	let routeOrder = 1
	const routeInc = () => routeOrder++

	const col = "#FFA8A8"
</script>

<div class="TopChart">
<h3>Iterated gravity model results: rail locations</h3>

<table>
  <tr>
    <th>Order Built</th>
    <th>Pairwise City</th>
  </tr>
  {#each railLines as railLine}
  <tr
	on:mouseover={() => onhover(railLine, mapId )}
	on:focus={() => onhover(railLine, mapId )}
  >
    <td>{routeInc()}</td>
    <td>{cityStToCity(cityPairsToCities(railLine)[0])}, {cityStToState(cityPairsToCities(railLine)[0])} - {cityStToCity(cityPairsToCities(railLine)[1])}, {cityStToState(cityPairsToCities(railLine)[1])} </td>
  </tr>

  {/each}
</table> 



</div>

<style>
	.TopChart{
		overflow: scroll;
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
	tr:hover {
		background-color: #FF4D4D ;
	}
</style>
