<script lang="ts">
	import type { BagSlot } from '$lib/types';

	let { bag = $bindable(), PF }: { bag: Record<string, BagSlot>; PF: 'polished' | 'faithful' } =
		$props();
</script>
