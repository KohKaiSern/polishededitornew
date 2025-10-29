<script lang="ts">
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	injectAnalytics({ mode: dev ? 'development' : 'production' });
	let { children } = $props();

	injectSpeedInsights();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
