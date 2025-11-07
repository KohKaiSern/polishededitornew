<script lang="ts">
	import { Button, Card, Drawer, Heading, P, Progressbar } from 'flowbite-svelte';
	import { EditSolid, HeartOutline } from 'flowbite-svelte-icons';
	import items from '$data/items.json';
	import pokemon from '$data/pokemon.json';
	import { cammyFormat, getTypeColour } from '$lib/utils';
	import type { Mon, PartyMon } from '$lib/types';
	import MonEditor from './MonEditor.svelte';

	let {
		mon = $bindable(),
		PF,
		ondelete
	}: { mon: PartyMon | Mon; PF: 'polished' | 'faithful'; ondelete: () => void } = $props();
	let open = $state(false);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
	let species = $derived(pokemon[PF].find((p) => p.name === mon.species)!);
	let form = $derived(species.forms.find((f) => f.id === mon.form)!);
	let HPPercent = $derived.by(() => {
		if ('currentHP' in mon) {
			return Math.floor((mon.currentHP * 100) / mon.stats[0]);
		}
		return null;
	});
	let src = $derived.by(() => {
		let species = mon.isEgg ? 'egg' : cammyFormat(mon.species);
		let form = mon.isEgg ? 'plain' : cammyFormat(mon.form);
		const shine = mon.shininess === 'Shiny' ? 'shiny' : 'normal';
		const formPath = form === 'plain' ? species : `${species}_${form}`;
		return `https://raw.githubusercontent.com/caomicc/polisheddex/refs/heads/main/public/sprites/pokemon/${formPath}/${shine}_front_animated.gif`;
	});
	let itemSrc = $derived.by(() => {
		const spritePath = items[PF].find((i) => i.name === mon.heldItem)!.spritePath;
		return `https://raw.githubusercontent.com/KohKaiSern/polishededitor/refs/heads/main/src/${spritePath}`;
	});
	let status = $derived.by(() => {
		if ('status' in mon) {
			return {
				Paralysis: 'PRZ',
				Burn: 'BRN',
				Freeze: 'FRZ',
				Poison: 'PSN',
				Sleep: 'SLP'
			}[mon.status.name];
		}
		return null;
	});
	let statusColor = $derived.by(() => {
		if ('status' in mon) {
			return {
				Paralysis: '#fdae10',
				Burn: '#f94e00',
				Freeze: '#62ccd4',
				Poison: '#bc52e7',
				Sleep: '#7d7d7d'
			}[mon.status.name];
		}
		return null;
	});
	function heal(): void {
		if ('currentHP' in mon) {
			mon.currentHP = mon.stats[0];
			mon.status.name = 'None';
		}
	}
</script>

<Card class="relative p-5 max-w-none flex flex-col justify-between">
	<div class="mb-3 flex">
		<div
			class="mr-5 flex size-[75px] items-center justify-center rounded-lg bg-white border border-gray-300 dark:border-none"
		>
			<img {src} alt={`GIF of the front sprite of ${mon.species}`} />
		</div>
		<div class="flex flex-col justify-between pt-1 pb-1">
			<Heading tag="h5">{mon.nickname.join('')}</Heading>
			<div class="flex gap-3">
				<div
					class="size-[30px] flex bg-white rounded-lg justify-center items-center border border-gray-300 dark:border-none"
				>
					{#if mon.heldItem != 'None'}
						<img class="rounded-sm" src={itemSrc} alt={`Sprite of ${mon.heldItem}`} />
					{/if}
				</div>
				{#each form.type as type}
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
	<div>
		{#if 'currentHP' in mon && !mon.isEgg}
			<div class="flex items-center gap-3 w-[70%]">
				<P>HP</P><Progressbar
					color={HPPercent! > 50 ? 'green' : HPPercent! > 20 ? 'yellow' : 'red'}
					progress={HPPercent!.toString()}
				/>
				{#if mon.status.name != 'None'}
					<div style:background-color={statusColor} class="rounded-md pl-2 pr-2">
						<P class="text-xs !text-gray-50">{status}</P>
					</div>
				{/if}
				{#if mon.currentHP === 0}
					<div class="bg-red-500 rounded-md pl-2 pr-2">
						<P class="text-xs !text-white">FNT</P>
					</div>
				{/if}
			</div>
		{/if}
		<P>Lv. {mon.level}</P>
		<P>Held Item: {mon.heldItem}</P>
		<P>Ability: {mon.ability}</P>
		<P>Nature: {mon.nature}</P>
	</div>
	<div class="flex absolute bottom-5 right-5 gap-3">
		{#if 'currentHP' in mon && !mon.isEgg}
			{#if mon.status.name != 'None' || mon.currentHP != mon.stats[0]}
				<Button
					class="p-2! border-green-300 hover:bg-green-300 focus:ring-green-300 focus:border-transparent"
					outline
					onclick={heal}><HeartOutline class="text-green-700" /></Button
				>
			{/if}
		{/if}
		<Button
			class="p-2! border-gray-300 hover:bg-gray-300"
			outline
			color="dark"
			onclick={() => (open = true)}><EditSolid class="text-gray-600 dark:text-gray-400" /></Button
		>
	</div>
</Card>
<Drawer
	bind:open
	placement={innerWidth > innerHeight ? 'right' : 'bottom'}
	class={innerWidth > innerHeight ? 'h-full w-[75%]' : 'h-[75%] w-full'}
>
	<MonEditor
		bind:mon
		{species}
		{form}
		{PF}
		ondelete={() => {
			open = false;
			ondelete();
		}}
	/>
</Drawer>
<svelte:window bind:innerWidth bind:innerHeight />
