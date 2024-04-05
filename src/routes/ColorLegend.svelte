<script>
	export let color;
</script>

<div class="swatches">
	<!-- for each category in our scale -->
	{#each color.domain() as d}
		<div class="swatch">
			<!-- colored square -->
			<div class="square" style:background-color={color(d)} />
			<!-- category name -->
			<div>{d}</div>
		</div>
	{/each}
</div>

<style>
	/* vertically center the swatches with 16px between them */
	.swatches {
		display: flex;
		align-items: center;
		gap: 1em;
	}

	/* vertically center the colored square and label */
	.swatch {
		display: flex;
		align-items: center;
		gap: 0.25em;
	}

	/* size of the colored square */
	.square {
		width: 15px;
		height: 15px;
	}
</style>
