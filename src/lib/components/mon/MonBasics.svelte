<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import { DropdownSearch, NumberInput, RadioSelect, TextInput } from '../UI';
	import growthRateCoefficients from '$data/growthRateCoefficients.json';
	import items from '$data/items.json';
	import pokemon from '$data/pokemon.json';
	import type { Mon, PartyMon } from '$lib/types';
	import type { Form, Species } from '../../../extractors/types';

	let {
		mon = $bindable(),
		species,
		form,
		PF
	}: { mon: Mon | PartyMon; species: Species; form: Form; PF: 'polished' | 'faithful' } = $props();

	function resetMon(): void {
		mon.form = species.forms[0].id!;
		resetForm();
	}
	function resetForm(): void {
		mon.ability = form.abilities[0];
		mon.gender = form.hasGender ? mon.gender : 'Genderless';
		mon.nickname = pokemon[PF].find((p) => p.name === mon.nickname) ? mon.species : mon.nickname;
	}

	function getExpForLvl(): void {
		const cf =
			growthRateCoefficients[PF][
				form.growthRate as keyof (typeof growthRateCoefficients)['polished' | 'faithful']
			];
		mon.exp = Math.max(
			Math.ceil(
				(cf[0] / cf[1]) * mon.level ** 3 + cf[2] * mon.level ** 2 + cf[3] * mon.level - cf[4]
			),
			0
		);
	}

	let hpRatio = $state('currentHP' in mon ? Math.ceil(mon.currentHP / mon.stats[0]) * 100 : 0);
</script>

<Heading tag="h5" class="mb-5">Nickname</Heading>
<TextInput bind:value={mon.nickname} maxLength={10} />

<Heading tag="h5" class="mt-5 mb-5">Species & Form</Heading>
<div class="flex gap-3">
	<DropdownSearch
		options={pokemon[PF].map((p) => p.name).filter((p) => !'?000?Egg?256?'.includes(p))}
		bind:value={mon.species}
		onchange={resetMon}
	/>
	<DropdownSearch
		options={species.forms.map((f) => f.id!)}
		bind:value={mon.form}
		onchange={resetForm}
	/>
</div>
<Heading tag="h5" class="mt-5 mb-5">Held Item</Heading>
{#if 'currentHP' in mon}
	<DropdownSearch
		options={['None'].concat(items[PF].map((item) => item.name))}
		bind:value={mon.heldItem}
	/>
{:else}
	<DropdownSearch
		options={['None']
			.concat(items[PF].map((item) => item.name))
			.filter((name) => !name.includes('Mail'))}
		bind:value={mon.heldItem}
	/>
{/if}
<Heading tag="h5" class="mt-5 mb-5">Ability</Heading>
<RadioSelect options={form.abilities.map((a) => ({ text: a, id: a }))} bind:value={mon.ability} />
<Heading tag="h5" class="mt-5 mb-5">Level</Heading>
<NumberInput bind:value={mon.level} min={1} max={100} onchange={getExpForLvl} />

{#if 'currentHP' in mon && !mon.isEgg}
	<Heading tag="h5" class="mt-5 mb-5">Current HP%</Heading>
	<NumberInput
		bind:value={hpRatio}
		min={0}
		max={100}
		onchange={() => {
			mon.currentHP = Math.ceil((hpRatio / 100) * mon.stats[0]);
			if (mon.currentHP === 0) {
				mon.status.name = 'None';
			}
		}}
	/>
	<div class="flex gap-3 items-end flex-wrap sm:flex-nowrap">
		<div>
			<Heading tag="h5" class="mt-5 mb-5">Status</Heading>
			<DropdownSearch
				options={['None', 'Paralysis', 'Burn', 'Freeze', 'Poison', 'Sleep']}
				bind:value={mon.status.name}
				onchange={() => {
					if (mon.status.name === 'Sleep') {
						mon.status.turnsRemaining = 1;
					}
				}}
			/>
		</div>
		{#if mon.status.name === 'Sleep'}
			<div>
				<Heading tag="h5" class="mt-5 mb-5">Sleep Duration</Heading>
				<NumberInput bind:value={mon.status.turnsRemaining!} min={1} max={7} />
			</div>
		{/if}
	</div>
{/if}
