<script lang="ts">
	import { Button, Card, Drawer, Heading, P, Progressbar } from 'flowbite-svelte';
	import { EditSolid, PlusOutline } from 'flowbite-svelte-icons';
	import { getEmptyPartyMon, getGIFURL, getHPPercent, getType, getTypeColour } from '$lib/utils';
	import type { PartyMon, Player } from '$lib/types';
	import PartyMonEditor from './PartyMonEditor.svelte';

	let {
		party = $bindable(),
		player,
		PF
	}: { party: PartyMon[]; player: Player; PF: 'polished' | 'faithful' } = $props();
	let open = $state(false);
	let innerWidth = $state(0);
	let innerHeight = $state(0);
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
	{#each party as mon, i}
		{#if !party[i]}
			<Card class="p-5">
				<div class="flex gap-3 justify-between items-center min-h-[40px]">
					<Heading tag="h5">Empty</Heading>
					{#if party[i - 1]}
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
			<Card class="relative p-5">
				<div class="mb-3 flex">
					<div
						class="mr-5 flex size-[75px] items-center justify-center rounded-lg bg-white border border-gray-300 dark:border-none"
					>
						<img src={getGIFURL(mon)} alt={`GIF of the front sprite of ${mon.species}`} />
					</div>
					<div class="flex flex-col justify-between pt-1 pb-1">
						<Heading tag="h5">{mon.nickname}</Heading>
						<div class="flex gap-3">
							{#each getType(mon, PF) as type}
								<div
									class="flex size-[30px] items-center justify-center rounded-[50%]"
									style:background-color={getTypeColour(type.toLowerCase())}
								>
									<img
										class="size-[60%] object-contain"
										src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/5781623f147f1bf850f426cfe1874ba56a9b75ee/icons/${type.toLowerCase()}.svg`}
										alt={`${type} logo`}
									/>
								</div>
							{/each}
						</div>
					</div>
				</div>
				<div class="flex items-center gap-3 w-[50%]">
					<P>HP</P><Progressbar
						color={getHPPercent(mon) > 50 ? 'green' : getHPPercent(mon) > 20 ? 'yellow' : 'red'}
						progress={getHPPercent(mon).toString()}
					/>
				</div>
				<P>Lv. {mon.level}</P>
				<P>Held Item: {mon.heldItem}</P>
				<P>Ability: {mon.ability}</P>
				<P>Nature: {mon.nature}</P>
				<Button
					class="absolute right-5 bottom-5 p-2! border-gray-300 hover:bg-gray-300"
					outline
					color="dark"
					onclick={() => (open = true)}
					><EditSolid class="text-gray-600 dark:text-gray-400" /></Button
				>
			</Card>
		{/if}

		<Drawer
			bind:open
			placement={innerWidth > innerHeight ? 'right' : 'bottom'}
			class={innerWidth > innerHeight ? 'h-full w-[75%]' : 'h-[75%] w-full'}
		>
			<PartyMonEditor bind:mon={party[i]} {PF} />
		</Drawer>
	{/each}
</div>

<svelte:window bind:innerWidth bind:innerHeight />
