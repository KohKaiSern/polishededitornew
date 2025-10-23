<script lang="ts" generics="T extends string">
	import { ButtonGroup, RadioButton } from 'flowbite-svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		value = $bindable(),
		options,
		onchange = () => {},
		disabled = false
	}: {
		value: T;
		options: Array<{ text: string; id: T }>;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		disabled?: boolean;
	} = $props();
</script>

<ButtonGroup>
	{#each options as { text, id }}
		<RadioButton
			{disabled}
			outline
			value={id}
			class="border-gray-300 dark:border-gray-700 h-[42px]"
			checkedClass="bg-primary-700 text-white dark:bg-primary-600 dark:text-white hover:bg-primary-700 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white"
			bind:group={value}
			{onchange}>{text}</RadioButton
		>
	{/each}
</ButtonGroup>
