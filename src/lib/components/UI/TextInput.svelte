<script lang="ts">
	import { Helper, Input } from 'flowbite-svelte';
	import charmap from '$data/charmap.json';

	let {
		value = $bindable(),
		maxLength,
		class: className = ''
	}: { value: string; maxLength: number; class?: string } = $props();
	let helperMsg = $state('');

	function enforceFormat(): void {
		if (value.length > maxLength) {
			helperMsg = `Name is too long. Max ${maxLength} characters.`;
			value = 'NAME';
			return;
		}
		for (const c of value) {
			if (!Object.entries(charmap).find(([k, v]) => v === c)) {
				helperMsg = `'${c}' is not a valid character.`;
				value = 'NAME';
				return;
			}
		}
		helperMsg = '';
	}
</script>

<Input class={className} bind:value onfocusout={enforceFormat} />
{#if helperMsg}<Helper class="mt-2">{helperMsg}</Helper>{/if}
