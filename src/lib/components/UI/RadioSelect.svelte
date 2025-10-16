<script lang="ts">
	import { ButtonGroup, RadioButton } from 'flowbite-svelte';
	let { value = $bindable(), options, onchange = () => {} } = $props();
</script>

<ButtonGroup>
	{#each options as { text, id }}
		<RadioButton
			outline
			value={id}
			class="border-gray-300"
			checkedClass="bg-purple-600 text-white dark:bg-purple-600 dark:text-white hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white"
			bind:group={value}
			onchange={onchange?.()}>{text}</RadioButton
		>
	{/each}
</ButtonGroup>
