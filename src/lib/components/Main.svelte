<script lang="ts">
	import { Heading, DarkMode } from 'flowbite-svelte';
	import { RadioSelect } from './UI';
	let PF = $state('polished');
</script>

<div class="m-5">
	<div class="flex justify-between">
		<Heading tag="h1">Polished Editor</Heading>
		<div class="flex items-center gap-3">
			<RadioSelect
				bind:value={PF}
				options={[
					{ text: 'Polished', id: 'polished' },
					{ text: 'Faithful', id: 'faithful' }
				]}
			/>
			<DarkMode class="shrink-0 border border-gray-300 dark:border-gray-800" />
		</div>
	</div>
</div>
