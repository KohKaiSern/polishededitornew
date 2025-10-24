<script lang="ts">
	import { Button, Card, Heading } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { getEmptyPartyMon } from '$lib/utils';
	import type { PartyMon, Player } from '$lib/types';
	import MonCard from '../mon/MonCard.svelte';

	let {
		party = $bindable(),
		player,
		PF
	}: {
		party: (PartyMon | null)[];
		player: Player;
		PF: 'polished' | 'faithful';
	} = $props();

	function deletePokemon(index: number) {
		party.splice(index, 1);
		party.push(null);
	}
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-7">
	{#each party as mon, i}
		{#if !party[i]}
			<Card class="p-5 max-w-none">
				<div class="flex gap-3 justify-between items-center min-h-[40px]">
					<Heading tag="h5">Empty</Heading>
					{#if party[i - 1] || i === 0}
						<Button
							class="p-2! border-gray-300 hover:bg-gray-300"
							outline
							color="dark"
							onclick={() => {
								party[i] = getEmptyPartyMon(player);
							}}><PlusOutline class="text-gray-600 dark:text-gray-400" /></Button
						>
					{/if}
				</div>
			</Card>
		{:else}
			<MonCard bind:mon={party[i]} {PF} ondelete={() => deletePokemon(i)} />
		{/if}
	{/each}
</div>
