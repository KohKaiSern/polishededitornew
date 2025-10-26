<script lang="ts" generics="T">
	import { ButtonGroup, RadioButton } from 'flowbite-svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		value = $bindable(),
		options,
		onchange = () => {},
		disabled = false,
		class: className
	}: {
		value: T;
		options: Array<{ text: string; id: T }>;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		disabled?: boolean;
		class?: string;
	} = $props();
</script>

<ButtonGroup class={className}>
	{#each options as { text, id }}
		<RadioButton
			{disabled}
			outline
			value={id}
			class="border-gray-300 dark:border-gray-700 hover:bg-primary-600 hover:text-white h-full"
			checkedClass="bg-primary-700 focus-within:border-transparent focus-within:ring-4 focus-within:!ring-primary-300 text-white dark:bg-primary-600 dark:text-white hover:bg-primary-700 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white"
			bind:group={value}
			{onchange}>{text}</RadioButton
		>
	{/each}
</ButtonGroup>
