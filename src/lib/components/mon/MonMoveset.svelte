<script lang="ts">
	import { Heading, Label, P } from 'flowbite-svelte';
	import { NumberInput } from '../UI';
	import moves from '$data/moves.json';
	import type { Mon, PartyMon } from '$lib/types';
	import type { Form } from '../../../extractors/types';
	import MonMoveSelect from './MonMoveSelect.svelte';

	let {
		mon = $bindable(),
		form,
		PF
	}: { mon: PartyMon | Mon; form: Form; PF: 'polished' | 'faithful' } = $props();
	let moveData = $derived.by(() => {
		const res = [];
		for (let i = 0; i < 4; i++) {
			if (mon.moves[i] === 'None') {
				res.push(null);
			} else {
				res.push(moves[PF].find((m) => m.name === mon.moves[i])!);
			}
		}
		return res;
	});

	$inspect(moveData);
</script>

<div class="flex flex-col gap-5">
	{#each mon.moves as move, i}
		<Heading tag="h5">Move {i + 1}</Heading>
		<MonMoveSelect bind:move={mon.moves[i]} {form} {PF} />
		{#if !moveData[i]}
			<P italic>This moveslot is empty.</P>
		{:else}
			<div class="flex gap-3">
				{#if 'powerPoints' in mon}
					<div class="flex flex-col gap-3">
						<Label>Power Points</Label>
						<NumberInput
							bind:value={mon.powerPoints[i]}
							min={0}
							max={(moveData[i].powerPoints * (5 + mon.PPUPs[i])) / 5}
						/>
					</div>
				{/if}
				<div class="flex flex-col gap-3">
					<Label>PP Ups Used</Label>
					<NumberInput bind:value={mon.PPUPs[i]} min={0} max={3} />
				</div>
			</div>
			<P italic>{moveData[i].description}</P>
			<div class="grid grid-cols-2 md:grid-cols-5 gap-3">
				<div>
					<Label>Base Power</Label>
					<P class="text-2xl">{moveData[i].basePower}</P>
				</div>
				<div>
					<Label>Accuracy</Label>
					<P class="text-2xl">{moveData[i].accuracy}%</P>
				</div>
				<div>
					<Label>Max PP</Label>
					<P class="text-2xl">{(moveData[i].powerPoints * (5 + mon.PPUPs[i])) / 5}</P>
				</div>
				<div>
					<Label>Category</Label>
					<P class="text-2xl"
						>{moveData[i].category.at(0)! + moveData[i].category.slice(1).toLowerCase()}</P
					>
				</div>
				<div>
					<Label>Effect Chance</Label>
					<P class="text-2xl">{moveData[i].effectChance}%</P>
				</div>
			</div>
		{/if}
	{/each}
</div>
