<script lang="ts">
	import { Button, Listgroup, ListgroupItem, P } from 'flowbite-svelte';
	import { PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { DropdownSearch } from '../UI';
	import keyItems from '$data/keyItems.json';
	import type { BagSlot } from '$lib/types';

	let { slot = $bindable(), PF }: { slot: BagSlot; PF: 'polished' | 'faithful' } = $props();

	const addItem = (): void => {
		slot.contents.push({
			name: keyItems[PF][0].name,
			qty: 1
		});
	};

	const deleteItem = (i: number): void => {
		slot.contents.splice(i, 1);
	};

	const src = (item: string): string => {
		const spritePath = keyItems[PF].find((i) => i.name === item)!.spritePath;
		return `https://raw.githubusercontent.com/KohKaiSern/polishededitor/refs/heads/main/src/${spritePath}`;
	};
</script>

<Listgroup class="mt-8">
	{#each Array(39) as _, i}
		<ListgroupItem class="flex w-full flex-wrap py-3 sm:justify-between sm:flex-nowrap">
			{#if slot.contents[i]}
				<div class="mt-2 mb-2 flex flex-col gap-4 w-full sm:w-auto">
					<DropdownSearch
						options={keyItems[PF].map((item) => item.name)}
						bind:value={slot.contents[i].name}
					/>
					<div class="flex items-center gap-3">
						<div
							class="size-[35px] flex bg-white rounded-lg justify-center items-center border
							border-gray-300 dark:border-none"
						>
							<img
								class="rounded-sm"
								src={src(slot.contents[i].name)}
								alt={`Sprite of ${slot.contents[i]}`}
							/>
						</div>
						<P italic
							>{keyItems[PF].find((item) => item.name === slot.contents[i].name)!.description}</P
						>
					</div>
				</div>
				<Button class="p-2! mt-2 sm:mt-0" color="red" outline onclick={() => deleteItem(i)}>
					<TrashBinSolid class="h-6 w-6" />
				</Button>
			{:else}
				<P class="my-2 mx-1 p-1">Empty</P>
				{#if i === slot.contents.length}
					<Button class="p-2! mr-1" onclick={() => addItem()} color="purple">
						<PlusOutline class="h-5 w-5" />
					</Button>
				{/if}
			{/if}
		</ListgroupItem>
	{/each}
</Listgroup>
