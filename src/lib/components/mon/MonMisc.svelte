<script lang="ts">
	import { Heading, Label, P } from 'flowbite-svelte';
	import { NumberInput, RadioSelect } from '../UI';
	import type { Mon, PartyMon } from '$lib/types';
	import type { Form } from '../../../extractors/types';

	let { mon = $bindable(), form }: { mon: PartyMon | Mon; form: Form } = $props();
	function changePokerus(): void {
		if (mon.pokerus.strain === 'None' || mon.pokerus.strain === 'Cured') {
			mon.pokerus.daysRemaining = 0;
		} else {
			mon.pokerus.daysRemaining = Math.max(mon.pokerus.daysRemaining, 1);
		}
	}
	//Eggs cannot have HP
	function toggleEgg(): void {
		if (mon.isEgg) {
			if ('currentHP' in mon) {
				mon.currentHP = 0;
			}
		} else {
			if ('currentHP' in mon) {
				mon.currentHP = mon.stats[0];
			}
		}
	}
</script>

{#if mon.isEgg}
	<Heading tag="h5" class="mb-5">Hatch Cycles</Heading>
{:else}
	<Heading tag="h5" class="mb-5">Happiness</Heading>
{/if}
<NumberInput bind:value={mon.happiness} min={0} max={255} />

<Heading tag="h5" class="mt-5 mb-5">Gender</Heading>
{#if form.hasGender}
	<RadioSelect
		bind:value={mon.gender}
		options={[
			{ text: 'Male', id: 'Male' },
			{ text: 'Female', id: 'Female' }
		]}
	/>
{:else}
	<P italic>This Pokemon is genderless.</P>
{/if}

<Heading tag="h5" class="mt-5 mb-5">Shininess</Heading>
<RadioSelect
	bind:value={mon.shininess}
	options={[
		{ text: 'Shiny', id: 'Shiny' },
		{ text: 'Not Shiny', id: 'Not Shiny' }
	]}
/>

<Heading tag="h5" class="mt-5 mb-5">Is Egg</Heading>
<RadioSelect
	bind:value={mon.isEgg}
	options={[
		{ text: 'Is Egg', id: true },
		{ text: 'Is Not Egg', id: false }
	]}
	onchange={toggleEgg}
/>

<Heading tag="h5" class="mt-5 mb-5">Pokerus</Heading>

<div class="flex gap-3 flex-wrap">
	<div class="hidden sm:block">
		<RadioSelect
			bind:value={mon.pokerus.strain}
			options={[
				{ text: 'None', id: 'None' },
				{ text: 'Cured', id: 'Cured' },
				{ text: 'Strain 1', id: 1 },
				{ text: 'Strain 2', id: 2 },
				{ text: 'Strain 3', id: 3 },
				{ text: 'Strain 4', id: 4 }
			]}
			onchange={changePokerus}
		/>
	</div>

	<div class="flex gap-3 flex-wrap sm:hidden">
		<RadioSelect
			bind:value={mon.pokerus.strain}
			options={[
				{ text: 'None', id: 'None' },
				{ text: 'Cured', id: 'Cured' }
			]}
			onchange={changePokerus}
		/>
		<RadioSelect
			bind:value={mon.pokerus.strain}
			options={[
				{ text: 'Strain 1', id: 1 },
				{ text: 'Strain 2', id: 2 },
				{ text: 'Strain 3', id: 3 },
				{ text: 'Strain 4', id: 4 }
			]}
			onchange={changePokerus}
		/>
	</div>

	{#if mon.pokerus.daysRemaining != 0}
		<div class="flex flex-col gap-2">
			<Label>Days Remaining</Label>
			<NumberInput bind:value={mon.pokerus.daysRemaining} min={1} max={4} />
		</div>
	{/if}
</div>
