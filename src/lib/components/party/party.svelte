<script lang="ts">
	import EmptyMonCard from '$components/mon/empty-mon-card.svelte';
	import MonCard from '$components/mon/mon-card.svelte';
	import type { PartyMon, Player } from '$parsers/types';

	interface PartyProps {
		party: PartyMon[];
		player: Player;
		PF: 'polished' | 'faithful';
	}

	let { party = $bindable(), player, PF }: PartyProps = $props();

	function onadd(): void {
		party.push({
			species: 'Bulbasaur',
			form: 'Plain',
			dunsparceForm: 'Two-Segment',
			heldItem: 'None',
			moveset: ['Tackle', 'None', 'None', 'None'],
			OTID: player.id,
			exp: 0,
			evs: [0, 0, 0, 0, 0, 0],
			dvs: [0, 0, 0, 0, 0, 0],
			shininess: 'Not Shiny',
			ability: 'Overgrow',
			nature: 'Hardy',
			isEgg: false,
			gender: 'Male',
			PPUPs: [0, 0, 0, 0],
			powerPoints: [35, 0, 0, 0],
			happiness: 0,
			pokerus: {
				strain: 'None'
			},
			level: 1,
			caughtBall: 'Poké Ball',
			caughtTime: 'Day',
			caughtLevel: 1,
			caughtLocation: 'New Bark Town',
			hyperTraining: [false, false, false, false, false, false],
			nickname: ['B', 'u', 'l', 'b', 'a', 's', 'a', 'u', 'r'],
			OTNickname: player.name,
			currentHP: 12,
			stats: [12, 6, 6, 6, 6, 6],
			status: { name: 'None' }
		});
	}

	function deleteMon(index: number): void {
		party.splice(index, 1);
	}
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
	{#each Array(6) as _, i}
		{#if party[i]}
			<MonCard
				bind:mon={party[i]}
				{PF}
				ondelete={() => {
					deleteMon(i);
				}}
			/>
		{:else}
			<EmptyMonCard first={Boolean(party[i - 1]) || i === 0} {onadd} />
		{/if}
	{/each}
</div>
