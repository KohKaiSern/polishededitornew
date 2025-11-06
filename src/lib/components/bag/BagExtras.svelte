<script lang="ts">
	import { Accordion, AccordionItem, Heading, Listgroup, ListgroupItem, P } from 'flowbite-svelte';
	import { NumberInput } from '../UI';
	import apricorns from '$data/apricorns.json';
	import type { BagSlot } from '$lib/types';

	let { bag = $bindable(), PF }: { bag: Record<string, BagSlot>; PF: 'polished' | 'faithful' } =
		$props();

	const src = (item: string): string => {
		const spritePath = apricorns[PF].find((i) => i.name === item)!.spritePath;
		return `https://raw.githubusercontent.com/KohKaiSern/polishededitor/refs/heads/main/src/${spritePath}`;
	};
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
					<NumberInput class="w-auto" bind:value={bag.candy.contents[i].qty} min={0} max={99} />
				</ListgroupItem>
			{/each}
		</Listgroup>
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Apricorns{/snippet}
		<Listgroup>
			{#each bag.apricorns.contents as apricorn, i}
				<ListgroupItem class="flex w-full flex-wrap py-3 gap-3 sm:justify-between sm:flex-nowrap">
					<div
						class="size-[35px] flex bg-white rounded-lg justify-center items-center border
							border-gray-300 dark:border-none"
					>
						<img class="rounded-sm" src={src(apricorn.name)} alt={`Sprite of ${apricorn.name}`} />
					</div>
					<P>{`${apricorn.name}: ${apricorns[PF].find((a) => a.name === apricorn.name)!.ball}`}</P>
					<NumberInput class="w-auto" bind:value={bag.apricorns.contents[i].qty} min={0} max={99} />
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
					<NumberInput class="w-auto" bind:value={bag.wings.contents[i].qty} min={0} max={999} />
				</ListgroupItem>
			{/each}
		</Listgroup>
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Blue Card Points{/snippet}
		<NumberInput class="w-auto" bind:value={bag.blueCard.contents[0].qty} min={0} max={30} />
	</AccordionItem>
</Accordion>
