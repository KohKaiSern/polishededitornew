<script lang="ts">
	import abilities from '$data/abilities.json';
	import items from '$data/items.json';
	import pokemon from '$data/pokemon.json';
	import type { Form, Species } from '$extractors/types';
	import type { BoxMon, PartyMon } from '$parsers/types';
	import { TextInput, RadioSelect, NumberInput, ItemIcon, DropdownSelect, Combobox } from '$ui';
	import { Heading, P } from 'flowbite-svelte';

	interface BasicsProps {
		mon: PartyMon | BoxMon;
		species: Species;
		form: Form;
		PF: 'polished' | 'faithful';
	}

	let { mon = $bindable(), species, form, PF }: BasicsProps = $props();
	let hpRatio = $state('currentHP' in mon ? Math.ceil((mon.currentHP / mon.stats[0]) * 100) : 0);

	function resetMon(): void {
		mon.form = species.forms.find((f) => f.index === 1)!.name;
		resetForm();
	}
	function resetForm(): void {
		mon.ability = form.abilities[0];
		mon.gender = form.hasGender ? mon.gender : 'Genderless';
		setExpForLvl();
	}

	function setExpForLvl(): void {
		mon.exp = Math.max(
			Math.floor((form.growthCFs[0] / form.growthCFs[1]) * mon.level ** 3) +
				form.growthCFs[2] * mon.level ** 2 +
				form.growthCFs[3] * mon.level -
				form.growthCFs[4],
			0
		);
	}
</script>

<Heading tag="h5">Nickname</Heading>
<TextInput bind:value={mon.nickname} maxLength={10} class="my-5" />

<Heading tag="h5">Species & Form</Heading>
<div class="flex gap-3 my-5">
	<Combobox
		options={pokemon[PF].map((p) => p.name).filter((p) => !'?000?Egg?256?'.includes(p))}
		bind:value={mon.species}
		onchange={resetMon}
	/>
	<DropdownSelect
		options={species.forms.map((f) => f.name)}
		bind:value={mon.form}
		onchange={resetForm}
	/>
</div>

{#if species.id === 'DUNSPARCE'}
	<Heading tag="h5">Evolution Form</Heading>
	<P class="my-5" italic>
		Determines whether this Dunsparce becomes a Two-Segment or Three-Segment Dudunsparce when it
		evolves.
	</P>
	<div class="flex gap-3 my-5">
		<DropdownSelect options={['Two-Segment', 'Three-Segment']} bind:value={mon.dunsparceForm} />
	</div>
{/if}

<Heading tag="h5" class="mb-5">Held Item</Heading>
{#if 'currentHP' in mon}
	<Combobox
		options={['None'].concat(items[PF].slice(1).map((item) => item.name))}
		bind:value={mon.heldItem}
	/>
{:else}
	<Combobox
		options={['None']
			.concat(items[PF].map((item) => item.name))
			.filter((name) => !name.includes('Mail'))}
		bind:value={mon.heldItem}
	/>
{/if}
<div class="flex items-center mt-5 gap-3">
	<ItemIcon heldItem={mon.heldItem} {PF} />
	{#if mon.heldItem === 'None'}
		<P italic>This Pokemon has no held item.</P>
	{:else}
		<P italic>{items[PF].find((i) => i.name === mon.heldItem)!.description}</P>
	{/if}
</div>

<Heading tag="h5" class="mt-5 mb-5">Ability</Heading>
<RadioSelect options={form.abilities.map((a) => ({ text: a, id: a }))} bind:value={mon.ability} />
<P class="mt-5" italic>{abilities[PF].find((a) => a.name === mon.ability)!.description}</P>

<Heading tag="h5" class="mt-5 mb-[-10px]">Level</Heading>
<NumberInput bind:value={mon.level} min={1} max={100} onchange={setExpForLvl} />

{#if 'currentHP' in mon && !mon.isEgg}
	<Heading tag="h5" class="mt-5 mb-[-10px]">Current HP%</Heading>
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
	{#if mon.currentHP != 0}
		<div class="flex gap-5 items-start flex-wrap sm:flex-nowrap my-5">
			<div>
				<Heading tag="h5" class="mb-5">Status</Heading>
				<DropdownSelect
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
					<Heading tag="h5" class="mb-[-10px] sm:mb-0">Sleep Duration</Heading>
					<NumberInput bind:value={mon.status.turnsRemaining!} min={1} max={7} />
				</div>
			{/if}
		</div>
	{/if}
{/if}
