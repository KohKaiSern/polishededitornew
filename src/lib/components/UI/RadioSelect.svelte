<script lang="ts">
	import { ButtonGroup, RadioButton } from 'flowbite-svelte';

	let { value = $bindable(), options, onchange = () => {}, disabled } = $props();
</script>

<ButtonGroup>
	{#each options as { text, id }}
		<RadioButton
			{disabled}
			outline
			value={id}
			class="border-gray-300 dark:border-gray-800"
			checkedClass="bg-primary-700 text-white dark:bg-primary-600 dark:text-white hover:bg-primary-700 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white"
			bind:group={value}
			onchange={onchange?.()}>{text}</RadioButton
		>
	{/each}
</ButtonGroup>
