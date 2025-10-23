<script lang="ts">
	import { Button, Card, Drawer, Heading, P, Progressbar } from 'flowbite-svelte';
	import { EditSolid } from 'flowbite-svelte-icons';
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
</script>

<Card class="relative p-5 max-w-none">
	<div class="mb-3 flex">
		<div
			class="mr-5 flex size-[75px] items-center justify-center rounded-lg bg-white border border-gray-300 dark:border-none"
		>
			<img {src} alt={`GIF of the front sprite of ${mon.species}`} />
		</div>
		<div class="flex flex-col justify-between pt-1 pb-1">
			<Heading tag="h5">{mon.nickname}</Heading>
			<div class="flex gap-3">
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
	{#if 'currentHP' in mon}
		<div class="flex items-center gap-3 w-[50%]">
			<P>HP</P><Progressbar
				color={HPPercent! > 50 ? 'green' : HPPercent! > 20 ? 'yellow' : 'red'}
				progress={HPPercent!.toString()}
			/>
		</div>
	{/if}
	<P>Lv. {mon.level}</P>
	<P>Held Item: {mon.heldItem}</P>
	<P>Ability: {mon.ability}</P>
	<P>Nature: {mon.nature}</P>
	<Button
		class="absolute right-5 bottom-5 p-2! border-gray-300 hover:bg-gray-300"
		outline
		color="dark"
		onclick={() => (open = true)}><EditSolid class="text-gray-600 dark:text-gray-400" /></Button
	>
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
