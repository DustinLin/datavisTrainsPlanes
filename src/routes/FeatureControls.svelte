<script>
	import FeatureSelect from './FeatureSelect.svelte';
	export let dataset;
	export let xFeature;
	export let yFeature;
	export let colorFeature;

	// we only want the x and y axes to be quantitative columns
	$: axisColumns = dataset.columns.filter((col) => typeof dataset[0][col] === 'number');

	// we only want the color of the circles to be categorical columns with 10 categories or fewer
	$: colorColumns = dataset.columns.filter((col) => {
		const numUnique = new Set(dataset.map((d) => d[col])).size;
		return numUnique <= 10;
	});
</script>

<div>
	<FeatureSelect bind:value={xFeature} options={axisColumns} label={'X-axis'} />
	<FeatureSelect bind:value={yFeature} options={axisColumns} label={'Y-axis'} />
	<FeatureSelect bind:value={colorFeature} options={colorColumns} label={'Color'} />
</div>

<style>
	/* place the dropdown menus next to each other with 16px of space in between */
	div {
		display: flex;
		gap: 1em;
	}
</style>
