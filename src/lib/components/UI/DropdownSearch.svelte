<script lang="ts">
	import { Dropdown, Search } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	let { options, value = $bindable(), onchange = () => {}, class: className = '' } = $props();
	let searchTerm = $state('');
	let isOpen = $state(false);
	const filteredOptions = $derived(
		options.filter((o: string) => o.toLowerCase().includes(searchTerm.toLowerCase()))
	);
</script>

<div class="relative inline-block">
	<div>
		<button
			onclick={() => {
				isOpen = !isOpen;
			}}
			class="{className} inline-flex items-center justify-between rounded-lg bg-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white ring-0 hover:bg-purple-800 hover:text-gray-400"
			type="button"
		>
			{value}
			<ChevronDownOutline class="ms-3 h-5 w-5" />
		</button>
	</div>
	<Dropdown bind:isOpen>
		<div class="p-3">
			<Search bind:value={searchTerm} size="md" />
		</div>
		<div class="max-h-60 overflow-y-auto">
			{#each filteredOptions as option}
				<button
					type="button"
					class="block w-full px-4 py-2 text-left text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
					onclick={() => {
						value = option;
						searchTerm = '';
						isOpen = false;
						onchange?.();
					}}
				>
					{option}
				</button>
			{/each}
		</div>
	</Dropdown>
</div>
