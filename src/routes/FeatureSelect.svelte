<script>
	export let value;
	export let options;
	export let label;
</script>

<div>
	<div>{label}</div>
	<select bind:value>
		{#each options as opt}
			<option>{opt}</option>
		{/each}
	</select>
</div>

<style>
	/* place the label and the dropdown menu next to each other and vertically centered */
	div {
		display: flex;
		align-items: center;
		gap: 0.25em;
	}
</style>
