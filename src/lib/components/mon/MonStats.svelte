<script lang="ts">
	import { ButtonGroup, CheckboxButton, Heading, Label, P } from 'flowbite-svelte';
	import { NumberInput } from '../UI';
	import { getTypeColour } from '$lib/utils';
	import type { Mon, PartyMon } from '$lib/types';

	let { mon = $bindable() }: { mon: PartyMon | Mon } = $props();

	let hiddenPowerType = $derived.by(() => {
		const types = [
			'Fighting',
			'Flying',
			'Poison',
			'Ground',
			'Rock',
			'Bug',
			'Ghost',
			'Steel',
			'Fire',
			'Water',
			'Grass',
			'Electric',
			'Psychic',
			'Ice',
			'Dragon',
			'Dark',
			'Fairy'
		];
		let x = 0;
		for (let i = 0; i < 6; i++) {
			x += (mon.dvs[i] % 2) * 2 ** i;
		}
		return types[Math.floor((x * 16) / 63)];
	});

	let hyperTrainingIndices = $state(
		mon.hyperTraining.map((val, i) => (val ? i : -1)).filter((i) => i !== -1)
	);

	function updateHyperTraining() {
		mon.hyperTraining = Array(6)
			.fill(false)
			.map((_, i) => hyperTrainingIndices.includes(i));
	}
</script>

<Heading tag="h5" class="mt-5 mb-5">Determinant Values</Heading>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
	{#each mon.dvs as dv, i}
		<div>
			<Label class="mb-2">{['HP', 'Atk', 'Def', 'Speed', 'Sp. Atk', 'Sp. Def'][i]}</Label>
			<NumberInput bind:value={mon.dvs[i]} min={0} max={15} />
		</div>
	{/each}
</div>
<div class="flex items-center mt-5 gap-2">
	<P>Hidden Power</P>
	<div
		class="flex size-[30px] items-center justify-center rounded-[50%]"
		style:background-color={getTypeColour(hiddenPowerType.toLowerCase())}
	>
		<img
			class="size-[60%] object-contain"
			src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/5781623f147f1bf850f426cfe1874ba56a9b75ee/icons/${hiddenPowerType.toLowerCase()}.svg`}
			alt={`${hiddenPowerType} logo`}
		/>
	</div>
</div>

<Heading tag="h5" class="mt-5 mb-5">Effort Values</Heading>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
	{#each mon.evs as ev, i}
		<div>
			<Label class="mb-2">{['HP', 'Atk', 'Def', 'Speed', 'Sp. Atk', 'Sp. Def'][i]}</Label>
			<NumberInput bind:value={mon.evs[i]} min={0} max={255} />
		</div>
	{/each}
</div>

<Heading tag="h5" class="mt-5 mb-5">Hyper Training</Heading>

<!-- Single row on sm and above -->
<ButtonGroup class="hidden sm:flex">
	{#each ['HP', 'Atk', 'Def', 'Speed', 'Sp. Atk', 'Sp. Def'] as stat, i}
		<CheckboxButton
			bind:group={hyperTrainingIndices}
			value={i}
			onchange={updateHyperTraining}
			class={hyperTrainingIndices.includes(i)
				? 'bg-primary-600 text-white ring-0 border-1 outline-0 border-white dark:bg-primary-600 dark:text-white'
				: 'ring-0 border-1 outline-0 border-gray-300'}>{stat}</CheckboxButton
		>
	{/each}
</ButtonGroup>

<!-- Two rows on small screens -->
<div class="flex flex-col gap-2 sm:hidden">
	<ButtonGroup class="flex w-full">
		{#each ['HP', 'Atk', 'Def'] as stat, i}
			<CheckboxButton
				bind:group={hyperTrainingIndices}
				value={i}
				onchange={updateHyperTraining}
				class="{hyperTrainingIndices.includes(i)
					? 'bg-primary-600 text-white ring-0 border-1 outline-0 border-white dark:bg-primary-600 dark:text-white'
					: 'ring-0 border-1 outline-0 border-gray-300'} flex-1">{stat}</CheckboxButton
			>
		{/each}
	</ButtonGroup>
	<ButtonGroup class="flex w-full">
		{#each ['Speed', 'Sp. Atk', 'Sp. Def'] as stat, i}
			<CheckboxButton
				bind:group={hyperTrainingIndices}
				value={i + 3}
				onchange={updateHyperTraining}
				class="{hyperTrainingIndices.includes(i + 3)
					? 'bg-primary-600 text-white ring-0 border-1 outline-0 border-white dark:bg-primary-600 dark:text-white'
					: 'ring-0 border-1 outline-0 border-gray-300'} flex-1">{stat}</CheckboxButton
			>
		{/each}
	</ButtonGroup>
</div>

<Heading tag="h5" class="mt-5 mb-5">Nature</Heading>
