<script>
	/**
	 * the landing page, idea is to have a giant scroll area?
	 * 
	*/

	import './style.css';
	import * as d3 from 'd3';
	import Scatterplot from './Scatterplot.svelte';
	import FeatureControls from './FeatureControls.svelte';
	import BarChart from './BarChart.svelte';
	import PlayerList from './PlayerList.svelte';
	import ColorLegend from './ColorLegend.svelte';

	// data comes from the load function in +page.js
	export let data;

	// default features to visualize
	let xFeature = 'strikeout';
	let yFeature = 'hit';
	let colorFeature = 'all_star';

	// indices of the brushed data points in the scatter plot
	let selectedIndices = [];

	// callback function to update selectedIndices when the scatterplot is brushed
	function onbrush(indices) {
		selectedIndices = indices;
	}

	// data point that is highlighted in the list
	let highlightedPlayer = null;

	// callback function to update highlightedPlayer when the list is hovered over
	function onhover(player) {
		highlightedPlayer = player;
	}

	// get the unique categories in the dataset sorted by count
	$: categories = d3
		.groupSort(
			data.dataset,
			(g) => g.length,
			(d) => d[colorFeature]
		)
		.reverse();

	$: color = d3.scaleOrdinal().domain(categories).range(d3.schemeTableau10);
</script>

<div class="container">
	<div class="header">
		<FeatureControls dataset={data.dataset} bind:xFeature bind:yFeature bind:colorFeature />
		<ColorLegend {color} {colorFeature} />
	</div>
	<div class="main">
		<PlayerList dataset={data.dataset} {selectedIndices} {onhover} />
		<Scatterplot
			dataset={data.dataset}
			{xFeature}
			{yFeature}
			{colorFeature}
			{color}
			{highlightedPlayer}
			{onbrush}
		/>
		<BarChart dataset={data.dataset} feature={colorFeature} {selectedIndices} {color} />
	</div>
</div>

<style>
	.container {
		/* set the font */
		font-family: system-ui, sans-serif;
		font-size: 16px;
		/* make the div take up the entire screen */
		height: 100vh;
		width: 100vw;
		/* add 32px of padding around the div */
		padding: 2em;
		/* put the controls on top of the plots with 32px of space in between */
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	/* place the feature controls and color legend next to each other */
	.header {
		display: flex;
		gap: 2em;
		align-items: center;
	}

	.main {
		/* make this div take up the rest of the container */
		flex: 1;
		/* allow the div to shrink */
		min-height: 0;
		/* place the children next to each other */
		display: flex;
		/* add space between them */
		gap: 2em;
	}
</style>
