import addresses from '$data/addresses.json';
import apricorns from '$data/apricorns.json';
import expCandy from '$data/expCandy.json';
import items from '$data/items.json';
import keyItems from '$data/keyItems.json';
import wings from '$data/wings.json';
import { hex2bin } from '$lib/utils';
import type { BagSlot, Item } from '$lib/types';

function parseBag(fileHex: string[], PF: 'polished' | 'faithful'): Record<string, BagSlot> {
	const bag: Record<string, BagSlot> = {};

	const parseCountedSlot = (address: number): BagSlot => {
		const count = parseInt(fileHex[address], 16);
		const contents: Item[] = [];
		for (let i = 0; i < count; i++) {
			contents[i] = {
				name: items[PF].find((item) => item.itemNo === parseInt(fileHex[address + 1 + i * 2], 16))!
					.name,
				qty: parseInt(fileHex[address + 2 + i * 2], 16)
			};
		}
		return { count, contents };
	};

	const parseFixedItemSlot = (address: number, itemNames: string[], bytesPerItem = 1): BagSlot => {
		const contents: Item[] = [];
		for (let i = 0; i < itemNames.length; i++) {
			let qty = '';
			for (let j = 0; j < bytesPerItem; j++) {
				qty += fileHex[address + i * 2 + j];
			}
			contents.push({ name: itemNames[i], qty: parseInt(qty, 16) });
		}
		return { contents };
	};

	//Items
	bag['items'] = parseCountedSlot(addresses.wNumItems);

	//Medicine
	bag['medicine'] = parseCountedSlot(addresses.wNumMedicine);

	//Balls
	bag['balls'] = parseCountedSlot(addresses.wNumBalls);

	//TMs & HMs
	let flagStr = '';
	for (let i = 0; i < 11; i++) {
		flagStr += hex2bin(fileHex[addresses.wTMsHMs + i])
			.split('')
			.reverse()
			.join('');
	}
	bag['TMsHMs'] = {
		contents: Array.from({ length: 81 }, (_, i) => ({
			name: i >= 75 ? `HM0${i - 74}` : `TM${(i + 1).toString().padStart(2, '0')}`,
			qty: parseInt(flagStr[i])
		}))
	};

	//Berries
	bag['berries'] = parseCountedSlot(addresses.wNumBerries);

	//Key Items
	bag['keyItems'] = { contents: [] };
	for (let i = 0; i < 39; i++) {
		if (fileHex[addresses.wKeyItems + i] === '00') break;
		bag.keyItems.contents.push({
			name: keyItems[PF].find(
				(item) => item.itemNo === parseInt(fileHex[addresses.wKeyItems + i], 16)
			)!.name,
			qty: 1
		});
	}

	//Coins
	bag['coins'] = {
		contents: [
			{
				name: 'Coins',
				qty: parseInt(fileHex[addresses.wCoins] + fileHex[addresses.wCoins + 1], 16)
			}
		]
	};

	//Apricorns
	bag['apricorns'] = parseFixedItemSlot(
		addresses.wApricorns,
		apricorns[PF].map((a) => a.name)
	);

	//Wings
	bag['wings'] = parseFixedItemSlot(addresses.wWingAmounts, wings[PF], 2);

	//XP Candy
	bag['candy'] = parseFixedItemSlot(addresses.wCandyAmounts, expCandy[PF]);

	//Blue Card
	bag['blueCard'] = {
		contents: [
			{
				name: 'Blue Card Points',
				qty: parseInt(fileHex[addresses.wBlueCardBalance])
			}
		]
	};

	return bag;
}

export default parseBag;
