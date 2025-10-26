<script lang="ts">
	import { Heading, Label } from 'flowbite-svelte';
	import { NumberInput, RadioSelect, TextInput } from '../UI';
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
		<Label>In-Game Model</Label>
		<RadioSelect
			bind:value={player.gender}
			options={[
				{ text: 'Chris', id: 'Male' },
				{ text: 'Kris', id: 'Female' },
				{ text: 'Crys', id: 'Non-Binary' }
			]}
		/>
	</div>
	<div class="flex flex-col gap-2">
		<Label>Money</Label>
		<NumberInput bind:value={player.money} min={0} max={999999} />
	</div>
</div>

<Heading tag="h5" class="mt-5 mb-5">Rival</Heading>
<div class="flex flex-wrap gap-5">
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		<TextInput bind:value={player.rivalName} maxLength={7} />
	</div>
</div>
