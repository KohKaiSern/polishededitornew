<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import items from '$data/items.json';
	import pokemon from '$data/pokemon.json';
	import type { Mon, PartyMon } from '$lib/types';
	import type { Form } from '../../../extractors/types';
	import DropdownSearch from '../UI/DropdownSearch.svelte';
	import RadioSelect from '../UI/RadioSelect.svelte';
	import TextInput from '../UI/TextInput.svelte';

	let { mon = $bindable(), PF }: { mon: Mon | PartyMon; PF: 'polished' | 'faithful' } = $props();

	function changeSpecies(): void {
		const species = pokemon[PF].find((p) => p.name === mon.species)!;
		const form = (species.forms as Form[])[0];
		resetProps(form);
	}

	function changeForm(): void {
		const species = pokemon[PF].find((p) => p.name === mon.species)!;
		const form = (species.forms as Form[]).find((f) => f.id === mon.form)!;
		resetProps(form);
	}

	function resetProps(form: Form): void {
		mon.ability = form.abilities[0];
		mon.gender = form.hasGender ? mon.gender : 'Genderless';
		mon.nickname = pokemon[PF].find((p) => p.name === mon.nickname) ? mon.species : mon.nickname;
	}
</script>

<Heading tag="h5" class="mb-5">Nickname</Heading>
<TextInput bind:value={mon.nickname} maxLength={10} />

<Heading tag="h5" class="mt-5 mb-5">Species & Form</Heading>
<div class="flex gap-3">
	<DropdownSearch
		options={pokemon[PF].map((p) => p.name).filter((p) => !'?000?Egg?256?'.includes(p))}
		bind:value={mon.species}
		onchange={changeSpecies}
	/>
	<DropdownSearch
		options={pokemon[PF].find((p) => p.name === mon.species)!.forms.map((f) => f.id)}
		bind:value={mon.form}
		onchange={changeForm}
	/>
</div>
<Heading tag="h5" class="mt-5 mb-5">Held Item</Heading>
<DropdownSearch
	options={['None'].concat(items[PF].map((item) => item.name))}
	bind:value={mon.heldItem}
/>
<Heading tag="h5" class="mt-5 mb-5">Ability</Heading>
<RadioSelect
	options={(pokemon[PF].find((p) => p.name === mon.species)!.forms as Form[])
		.find((f) => f.id === mon.form)!
		.abilities.map((a) => ({ text: a, id: a }))}
	bind:value={mon.ability}
/>
<Heading tag="h5" class="mt-5 mb-5">Level</Heading>
<Heading tag="h5">Status</Heading>
<Heading tag="h5">Current HP</Heading>
