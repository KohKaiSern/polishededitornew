<script lang="ts">
	import {
		Heading,
		DarkMode,
		Label,
		Fileupload,
		Helper,
		Button,
		P,
		List,
		Li,
		Toast
	} from 'flowbite-svelte';
	import { blur } from 'svelte/transition';
	import type { Mon, BagSlot, Player } from '$lib/types';
	import { RadioSelect } from './UI';
	import { parseSave } from '$lib/parsers';
	import { validateSave } from '$lib/utils';
	let PF = $state('polished');
	let file = $state<FileList | null>(null);
	let toastMsg = $state('');
	let mons = $state<Mon[][] | null>(null);
	let bag = $state<Record<string, BagSlot> | null>(null);
	let player = $state<Player | null>(null);
	let disabled = $state(false);

	async function handleSave(): Promise<void> {
		toastMsg = await validateSave(file![0]);
		try {
			[mons, bag, player] = parseSave(file![0]);
		} catch (Error) {
			console.log(Error);
			toastMsg =
				'Failed to parse save. Please report this possible bug to Rev3lation and provide the save file.';
			return;
		}
		disabled = true;
		setTimeout(() => (toastMsg = ''), 3000);
	}

	function downloadSave(): void {}

	$inspect(mons);
	$inspect(bag);
	$inspect(player);
</script>

{#if toastMsg}
	<div transition:blur={{ amount: 10 }} class="absolute top-5 right-5">
		<Toast>
			{toastMsg}
		</Toast>
	</div>
{/if}

<div class="m-5">
	<div class="flex flex-wrap justify-between gap-5">
		<Heading tag="h1">Polished Editor</Heading>
		<div class="flex items-center gap-3">
			<RadioSelect
				{disabled}
				bind:value={PF}
				options={[
					{ text: 'Polished', id: 'polished' },
					{ text: 'Faithful', id: 'faithful' }
				]}
			/>
			<DarkMode class="shrink-0 border border-gray-300 dark:border-gray-800" />
		</div>
	</div>
	<Label class="mt-5 mb-2">Upload Save</Label>
	<div class="mb-2 flex flex-wrap gap-3 sm:flex-nowrap">
		<Fileupload bind:files={file} onchange={handleSave} accept=".sav,.srm" />
		<Button class="text-nowrap" onclick={downloadSave}>Download Save</Button>
	</div>
	<Helper>.SAV or .SRM (Max 33kB).</Helper>

	<br />
	<P>
		Polished Editor is a save editor for Polished Crystal. It auto-updates by scraping game files. <br
		/>
		Contact Rev3lation on the Polished Crystal Discord Server to report bugs (bad eggs, corrupted saves,
		etc).
		<br />
		I am not responsible for any corrupted saves - please backup your original saves. <br /> <br />
		Instructions for use:
	</P>
	<List tag="ol" class="dark:text-white">
		<Li>Toggle between Polished/Faithful mode depending on your game.</Li>
		<Li>Upload your save file. It should be a battery save, not an emulator save state.</Li>
		<Li>Edit your save data as desired.</Li>
		<Li>
			Download the edited save and replace your original save with it. Remember to backup your
			original save.
		</Li>
		<Li>Rename your edited save to match the original one.</Li>
	</List>
	<br />
	<P>
		<em class="font-italic">Credits: Rev3lation, Sylvie (Rangi42), Cammy, Emi, FIQ, Darsh</em>
	</P>
</div>
