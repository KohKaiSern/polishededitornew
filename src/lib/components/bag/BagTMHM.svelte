<script lang="ts">
	import { Checkbox } from 'flowbite-svelte';
	import tmhm from '$data/tmhm.json';
	import type { BagSlot } from '$lib/types';

	let { slot = $bindable(), PF }: { slot: BagSlot; PF: 'polished' | 'faithful' } = $props();

	let group = $state(
		slot.contents
			.filter((entry: { name: string; qty: number }) => entry.qty === 1)
			.map((entry: { name: string; qty: number }) => entry.name)
	);

	const onchange = (): void => {
		slot.contents.forEach((entry: { name: string; qty: number }) => {
			entry.qty = group.includes(entry.name) ? 1 : 0;
		});
	};
</script>

<div class="mt-5 grid grid-flow-col grid-rows-41 sm:grid-rows-27 md:grid-rows-21 lg:grid-rows-17">
	<Checkbox
		bind:group
		{onchange}
		classes={{ div: 'w-full p-4' }}
		choices={slot.contents.map((entry: { name: string; qty: number }) => ({
			value: entry.name,
			label: entry.name + ' ' + tmhm[PF][entry.name as keyof (typeof tmhm)['polished' | 'faithful']]
		}))}
	/>
</div>
