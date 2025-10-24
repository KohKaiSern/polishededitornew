<script lang="ts">
	import { Button, ButtonGroup, Dropdown, DropdownItem, P, Search } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import moves from '$data/moves.json';
	import { getTypeColour } from '$lib/utils';
	import type { Form } from '../../../extractors/types';

	let {
		move = $bindable(),
		form,
		PF
	}: { move: string; form: Form; PF: 'polished' | 'faithful' } = $props();

	let groupOpen = $state(false);
	let itemOpen = $state(false);
	let searchTerm = $state('');
	let selectedGroup = $state('Level-Up Moves');
	let moveList = $derived.by(() => {
		if (selectedGroup === 'Level-Up Moves') {
			return ['None', ...form.learnsets.level.map((m) => m.name)];
		} else if (selectedGroup === 'Egg Moves') {
			return ['None', ...form.learnsets.egg];
		} else if (selectedGroup === 'TM & HM Moves') {
			return ['None', ...form.learnsets.tmhm];
		} else {
			return ['None', ...moves[PF].map((m) => m.name)];
		}
	});
	let filteredMoves = $derived(
		moveList.filter((move) => move.toLowerCase().includes(searchTerm.toLowerCase()))
	);
	function getType(moveName: string): string {
		return moves[PF].find((m) => m.name === moveName)!.type;
	}
</script>

<ButtonGroup class="flex">
	<Button
		onclick={() => {
			groupOpen = true;
		}}
		class="justify-between"
	>
		{selectedGroup}
		<ChevronDownOutline class="ms-2 h-6 w-6 text-black dark:text-white" />
	</Button>
	<Dropdown bind:isOpen={groupOpen} class="list-none">
		{#each ['Level-Up Moves', 'Egg Moves', 'TM & HM Moves', 'All Moves'] as learnset}
			<DropdownItem class="p-0">
				<Button
					outline
					onclick={() => {
						selectedGroup = learnset;
						groupOpen = false;
					}}
					class="text-black dark:text-white justify-start rounded-none border-0 w-full h-full hover:bg-gray-200 hover:text-black dark:hover:text-white dark:hover:bg-gray-500"
				>
					{learnset}
				</Button>
			</DropdownItem>
		{/each}
	</Dropdown>
	<Button
		class="flex-grow justify-between !border-r-1 !rounded-r-lg px-4 py-2.5"
		onclick={() => {
			itemOpen = true;
		}}
	>
		{#if move === 'None'}
			None
		{:else}
			<div class="flex flex-nowrap items-center text-white">
				{#if getType(move) === 'UNKNOWN_T'}
					<div
						class="flex size-[30px] items-center justify-center rounded-[50%] mr-3 bg-gray-400 text-lg"
					>
						?
					</div>
				{:else}
					<div
						class="flex size-[30px] items-center justify-center rounded-[50%] mr-3"
						style:background-color={getTypeColour(getType(move).toLowerCase())}
					>
						<img
							class="size-[60%] object-contain"
							src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/5781623f147f1bf850f426cfe1874ba56a9b75ee/icons/${getType(move).toLowerCase()}.svg`}
							alt={`${getType(move)} logo`}
						/>
					</div>
				{/if}
				{move}
			</div>
		{/if}
		<ChevronDownOutline class="ms-2 h-6 w-6 text-black dark:text-white" /></Button
	>
	<Dropdown class="w-70 h-70 overflow-y-auto py-1" bind:isOpen={itemOpen}>
		<div class="p-3">
			<Search size="md" bind:value={searchTerm} />
		</div>
		{#each filteredMoves as moveOption}
			<DropdownItem class="p-0">
				<Button
					outline
					onclick={() => {
						move = moveOption;
						itemOpen = false;
					}}
					class="text-black dark:text-white justify-start rounded-none border-0 w-full h-full hover:bg-gray-200 hover:text-black dark:hover:text-white dark:hover:bg-gray-500"
				>
					{#if moveOption != 'None'}
						{#if getType(moveOption) === 'UNKNOWN_T'}
							<div
								class="flex size-[30px] items-center justify-center rounded-[50%] mr-3 bg-gray-400 text-lg"
							>
								?
							</div>
						{:else}
							<div
								class="flex size-[30px] items-center justify-center rounded-[50%] mr-3"
								style:background-color={getTypeColour(getType(moveOption).toLowerCase())}
							>
								<img
									class="size-[60%] object-contain"
									src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/5781623f147f1bf850f426cfe1874ba56a9b75ee/icons/${getType(moveOption).toLowerCase()}.svg`}
									alt={`${getType(moveOption)} logo`}
								/>
							</div>
						{/if}

						{#if selectedGroup === 'Level-Up Moves'}
							<P class="text-gray-700 dark:text-gray-400 text-xs mr-3"
								>Lv. {form.learnsets.level.find((m) => m.name === moveOption)!.level}</P
							>
						{/if}
					{/if}
					{moveOption}
				</Button>
			</DropdownItem>
		{/each}
	</Dropdown>
</ButtonGroup>
