<script lang="ts">
	import { Button, ButtonGroup, Card, Heading, Label } from 'flowbite-svelte';
	import { AngleLeftOutline, AngleRightOutline, PlusOutline } from 'flowbite-svelte-icons';
	import { DropdownSearch, TextInput } from '../UI';
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

<header class="flex gap-5 mb-5">
	<div class="flex flex-col gap-2">
		<Label>Box</Label>
		<ButtonGroup>
			<Button
				class="p-2!"
				color="purple"
				onclick={() => {
					selectedBox = selectedBox === 1 ? 20 : selectedBox - 1;
				}}><AngleLeftOutline class="h-6 w-6" /></Button
			>
			<span
				class="inline-flex text-sm items-center px-4 py-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
			>
				{selectedBox}
			</span>
			<Button
				class="p-2!"
				color="purple"
				onclick={() => {
					selectedBox = selectedBox === 20 ? 1 : selectedBox + 1;
				}}><AngleRightOutline class="h-6 w-6" /></Button
			>
		</ButtonGroup>
	</div>
	<div class="flex flex-col gap-2">
		<Label>Theme</Label>
		<DropdownSearch bind:value={boxes[selectedBox - 1].theme} options={boxThemes} />
	</div>
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		<TextInput bind:value={boxes[selectedBox - 1].name} maxLength={9} />
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
