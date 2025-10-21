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

	//Items
	let address = addresses.wNumItems - addresses.wGameData + addresses.sBackupGameData;
	bag['items'] = { count: parseInt(fileHex[address], 16), contents: Array(75).fill(null) };
	for (let i = 0; i < bag.items.count!; i++) {
		bag.items.contents[i] = {
			name: items[PF].find((item) => item.itemNo === parseInt(fileHex[address + 1 + i * 2], 16))!
				.name,
			qty: parseInt(fileHex[address + 2 + i * 2], 16)
		};
	}

	//Medicine
	address = addresses.wNumMedicine - addresses.wGameData + addresses.sBackupGameData;
	bag['medicine'] = { count: parseInt(fileHex[address], 16), contents: Array(37).fill(null) };
	for (let i = 0; i < bag.medicine.count!; i++) {
		bag.medicine.contents[i] = {
			name: items[PF].find((item) => item.itemNo === parseInt(fileHex[address + 1 + i * 2], 16))!
				.name,
			qty: parseInt(fileHex[address + 2 + i * 2], 16)
		};
	}

	//Balls
	address = addresses.wNumBalls - addresses.wGameData + addresses.sBackupGameData;
	bag['balls'] = { count: parseInt(fileHex[address], 16), contents: Array(25).fill(null) };
	for (let i = 0; i < bag.balls.count!; i++) {
		bag.balls.contents[i] = {
			name: items[PF].find((item) => item.itemNo === parseInt(fileHex[address + 1 + i * 2], 16))!
				.name,
			qty: parseInt(fileHex[address + 2 + i * 2], 16)
		};
	}

	//TMs & HMs
	address = addresses.wTMsHMs - addresses.wGameData + addresses.sBackupGameData;
	bag['TMsHMs'] = { contents: Array(81).fill(null) };
	let flagStr = '';
	for (let i = 0; i < 11; i++) {
		flagStr += hex2bin(fileHex[address + i])
			.split('')
			.reverse()
			.join('');
	}
	for (let i = 1; i < 82; i++) {
		bag['TMsHMs'].contents[i - 1] = {
			name: i > 75 ? `HM0${i - 75}` : `TM${i.toString().padStart(2, '0')}`,
			qty: parseInt(flagStr[i - 1])
		};
	}

	//Berries
	address = addresses.wNumBerries - addresses.wGameData + addresses.sBackupGameData;
	bag['berries'] = { count: parseInt(fileHex[address], 16), contents: Array(31).fill(null) };
	for (let i = 0; i < bag.berries.count!; i++) {
		bag.berries.contents[i] = {
			name: items[PF].find((item) => item.itemNo === parseInt(fileHex[address + 1 + i * 2], 16))!
				.name,
			qty: parseInt(fileHex[address + 2 + i * 2], 16)
		};
	}

	//Key Items
	address = addresses.wKeyItems - addresses.wGameData + addresses.sBackupGameData;
	bag['keyItems'] = { contents: Array(39).fill(null) };
	for (let i = 0; i < 39; i++) {
		if (fileHex[address + i] === '00') continue;
		bag.keyItems.contents[i] = {
			name: keyItems[PF].find((item) => item.itemNo === parseInt(fileHex[address + i], 16))!.name,
			qty: 1
		};
	}

	//Coins
	address = addresses.wCoins - addresses.wGameData + addresses.sBackupGameData;
	bag['coins'] = {
		contents: [
			{
				name: 'Coins',
				qty: parseInt(fileHex[address] + fileHex[address + 1], 16)
			}
		]
	};

	//Apricorns
	address = addresses.wApricorns - addresses.wGameData + addresses.sBackupGameData;
	bag['apricorns'] = { contents: Array(7).fill(null) };
	for (let i = 0; i < 7; i++) {
		bag.apricorns.contents[i] = {
			name: apricorns[PF][i].name,
			qty: parseInt(fileHex[address + i], 16)
		};
	}

	//Wings
	address = addresses.wWingAmounts - addresses.wGameData + addresses.sBackupGameData;
	bag['wings'] = { contents: Array(6).fill(null) };
	for (let i = 0; i < 6; i++) {
		bag.wings.contents[i] = {
			name: wings[PF][i],
			qty: parseInt(fileHex[address + i * 2] + fileHex[address + 1 + i * 2], 16)
		};
	}

	//XP Candy
	address = addresses.wCandyAmounts - addresses.wGameData + addresses.sBackupGameData;
	bag['candy'] = { contents: Array(4).fill(null) };
	for (let i = 0; i < 4; i++) {
		bag.candy.contents[i] = {
			name: expCandy[PF][i],
			qty: parseInt(fileHex[address + i], 16)
		};
	}

	//Blue Card
	address = addresses.wBlueCardBalance - addresses.wGameData + addresses.sBackupGameData;
	bag['blueCard'] = {
		contents: [
			{
				name: 'Blue Card Points',
				qty: parseInt(fileHex[address])
			}
		]
	};

	return bag;
}
export default parseBag;
