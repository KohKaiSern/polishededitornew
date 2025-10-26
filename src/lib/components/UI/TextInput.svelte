<script lang="ts">
	import { Helper, Input } from 'flowbite-svelte';
	import charmap from '$data/charmap.json';

	let {
		value = $bindable(),
		maxLength,
		class: className = ''
	}: { value: string; maxLength: number; class?: string } = $props();
	let text = $state(value);
	let helperMsg = $state('');

	function enforceFormat(): void {
		if (text.length > maxLength) {
			helperMsg = `Name is too long. Max ${maxLength} characters.`;
			text = value;
			return;
		}
		for (const c of text) {
			if (!Object.entries(charmap).find(([_, v]) => v === c)) {
				helperMsg = `'${c}' is not a valid character.`;
				text = value;
				return;
			}
		}
		helperMsg = '';
		value = text;
	}
</script>

<Input
	class={className}
	bind:value={text}
	onfocusout={enforceFormat}
	onkeydown={(e) => {
		if (e.key === 'Enter') enforceFormat();
	}}
/>
{#if helperMsg}<Helper class="mt-2">{helperMsg}</Helper>{/if}
