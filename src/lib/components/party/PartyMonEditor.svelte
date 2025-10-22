<script lang="ts">
	import type { PartyMon } from '$lib/types';

	let { mon = $bindable(), PF }: { mon: PartyMon; PF: 'polished' | 'faithful' } = $props();
</script>
