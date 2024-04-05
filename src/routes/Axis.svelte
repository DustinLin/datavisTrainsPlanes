<script>
	import { fade } from 'svelte/transition';

	export let orientation;
	export let margin;
	export let width;
	export let height;
	export let scale;
	export let label = '';

	// band scales don't have a ticks function. so if it's
	// a band scale, we will use the domain as the ticks
	$: ticks = scale.bandwidth ? scale.domain() : scale.ticks();

	// we want the tick marks for band scales to be in the center of the bands,
	// so we need to offset them by half of the band width
	$: offset = scale.bandwidth ? scale.bandwidth() / 2 : 0;
</script>

<!-- whenever the scale changes, fade the axis out and in -->
{#key scale}
	<g transition:fade={{ duration: 250 }}>
		{#if orientation === 'left'}
			<g transform="translate({margin.left})">
				{#each ticks as tick}
					<g transform="translate(0,{scale(tick) + offset})">
						<line x2={-6} stroke="black" />
						<text text-anchor="end" dominant-baseline="middle" fill="black" x={-10}>{tick}</text>
					</g>
				{/each}

				{#if label}
					<text text-anchor="start" dominant-baseline="hanging" fill="black" x={-margin.left} y={0}>
						{label}
					</text>
				{/if}
			</g>
		{:else}
			<g transform="translate(0,{height - margin.bottom})">
				{#each ticks as tick}
					<g transform="translate({scale(tick) + offset})">
						<line y2={6} stroke="black" />
						<text text-anchor="middle" dominant-baseline="hanging" fill="black" y={10}>{tick}</text>
					</g>
				{/each}

				{#if label}
					<text text-anchor="end" dominant-baseline="hanging" fill="black" x={width} y={30}>
						{label}
					</text>
				{/if}
			</g>
		{/if}
	</g>
{/key}
