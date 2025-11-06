<script lang="ts">
	import { Button, Listgroup, ListgroupItem, P } from 'flowbite-svelte';
	import { PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { DropdownSearch, NumberInput } from '../UI';
	import items from '$data/items.json';
	import type { BagSlot } from '$lib/types';
	import type { Item } from '../../../extractors/types';

	let {
		slot = $bindable(),
		capacity,
		itemList,
		PF
	}: { slot: BagSlot; capacity: number; itemList: Item[]; PF: 'polished' | 'faithful' } = $props();

	const addItem = (): void => {
		slot.contents.push({
			name: itemList[0].name,
			qty: 1
		});
		slot.count! += 1;
	};

	const deleteItem = (i: number): void => {
		slot.contents.splice(i, 1);
		slot.count! -= 1;
	};

	const src = (item: string): string => {
		const spritePath = items[PF].find((i) => i.name === item)!.spritePath;
		return `https://raw.githubusercontent.com/KohKaiSern/polishededitor/refs/heads/main/src/${spritePath}`;
	};
</script>

<Listgroup class="mt-8">
	{#each Array(capacity) as _, i}
		<ListgroupItem class="flex w-full flex-wrap py-3 sm:justify-between sm:flex-nowrap">
			{#if slot.contents[i]}
				<div class="mt-2 mb-2 flex flex-col gap-4">
					<DropdownSearch
						options={itemList.map((item) => item.name)}
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
						<P italic>{itemList.find((item) => item.name === slot.contents[i].name)!.description}</P
						>
					</div>
				</div>
				<div
					class="flex gap-3 mb-1 items-center justify-start sm:justify-end w-full sm:w-auto sm:ml-4"
				>
					<Button class="p-2!" color="red" outline onclick={() => deleteItem(i)}>
						<TrashBinSolid class="h-6 w-6" />
					</Button>
					<NumberInput
						class="flex-1 sm:flex-initial sm:w-32 flex-shrink-0"
						bind:value={slot.contents[i].qty}
						min={1}
						max={99}
					/>
				</div>
			{:else}
				<P class="my-2 mx-1 p-1">Empty</P>
				{#if i === slot.count}
					<Button class="p-2! mr-1" onclick={() => addItem()} color="purple">
						<PlusOutline class="h-5 w-5" />
					</Button>
				{/if}
			{/if}
		</ListgroupItem>
	{/each}
</Listgroup>
