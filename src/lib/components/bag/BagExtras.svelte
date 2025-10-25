<script lang="ts">
	import { Accordion, AccordionItem, Heading, Listgroup, ListgroupItem, P } from 'flowbite-svelte';
	import { NumberInput } from '../UI';
	import apricorns from '$data/apricorns.json';
	import type { BagSlot } from '$lib/types';

	let { bag = $bindable(), PF }: { bag: Record<string, BagSlot>; PF: 'polished' | 'faithful' } =
		$props();
</script>

<Accordion class="mt-8">
	<AccordionItem>
		{#snippet header()}Game Corner Coins{/snippet}
		<NumberInput class="w-auto" bind:value={bag.coins.contents[0].qty} min={0} max={50000} />
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Experience Candy{/snippet}
		<Listgroup>
			{#each bag.candy.contents as candy, i}
				<ListgroupItem class="flex w-full flex-wrap py-3 gap-3 sm:justify-between sm:flex-nowrap">
					<P>{candy.name}</P>
					<NumberInput class="w-auto" bind:value={bag.candy.contents[i].qty} min={0} max={255} />
				</ListgroupItem>
			{/each}
		</Listgroup>
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Apricorns{/snippet}
		<Listgroup>
			{#each bag.apricorns.contents as apricorn, i}
				<ListgroupItem class="flex w-full flex-wrap py-3 gap-3 sm:justify-between sm:flex-nowrap">
					<P>{`${apricorn.name}: ${apricorns[PF].find((a) => a.name === apricorn.name)!.ball}`}</P>
					<NumberInput
						class="w-auto"
						bind:value={bag.apricorns.contents[i].qty}
						min={0}
						max={255}
					/>
				</ListgroupItem>
			{/each}
		</Listgroup>
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Wings{/snippet}
		<Listgroup>
			{#each bag.wings.contents as wing, i}
				<ListgroupItem class="flex w-full flex-wrap py-3 gap-3 sm:justify-between sm:flex-nowrap">
					<P>{wing.name}</P>
					<NumberInput class="w-auto" bind:value={bag.wings.contents[i].qty} min={0} max={65535} />
				</ListgroupItem>
			{/each}
		</Listgroup>
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Blue Card Points{/snippet}
		<NumberInput class="w-auto" bind:value={bag.blueCard.contents[0].qty} min={0} max={255} />
	</AccordionItem>
</Accordion>
