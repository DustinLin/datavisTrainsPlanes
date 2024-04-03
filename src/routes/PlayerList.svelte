<script>
	import * as d3 from 'd3';

	export let dataset;
	export let selectedIndices;
	export let onhover;

	$: players = selectedIndices.map((i) => dataset[i]).sort((a, b) => d3.ascending(a.name, b.name));
</script>

<ul>
	{#each players as player (player.name)}
		<li
			on:mouseover={() => onhover(player)}
			on:mouseleave={() => onhover(null)}
			on:focus={() => onhover(player)}
			on:focusout={() => onhover(null)}
		>
			{player.name} ({player.team})
		</li>
	{/each}
</ul>

<style>
	ul {
		width: 18em;
		/* make div no taller than its parent */
		max-height: 100%;
		/* add scrolling */
		overflow: auto;
		/* remove bullet point */
		list-style: none;
		padding: 0;
	}

	/* add space between list items */
	li + li {
		margin-top: 0.5em;
	}

	/* set background color when hovering over list item */
	li:hover {
		background-color: #dddddd;
	}
</style>
