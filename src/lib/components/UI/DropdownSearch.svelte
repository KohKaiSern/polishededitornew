<script lang="ts">
	import { Button, Dropdown, Search } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	let {
		options,
		value = $bindable(),
		onchange = () => {},
		class: className = ''
	}: { options: string[]; value: string; onchange?: () => void; class?: string } = $props();
	let searchTerm = $state('');
	let isOpen = $state(false);
	const filteredOptions = $derived(
		options.filter((o: string) => o.toLowerCase().includes(searchTerm.toLowerCase()))
	);
</script>

<div class={`${className} flex align-middle`}>
	<div>
		<Button
			onclick={() => {
				isOpen = !isOpen;
			}}
			type="button"
			class="h-full"
		>
			{value}
			<ChevronDownOutline class="ms-3 h-5 w-5" />
		</Button>
	</div>
	<Dropdown bind:isOpen class="w-65">
		<div class="p-3">
			<Search bind:value={searchTerm} size="md" />
		</div>
		<div class="max-h-60 overflow-y-auto">
			{#each filteredOptions as option}
				<Button
					type="button"
					outline
					class="border-0 w-full rounded-none justify-start px-4 py-3 text-black dark:text-white"
					onclick={() => {
						value = option;
						searchTerm = '';
						isOpen = false;
						onchange?.();
					}}
				>
					{option}
				</Button>
			{/each}
		</div>
	</Dropdown>
</div>
