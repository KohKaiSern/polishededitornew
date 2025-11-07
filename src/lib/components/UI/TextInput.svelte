<script lang="ts">
	import { Button, Drawer, Label, P } from 'flowbite-svelte';
	import keyboard from '$data/keyboard.json';

	let {
		value = $bindable(),
		maxLength,
		class: className = ''
	}: { value: string[]; maxLength: number; class?: string } = $props();
	let showKeyboard = $state(false);
	const validChars = Object.values(keyboard);
</script>

<Button class={`${className} !ring-purple-300`} color="light" onclick={() => (showKeyboard = true)}>
	{value.join('')}
</Button>

<Drawer placement="bottom" bind:open={showKeyboard} outsideclose={false} class="p-0 h-full">
	<div class="h-full flex flex-col">
		<div class="sticky top-0 bg-white dark:bg-gray-800 p-4 z-10 shadow-sm">
			<div class="max-w-2xl mx-auto">
				<P class="text-sm font-medium">
					Editing text ({value.length}/{maxLength} characters)
				</P>
				<div
					class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
				>
					<Label class="text-xs mb-1">Current text:</Label>
					<P class="font-mono text-sm">{value.join('')}<span class="animate-pulse">|</span></P>
				</div>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div class="max-w-2xl mx-auto grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
				{#each validChars as char}
					<Button
						color="light"
						size="sm"
						class="font-mono min-h-12 p-2"
						onclick={() => {
							if (value.length < maxLength) {
								value = [...value, char];
								if (value.length >= maxLength) showKeyboard = false;
							}
						}}
						title={char}
					>
						<P class="text-sm">{char}</P>
					</Button>
				{/each}
			</div>
		</div>

		<div
			class="sticky bottom-0 bg-white dark:bg-gray-800 p-4 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
		>
			<div class="max-w-2xl mx-auto flex gap-2">
				<Button
					color="red"
					class="flex-1"
					onclick={() => {
						if (value.length > 0) {
							const newValue = [...value];
							newValue.pop();
							value = newValue;
						}
					}}
				>
					← Backspace
				</Button>
				<Button
					color="green"
					class="flex-1"
					disabled={value.length === 0}
					onclick={() => (showKeyboard = false)}
				>
					Done
				</Button>
			</div>
		</div>
	</div>
</Drawer>
