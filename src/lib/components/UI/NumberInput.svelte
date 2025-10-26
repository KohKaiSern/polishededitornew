<script lang="ts">
	import { Button, ButtonGroup, Input } from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		AngleRightOutline,
		MinusOutline,
		PlusOutline
	} from 'flowbite-svelte-icons';

	let {
		value = $bindable(),
		min,
		max,
		onchange = () => {},
		class: className = '',
		carousel = false
	}: {
		value: number;
		min: number;
		max: number;
		onchange?: () => void;
		class?: string;
		carousel?: boolean;
	} = $props();

	const increment = () => (value === max ? (value = min) : value++);
	const decrement = () => (value === min ? (value = max) : value--);
	const enforce = () => {
		if (typeof value != 'number') value = max;
		if (!Number.isInteger(value)) value = max;
		if (value < min || value > max) value = max;
	};
</script>

<ButtonGroup class={className}>
	{#if carousel}
		<Button
			type="button"
			color="primary"
			onclick={() => {
				decrement();
				onchange?.();
			}}
			class="p-2! focus:border-transparent focus:ring-4 focus:ring-primary-300"
		>
			<AngleLeftOutline class="size-6" />
		</Button>
	{:else}
		<Button
			type="button"
			onclick={() => {
				decrement();
				onchange?.();
			}}
			class="p-2! focus:border-transparent focus:ring-4 focus:ring-primary-300"
		>
			<MinusOutline class="size-6" />
		</Button>
	{/if}
	<Input
		bind:value
		type="number"
		onfocusout={() => {
			enforce();
			onchange?.();
		}}
		class="focus:border-transparent focus:ring-4 focus:ring-primary-300 flex-1 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
	/>
	{#if carousel}
		<Button
			type="button"
			color="primary"
			onclick={() => {
				increment();
				onchange?.();
			}}
			class="p-2! focus:border-transparent focus:ring-4 focus:ring-primary-300"
		>
			<AngleRightOutline class="size-6" />
		</Button>
	{:else}
		<Button
			type="button"
			onclick={() => {
				increment();
				onchange?.();
			}}
			class="p-2! focus:border-transparent focus:ring-4 focus:ring-primary-300"
		>
			<PlusOutline class="size-6" />
		</Button>
	{/if}
</ButtonGroup>
