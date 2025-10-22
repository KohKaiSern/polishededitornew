<script lang="ts">
	import { Helper, Input } from 'flowbite-svelte';
	import charmap from '$data/charmap.json';

	let { value = $bindable(), maxLength }: { value: string; maxLength: number } = $props();
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

<Input bind:value onfocusout={enforceFormat} />
<Helper class="mt-2">{helperMsg}</Helper>
