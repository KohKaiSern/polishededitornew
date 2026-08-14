<script lang="ts">
	import MonCard from '$components/mon/mon-card.svelte';
	import boxThemes from '$data/boxThemes.json';
	import type { Box, BoxMon, Player } from '$parsers/types';
	import { Combobox, TextInput, Carousel } from '$ui';
	import { Button, Card, Heading, Label } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	let {
		boxes = $bindable(),
		player,
		PF
	}: { boxes: Box[]; player: Player; PF: 'polished' | 'faithful' } = $props();
	let selectedBox = $state(1);

	function onadd(): BoxMon {
		return {
			species: 'Bulbasaur',
			form: 'Plain',
			dunsparceForm: 'Two-Segment',
			heldItem: 'None',
			moveset: ['Tackle', 'None', 'None', 'None'],
			OTID: player.id,
			exp: 0,
			evs: [0, 0, 0, 0, 0, 0],
			dvs: [0, 0, 0, 0, 0, 0],
			shininess: 'Not Shiny',
			ability: 'Overgrow',
			nature: 'Hardy',
			isEgg: false,
			gender: 'Male',
			PPUPs: [0, 0, 0, 0],
			happiness: 0,
			pokerus: {
				strain: 'None'
			},
			level: 1,
			caughtBall: 'Poké Ball',
			caughtTime: 'Day',
			caughtLevel: 1,
			caughtLocation: 'New Bark Town',
			hyperTraining: [false, false, false, false, false, false],
			nickname: ['B', 'u', 'l', 'b', 'a', 's', 'a', 'u', 'r'],
			OTNickname: player.name
		};
	}
</script>

<header class="flex gap-5 mb-5 bg-white dark:bg-gray-900 sticky top-0 pt-3 pb-4 z-10 flex-wrap">
	<div class="flex flex-col gap-2">
		<Label>Box</Label>
		<Carousel bind:value={selectedBox} min={1} max={20} />
	</div>
	<div class="flex flex-col gap-2">
		<Label>Theme</Label>
		<Combobox
			bind:value={boxes[selectedBox - 1].theme}
			options={boxThemes[PF].map((b) => b.name)}
		/>
	</div>
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		{#key selectedBox}
			<TextInput bind:value={boxes[selectedBox - 1].name} maxLength={9} />
		{/key}
	</div>
</header>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
	{#each boxes[selectedBox - 1].mons as mon, i}
		{#if !mon}
			<Card class="p-5 max-w-none">
				<div class="flex gap-3 justify-between items-center min-h-[40px]">
					<Heading tag="h5">Empty</Heading>
					<Button
						class="p-2! border-gray-300 hover:bg-gray-300"
						outline
						color="dark"
						onclick={() => {
							boxes[selectedBox - 1].mons[i] = onadd();
						}}><PlusOutline class="text-gray-600 dark:text-gray-400" /></Button
					>
				</div>
			</Card>
		{:else}
			<MonCard
				bind:mon={boxes[selectedBox - 1].mons[i]!}
				{PF}
				ondelete={() => {
					boxes[selectedBox - 1].mons[i] = null;
				}}
			/>
		{/if}
	{/each}
</div>
