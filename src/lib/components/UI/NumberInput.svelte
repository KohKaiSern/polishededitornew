<script>
	import { Button, ButtonGroup, Input } from 'flowbite-svelte';
	import { MinusOutline, PlusOutline } from 'flowbite-svelte-icons';

	let { value = $bindable(), min, max, onchange = () => {}, class: className = '' } = $props();

	const increment = () => (value === max ? min : value + 1);
	const decrement = () => (value === min ? max : value - 1);
	const enforce = () => {
		if (typeof value != 'number') return max;
		if (!Number.isInteger(value)) return max;
		if (value < min || value > max) return max;
		return value;
	};
</script>

<ButtonGroup class={`w-full ${className}`}>
	<Button
		type="button"
		onclick={() => {
			value = decrement();
			onchange?.();
		}}
		class="p-2!"
	>
		<MinusOutline class="size-6" />
	</Button>
	<Input
		bind:value
		type="number"
		onfocusout={() => {
			value = enforce();
			onchange?.();
		}}
		class="w-15 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
	/>
	<Button
		type="button"
		onclick={() => {
			value = increment();
			onchange?.();
		}}
		class="p-2!"
	>
		<PlusOutline class="size-6" />
	</Button>
</ButtonGroup>
