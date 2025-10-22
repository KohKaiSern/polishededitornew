<script lang="ts">
	import { Accordion, AccordionItem, Button, Heading } from 'flowbite-svelte';
	import type { Mon, PartyMon } from '$lib/types';
	import MonBasics from './MonBasics.svelte';

	let {
		mon = $bindable(),
		PF,
		onDelete
	}: { mon: PartyMon | Mon; PF: 'polished' | 'faithful'; onDelete: () => void } = $props();
</script>

<div class="relative h-full flex flex-col">
	<Heading tag="h3" class="p-2">Edit {mon.nickname}</Heading>
	<Accordion class="mt-4">
		<AccordionItem open>
			{#snippet header()}Basics{/snippet}
			<MonBasics bind:mon {PF} />
		</AccordionItem>
		<AccordionItem>
			{#snippet header()}Stats{/snippet}
			<div>TODO</div>
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
	<div class="absolute bottom-0 right-0">
		<Button color="red" onclick={onDelete}>Delete Pokémon</Button>
	</div>
</div>
