<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import pokemon from '$data/pokemon.json';
	import type { Mon, PartyMon } from '$lib/types';
	import type { Form } from '../../../extractors/types';
	import DropdownSearch from '../UI/DropdownSearch.svelte';
	import TextInput from '../UI/TextInput.svelte';

	let { mon = $bindable(), PF }: { mon: Mon | PartyMon; PF: 'polished' | 'faithful' } = $props();

	function changeSpecies(): void {
		const species = pokemon[PF].find((p) => p.name === mon.species)!;
		const form = (species.forms as Form[])[0];
		mon.form = form.id;
		mon.ability = form.abilities[0];
	}
</script>

<Heading tag="h6" class="mb-5">Nickname</Heading>
<TextInput bind:value={mon.nickname} maxLength={10} />
<DropdownSearch
	options={pokemon[PF].map((p) => p.name).filter((p) => !'?000?Egg?256?'.includes(p))}
	bind:value={mon.species}
	onchange={changeSpecies}
/>
<Heading tag="h6">Species & Form</Heading>
<Heading tag="h6">Held Item</Heading>
<Heading tag="h6">Ability</Heading>
<Heading tag="h6">Level</Heading>
<Heading tag="h6">Status</Heading>
<Heading tag="h6">Current HP</Heading>
