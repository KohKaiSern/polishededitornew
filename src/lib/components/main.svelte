<script lang="ts">
	import FileHandler from '$components/file-handler.svelte';
	import RadioSelect from '$ui/radio-select.svelte';
	import ThemeToggler from '$ui/theme-toggler.svelte';
	import type { Data } from '$parsers/types';

	let data: Data | null = $state(null);
	let PF: 'polished' | 'faithful' = $state('polished');
</script>

<header class="flex gap-5 justify-between items-center flex-wrap mb-5">
	<h1><span class="text-primary">Polished</span> Editor</h1>
	<div class="flex gap-3">
		<RadioSelect
			bind:value={PF}
			options={[
				{ id: 'polished', text: 'Polished' },
				{ id: 'faithful', text: 'Faithful' }
			]}
		/>
		<ThemeToggler />
	</div>
</header>
<FileHandler bind:data {PF} />
<div class="join join-vertical bg-base-100 my-5 w-full">
	<div class="collapse collapse-arrow join-item border-base-300 border">
		<input type="checkbox" />
		<div class="collapse-title font-semibold">What is this?</div>
		<div class="collapse-content">
			Polished Editor is a Save Editor for the Polished Crystal ROM Hack. It auto-updates by
			scraping game files.<br />
			Contact Rev3lation on the Polished Crystal Discord server (in #save-editor) to report bugs (e.g.
			bad eggs, corrupted saves, etc.)
		</div>
	</div>
	<div class="collapse collapse-arrow join-item border-base-300 border">
		<input type="checkbox" />
		<div class="collapse-title font-semibold">How do I use it?</div>
		<div class="collapse-content">
			Backup your original save.<br />
			Toggle between Polished / Faithful mode depending on your game version.<br />
			Upload your save file. It should be a battery save, not an emulator save state.<br />
			Edit your save data as desired.<br />
			Download the edited save and replace your original save with it.<br />
			Rename your edited save to match the original one.<br />
			<em>Depending on emulator, you may need to disable auto-loading of save states.</em>
		</div>
	</div>
</div>
<p class="text-sm">
	<em class="font-italic">Credits: Rev3lation, Sylvie (Rangi42), Cammy, Emi, FIQ, Darsh</em><br />
	<a href="https://github.com/KohKaiSern/polishededitor" class="underline text-blue-500"
		>GitHub Repository</a
	>
</p>
