<script lang="ts">
	import { Heading, Img, Label, Radio } from 'flowbite-svelte';
	import { NumberInput, TextInput } from '../UI';
	import type { Player } from '$lib/types';

	let { player = $bindable(), PF }: { player: Player; PF: 'polished' | 'faithful' } = $props();
</script>

<Heading tag="h5" class="mb-5 mt-5">Player</Heading>
<div class="flex flex-wrap gap-3">
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		<TextInput bind:value={player.name} maxLength={7} />
	</div>
	<div class="flex flex-col gap-2">
		<Label>ID</Label>
		<NumberInput bind:value={player.id} min={0} max={65535} />
	</div>

	<div class="flex flex-col gap-2">
		<Label>Money</Label>
		<NumberInput bind:value={player.money} min={0} max={999999} />
	</div>
</div>
<div class="flex flex-col gap-2 mt-3">
	<Label>In-Game Model</Label>
	<div class="flex gap-5 mt-2">
		{#each ['Chris', 'Kris', 'Crys'] as model, i}
			<Radio
				custom
				bind:group={player.gender}
				value={{ Chris: 'Male', Kris: 'Female', Crys: 'Non-Binary' }[model]}
			>
				<div
					class="bg-white size-fit p-2 border-1 rounded-lg border-gray-300 dark:border-gray-600 peer-checked:border-transparent peer-checked:ring-4 peer-checked:ring-primary-300"
				>
					<Img
						src={`https://raw.githubusercontent.com/KohKaiSern/polishededitor/refs/heads/main/src/gfx/${model.toLowerCase()}.png`}
					/>
				</div>
			</Radio>
		{/each}
	</div>
</div>

<Heading tag="h5" class="mt-5 mb-5">Rival</Heading>
<div class="flex flex-wrap gap-5">
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		<TextInput bind:value={player.rivalName} maxLength={7} />
	</div>
</div>
