import type { Mon } from '$lib/types';
import type { Form } from '../../../../extractors/types';
import { hex2bin, getNatureNo, readString, bin2hex } from '$lib/utils';
import pokemon from '../../../data/pokemon.json';
import items from '../../../data/items.json';
import moves from '../../../data/moves.json';
import abilities from '../../../data/abilities.json';
import locations from '../../../data/locations.json';

function reverseParseMon(
	fileHex: string[],
	address: number,
	mon: Mon | null,
	PF: 'polished' | 'faithful'
): string[] {
	//Empty Slot
	if (!mon) {
		return fileHex.slice(0, address).concat(Array(49).fill('FF'), fileHex.slice(address + 49));
	}

	//Byte #1, Byte #22: Species, Form
	const dexNo = pokemon[PF].find((species) => species.name === mon.species)!
		.dexNo.toString(2)
		.padStart(9, '0');
	let byte22 = hex2bin(fileHex[address + 21]);
	byte22 = byte22.slice(0, 2) + dexNo.at(0)! + byte22.slice(3);
	fileHex[address] = bin2hex(dexNo.slice(1));

	//Byte #2: Held Item
	fileHex[address + 1] =
		mon.heldItem === 'None'
			? '00'
			: items[PF].find((item) => item.name === mon.heldItem)!
					.itemNo.toString(16)
					.padStart(2, '0');

	//Bytes #3-#6: Moveset
	for (let i = 2; i < 6; i++) {
		fileHex[address + i] =
			mon.moves[i - 2] === 'None'
				? '00'
				: moves[PF].find((move) => move.name === mon.moves[i - 2])!
						.moveNo.toString(16)
						.padStart(2, '0');
	}

	//Bytes #7-#8: Original Trainer ID
	const OTID = mon.OTID.toString(16).padStart(4, '0');
	fileHex[address + 6] = OTID.slice(0, 2);
	fileHex[address + 7] = OTID.slice(2);

	//Bytes #9-#11: Experience
	const exp = mon.exp.toString(16).padStart(6, '0');
	for (let i = 0; i < 3; i++) {
		fileHex[address + 8 + i] = exp.slice(i * 2, (i + 1) * 2);
	}

	//Bytes #12-#17: Effort Values
	for (let i = 11; i < 17; i++) {
		fileHex[address + i] = mon.evs[i - 11].toString(16).padStart(2, '0');
	}

	//Bytes #18-#20: Determinant Values
	for (let i = 0; i < 3; i++) {
		fileHex[address + 17 + i] = mon.dvs[i * 2].toString(16) + mon.dvs[i * 2 + 1].toString(16);
	}

	//Bytes #21: Shininess, Ability, Nature
	let byte21 = hex2bin(fileHex[address + 20]);
	byte21 = (mon.shininess === 'Shiny' ? '1' : '0') + byte21.slice(1);
	const abilityNo =
		(pokemon[PF].find((pokemon) => pokemon.name === mon.species)!.forms as Form[])
			.find((form) => form.id === mon.form)!
			.abilities.findIndex((ability) => ability === mon.ability)! + 1;
	byte21 = byte21.at(0)! + abilityNo.toString(2).padStart(2, '0') + byte21.slice(3);
	byte21 = byte21.slice(0, 3) + getNatureNo(mon.nature).toString(2).padStart(5, '0');
	fileHex[address + 20] = byte21;

	//Byte #22: Gender, isEgg
	byte22 = (mon.gender === 'Genderless' || mon.gender === 'Male' ? '0' : '1') + byte22.slice(1);
	byte22 = byte22.at(0)! + (mon.isEgg === true ? '1' : '0') + byte22.slice(2);
	fileHex[address + 21] = bin2hex(byte22);

	//Byte #23: PP UPs
	let byte23 = '';
	for (let i = 3; i > -1; i--) {
		byte23 += mon.PPUPs[i].toString(2).padStart(2, '0');
	}
	fileHex[address + 22] = bin2hex(byte23);

	//Byte #24: Happiness / Hatch Cycles
	fileHex[address + 23] = mon.happiness.toString(16).padStart(2, '0');

	////Byte #25: Pokerus
	if (mon.pokerus.daysRemaining === 'None') {
		fileHex[address + 24] = '00';
	} else if (mon.pokerus.daysRemaining === 'Cured') {
		fileHex[address + 24] = bin2hex('00001101');
	} else {
		const ones = '1'.repeat(mon.pokerus.strain as number);
		const zeroes = '0'.repeat((mon.pokerus.strain as number) - mon.pokerus.daysRemaining);
		fileHex[address + 24] = bin2hex('0000' + (zeroes + ones).padStart(4, '0'));
	}

	//Byte #26: Caught Ball, Caught Time
	fileHex[address + 25] = bin2hex(
		'0' +
			['Evening', 'Morning', 'Day', 'Night']
				.findIndex((time) => time === mon.caughtTime)
				.toString(2)
				.padStart(2, '0') +
			items[PF].find((item) => item.name === mon.caughtBall)!
				.itemNo.toString(2)
				.padStart(5, '0')
	);

	//Byte #27: Caught Level
	fileHex[address + 26] = mon.caughtLevel.toString(16).padStart(2, '0');

	//Byte #28: Caught Location
	fileHex[address + 27] = locations[PF].find((location) => location.name === mon.caughtLocation)!
		.locationNo.toString(16)
		.padStart(2, '0');

	////Byte #29: Level
	fileHex[address + 28] = mon.level.toString(16).padStart(2, '0');

	////Byte #30: Hyper Training
	fileHex[address + 29] = bin2hex(
		mon.hyperTraining.map((stat) => (stat ? '1' : '0')).join('') + '00'
	);

	////Bytes #31-#32: Unused
	fileHex[address + 30] = '00';
	fileHex[address + 31] = '00';
	//
	////Bytes #33-#42: Nickname
	//const nickname = readString(fileHex, address + 32, 10, true);
	//
	////Bytes #43-#49: Original Trainer Nickname
	//const OTNickname = readString(fileHex, address + 42, 7, true);

	return fileHex;
}

export default reverseParseMon;
