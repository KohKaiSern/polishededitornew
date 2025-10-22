<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import type { Mon, PartyMon } from '$lib/types';
	import TextInput from '../UI/TextInput.svelte';

	let { mon = $bindable(), PF }: { mon: Mon | PartyMon; PF: 'polished' | 'faithful' } = $props();
</script>

<Heading tag="h6" class="mb-5">Nickname</Heading>
<TextInput bind:value={mon.nickname} maxLength={10} />
<Heading tag="h6">Species & Form</Heading>
<Heading tag="h6">Held Item</Heading>
<Heading tag="h6">Ability</Heading>
<Heading tag="h6">Level</Heading>
<Heading tag="h6">Status</Heading>
<Heading tag="h6">Current HP</Heading>
