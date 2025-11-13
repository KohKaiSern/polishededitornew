<script lang="ts" generics="T">
	interface RadioSelectProps {
		value: T;
		options: {
			id: T;
			text: string;
		}[];
		class?: string;
	}
	let { value = $bindable(), options, class: className }: RadioSelectProps = $props();
</script>

<div class={`${className} join`}>
	{#each options as { id, text }}
		<button
			class={value === id ? 'btn join-item bg-primary text-white' : 'btn join-item'}
			onclick={() => {
				value = id;
			}}>{text}</button
		>
	{/each}
</div>
