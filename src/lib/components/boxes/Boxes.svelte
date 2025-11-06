<script lang="ts">
	import { Button, Card, Heading, Label } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { DropdownSearch, NumberInput, TextInput } from '../UI';
	import boxThemes from '$data/boxThemes.json';
	import { getEmptyBoxMon } from '$lib/utils';
	import type { Box, Player } from '$lib/types';
	import MonCard from '../mon/MonCard.svelte';

	let {
		boxes = $bindable(),
		player,
		PF
	}: { boxes: Box[]; player: Player; PF: 'polished' | 'faithful' } = $props();
	let selectedBox = $state(1);
</script>

<header class="flex gap-5 mb-5 bg-gray-100 dark:bg-gray-900 sticky top-0 pt-3 pb-4 z-10">
	<div class="flex flex-col gap-2">
		<Label>Box</Label>
		<NumberInput bind:value={selectedBox} min={1} max={20} carousel class="w-32" />
	</div>
	<div class="flex flex-col gap-2">
		<Label>Theme</Label>
		<DropdownSearch
			bind:value={boxes[selectedBox - 1].theme}
			options={boxThemes[PF].map((b) => b.name)}
			class="h-full"
		/>
	</div>
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		{#key selectedBox}
			<TextInput bind:value={boxes[selectedBox - 1].name} maxLength={9} />
		{/key}
	</div>
</header>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
	{#each boxes[selectedBox - 1].mons as mon, i}
		{#if !mon}
			<Card class="p-5 max-w-none">
				<div class="flex gap-3 justify-between items-center min-h-[40px]">
					<Heading tag="h5">Empty</Heading>
					<Button
						class="p-2! border-gray-300 hover:bg-gray-300"
						outline
						color="dark"
						onclick={() => {
							boxes[selectedBox - 1].mons[i] = getEmptyBoxMon(player);
						}}><PlusOutline class="text-gray-600 dark:text-gray-400" /></Button
					>
				</div>
			</Card>
		{:else}
			<MonCard
				bind:mon={boxes[selectedBox - 1].mons[i]!}
				{PF}
				ondelete={() => {
					boxes[selectedBox - 1].mons[i] = null;
				}}
			/>
		{/if}
	{/each}
</div>
