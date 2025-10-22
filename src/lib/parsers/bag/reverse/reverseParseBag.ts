import addresses from '$data/addresses.json';
import items from '$data/items.json';
import keyItems from '$data/keyItems.json';
import { bin2hex } from '$lib/utils';
import type { BagSlot } from '$lib/types';

function reverseParseBag(
	fileHex: string[],
	bag: Record<string, BagSlot>,
	PF: 'polished' | 'faithful'
): string[] {
	const reverseParseCountedSlot = (address: number, slot: BagSlot): void => {
		fileHex[address] = slot.count!.toString(16).padStart(2, '0');
		for (let i = 0; i < slot.count!; i++) {
			((fileHex[address + 1 + i * 2] = items[PF].find(
				(item) => item.name === slot.contents[i].name
			)!
				.itemNo.toString(16)
				.padStart(2, '0')),
				(fileHex[address + 2 + i * 2] = slot.contents[i].qty.toString(16).padStart(2, '0')));
		}
		fileHex[address + 1 + slot.count! * 2] = 'FF';
	};

	const reverseParseFixedSlot = (address: number, slot: BagSlot, bytesPerItem = 1): void => {
		for (let i = 0; i < slot.contents.length; i++) {
			for (let j = 0; j < bytesPerItem; j++) {
				fileHex[address + i + j] = slot.contents[i].qty
					.toString(16)
					.slice((i + j) * bytesPerItem, (i + j + 1) * bytesPerItem);
			}
		}
	};

	//Items
	reverseParseCountedSlot(addresses.wNumItems, bag.items);

	//Medicine
	reverseParseCountedSlot(addresses.wNumMedicine, bag.medicine);

	//Balls
	reverseParseCountedSlot(addresses.wNumBalls, bag.balls);

	//TMs & HMs
	const flagStr = bag.TMsHMs.contents
		.map((tm) => tm.qty.toString())
		.join('')
		.padEnd(88, '0');
	for (let i = 0; i < 11; i++) {
		fileHex[addresses.wTMsHMs + i] = bin2hex(
			[...flagStr.slice(i * 8, (i + 1) * 8)].toReversed().join('')
		);
	}

	//Berries
	reverseParseCountedSlot(addresses.wNumBerries, bag.berries);

	//Key Items
	for (let i = 0; i < 39; i++) {
		if (!bag.keyItems.contents[i]) {
			fileHex = fileHex
				.slice(0, addresses.wKeyItems + i)
				.concat('00'.repeat(39 - i), fileHex.slice(addresses.wKeyItems + 39));
			break;
		}
		fileHex[addresses.wKeyItems + i] = keyItems[PF].find(
			(item) => item.name === bag.keyItems.contents[i].name
		)!
			.itemNo.toString(16)
			.padStart(2, '0');
	}

	//Coins
	fileHex[addresses.wCoins] = bag.coins.contents[0].qty.toString(16).padStart(4, '0').slice(0, 2);
	fileHex[addresses.wCoins + 1] = bag.coins.contents[0].qty.toString(16).padStart(4, '0').slice(2);

	//Apricorns
	reverseParseFixedSlot(addresses.wApricorns, bag.apricorns);

	//Wings
	reverseParseFixedSlot(addresses.wWingAmounts, bag.wings, 2);

	//Exp Candy
	reverseParseFixedSlot(addresses.wCandyAmounts, bag.candy);

	//Blue Card
	fileHex[addresses.wBlueCardBalance] = bag.coins.contents[0].qty.toString(16).padStart(2, '0');

	return fileHex;
}
export default reverseParseBag;
