<script lang="ts">
	import type { Data } from '$parsers/types';

	interface FileHandlerProps {
		data: Data | null;
		PF: 'polished' | 'faithful';
	}

	let { data = $bindable(), PF }: FileHandlerProps = $props();
</script>

<fieldset class="fieldset">
	<legend class="fieldset-legend">Select save file:</legend>
	<div class="flex gap-5 items-start flex-wrap">
		<div class="w-70">
			<input type="file" class="file-input mb-1" id="file-input" accept=".sav,.srm" />
			<label class="label" for="file-input">.sav / .srm (Max. 33kB)</label>
		</div>
		<button class="btn btn-primary">Download Save</button>
	</div>
</fieldset>
