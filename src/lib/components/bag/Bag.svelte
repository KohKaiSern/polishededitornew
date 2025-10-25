<script lang="ts">
	import { RadioSelect } from '../UI';
	import items from '$data/items.json';
	import type { BagSlot } from '$lib/types';
	import BagCountedSlot from './BagCountedSlot.svelte';
	import BagExtras from './BagExtras.svelte';
	import BagKeyItems from './BagKeyItems.svelte';
	import BagTMHM from './BagTMHM.svelte';

	let { bag = $bindable(), PF }: { bag: Record<string, BagSlot>; PF: 'polished' | 'faithful' } =
		$props();
	let selectedSlot = $state('items');
</script>

<div class="mt-8 hidden sm:block">
	<RadioSelect
		bind:value={selectedSlot}
		options={[
			{ text: 'Items', id: 'items' },
			{ text: 'Medicine', id: 'medicine' },
			{ text: 'Balls', id: 'balls' },
			{ text: 'TMs & HMs', id: 'TMsHMs' },
			{ text: 'Berries', id: 'berries' },
			{ text: 'Key Items', id: 'keyItems' },
			{ text: 'Extras', id: 'extras' }
		]}
	/>
</div>
<div class="mt-8 flex flex-col gap-3 sm:hidden">
	<RadioSelect
		bind:value={selectedSlot}
		options={[
			{ text: 'Items', id: 'items' },
			{ text: 'Medicine', id: 'medicine' },
			{ text: 'Balls', id: 'balls' },
			{ text: 'TMs & HMs', id: 'TMsHMs' }
		]}
	/>
	<RadioSelect
		bind:value={selectedSlot}
		options={[
			{ text: 'Berries', id: 'berries' },
			{ text: 'Key Items', id: 'keyItems' },
			{ text: 'Extras', id: 'extras' }
		]}
	/>
</div>

{#if ['items', 'medicine', 'balls', 'berries'].includes(selectedSlot)}
	<BagCountedSlot
		bind:slot={bag[selectedSlot]}
		capacity={{
			items: 75,
			medicine: 37,
			balls: 25,
			berries: 31
		}[selectedSlot]!}
		itemList={items[PF].filter(
			(item) =>
				item.category ===
				{
					items: 'ITEM',
					medicine: 'MEDICINE',
					balls: 'BALL',
					berries: 'BERRIES'
				}[selectedSlot]!
		)}
	/>
{/if}

{#if selectedSlot === 'TMsHMs'}
	<BagTMHM bind:slot={bag.TMsHMs} {PF} />
{/if}

{#if selectedSlot === 'keyItems'}
	<BagKeyItems bind:slot={bag.keyItems} {PF} />
{/if}

{#if selectedSlot === 'extras'}
	<BagExtras bind:bag {PF} />
{/if}
