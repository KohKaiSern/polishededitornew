<script lang="ts" generics="T extends Record<string, string[]>">
	import { Button, ButtonGroup, Dropdown, DropdownItem, Search } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	let {
		options,
		value = $bindable(''),
		onchange
	}: { options: T; value: string; onchange?: () => void } = $props();

	// State for dropdowns
	let groupDropdownOpen = $state(false);
	let itemDropdownOpen = $state(false);
	let searchTerm = $state('');

	// Derive groups from options keys
	const groups = $derived(Object.keys(options) as (keyof T & string)[]);
	let selectedGroup = $state(Object.keys(options)[0]);
	const currentGroupItems = $derived(options[selectedGroup] || []);

	// Filtered items based on search
	const filteredItems = $derived(
		currentGroupItems.filter((item: string) =>
			item.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	function selectGroup(groupName: keyof T & string): void {
		selectedGroup = groupName;
		groupDropdownOpen = false;
	}

	function selectItem(item: string): void {
		value = item;
		searchTerm = '';
		itemDropdownOpen = false;
		onchange?.();
	}
</script>

<ButtonGroup class="w-full">
	<!-- Group Selector Button -->
	<Button
		onclick={() => (groupDropdownOpen = !groupDropdownOpen)}
		class="bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-500 focus:ring-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
	>
		{selectedGroup}
		<ChevronDownOutline class="ms-2 h-6 w-6" />
	</Button>

	<!-- Group Dropdown (no search) -->
	<Dropdown>
		{#each groups as group}
			<DropdownItem onclick={() => selectGroup(group)}>
				{group}
			</DropdownItem>
		{/each}
	</Dropdown>

	<!-- Item Searchable Dropdown Button -->
	<button
		onclick={() => (itemDropdownOpen = !itemDropdownOpen)}
		class="inline-flex flex-1 items-center justify-between rounded-e-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
		type="button"
	>
		{value}
		<ChevronDownOutline class="ms-3 h-5 w-5" />
	</button>

	<!-- Item Searchable Dropdown -->
	<Dropdown>
		{#if itemDropdownOpen}
			<div class="p-3">
				<Search bind:value={searchTerm} size="md" placeholder="Search..." />
			</div>
			<div class="max-h-60 overflow-y-auto">
				{#each filteredItems as item}
					<button
						type="button"
						class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
						onclick={() => selectItem(item)}
					>
						{item}
					</button>
				{/each}
				{#if filteredItems.length === 0}
					<div class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No items found</div>
				{/if}
			</div>
		{/if}
	</Dropdown>
</ButtonGroup>
