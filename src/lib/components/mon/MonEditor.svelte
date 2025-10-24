<script lang="ts">
	import { Accordion, AccordionItem, Button, Heading } from 'flowbite-svelte';
	import type { Mon, PartyMon } from '$lib/types';
	import type { Form, Species } from '../../../extractors/types';
	import MonBasics from './MonBasics.svelte';
	import MonStats from './MonStats.svelte';

	let {
		mon = $bindable(),
		species,
		form,
		PF,
		ondelete
	}: {
		mon: PartyMon | Mon;
		species: Species;
		form: Form;
		PF: 'polished' | 'faithful';
		ondelete: () => void;
	} = $props();
</script>

<Heading tag="h3" class="p-2">Edit {mon.nickname}</Heading>
<Accordion class="mt-4">
	<AccordionItem open>
		{#snippet header()}Basics{/snippet}
		<MonBasics bind:mon {species} {form} {PF} />
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Stats{/snippet}
		<MonStats bind:mon />
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Moveset{/snippet}
		<div>TODO</div>
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Miscellaneous{/snippet}
		<div>TODO</div>
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}OT & Caught Data{/snippet}
		<div>TODO</div>
	</AccordionItem>
</Accordion>
<div class="mt-5 ml-auto">
	<Button color="red" onclick={ondelete}>Delete Pokémon</Button>
</div>
