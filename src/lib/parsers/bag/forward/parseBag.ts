import addresses from '$data/addresses.json';
import apricorns from '$data/apricorns.json';
import expCandy from '$data/expCandy.json';
import items from '$data/items.json';
import keyItems from '$data/keyItems.json';
import wings from '$data/wings.json';
import { hex2bin } from '$lib/utils';
import type { BagSlot } from '$lib/types';

function parseBag(fileHex: string[], PF: 'polished' | 'faithful'): Record<string, BagSlot> {
	const bag: Record<string, BagSlot> = {};
	const baseAddress = addresses.sBackupGameData - addresses.wGameData;

	const parseCountedSlot = (address: number, capacity: number): BagSlot => {
		const addr = address + baseAddress;
		const count = parseInt(fileHex[addr], 16);
		const contents = Array(capacity).fill(null);

		for (let i = 0; i < count; i++) {
			contents[i] = {
				name: items[PF].find((item) => item.itemNo === parseInt(fileHex[addr + 1 + i * 2], 16))!
					.name,
				qty: parseInt(fileHex[addr + 2 + i * 2], 16)
			};
		}
		return { count, contents };
	};

	const parseIdOnlySlot = (address: number, capacity: number): BagSlot => {
		const addr = address + baseAddress;
		const contents = Array(capacity).fill(null);

		for (let i = 0; i < capacity; i++) {
			if (fileHex[addr + i] === '00') continue;
			contents[i] = {
				name: keyItems[PF].find((item) => item.itemNo === parseInt(fileHex[addr + i], 16))!.name,
				qty: 1
			};
		}
		return { contents };
	};

	const parseFixedItemSlot = (
		address: number,
		itemNames: string[],
		bytesPerItem: number = 1
	): BagSlot => {
		const addr = address + baseAddress;
		const contents = itemNames.map((name, i) => ({
			name,
			qty: parseInt(
				bytesPerItem === 2 ? fileHex[addr + i * 2] + fileHex[addr + 1 + i * 2] : fileHex[addr + i],
				16
			)
		}));
		return { contents };
	};

	// Items
	bag['items'] = parseCountedSlot(addresses.wNumItems, 75);

	// Medicine
	bag['medicine'] = parseCountedSlot(addresses.wNumMedicine, 37);

	// Balls
	bag['balls'] = parseCountedSlot(addresses.wNumBalls, 25);

	// TMs & HMs
	const TMHMAddress = addresses.wTMsHMs + baseAddress;
	let flagStr = '';
	for (let i = 0; i < 11; i++) {
		flagStr += hex2bin(fileHex[TMHMAddress + i])
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

	// Berries
	bag['berries'] = parseCountedSlot(addresses.wNumBerries, 31);

	// Key Items
	bag['keyItems'] = parseIdOnlySlot(addresses.wKeyItems, 39);

	// Coins
	const coinsAddress = addresses.wCoins + baseAddress;
	bag['coins'] = {
		contents: [
			{
				name: 'Coins',
				qty: parseInt(fileHex[coinsAddress] + fileHex[coinsAddress + 1], 16)
			}
		]
	};

	// Apricorns
	bag['apricorns'] = parseFixedItemSlot(
		addresses.wApricorns,
		apricorns[PF].map((a) => a.name)
	);

	// Wings
	bag['wings'] = parseFixedItemSlot(addresses.wWingAmounts, wings[PF], 2);

	// XP Candy
	bag['candy'] = parseFixedItemSlot(addresses.wCandyAmounts, expCandy[PF]);

	// Blue Card
	const blueCardAddress = addresses.wBlueCardBalance + baseAddress;
	bag['blueCard'] = {
		contents: [
			{
				name: 'Blue Card Points',
				qty: parseInt(fileHex[blueCardAddress])
			}
		]
	};

	return bag;
}

export default parseBag;
