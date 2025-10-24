import abilities from '$data/abilities.json';
import items from '$data/items.json';
import locations from '$data/locations.json';
import moves from '$data/moves.json';
import pokemon from '$data/pokemon.json';
import { getNature, hex2bin } from '$lib/utils';
import type { PartyMon } from '$lib/types';

function parsePartyMon(
	fileHex: string[],
	address: number,
	PF: 'polished' | 'faithful'
): Omit<PartyMon, 'hyperTraining' | 'nickname' | 'OTNickname'> {
	//Byte #1, Byte #22: Species, Form
	const byte22 = hex2bin(fileHex[address + 21]);
	const dexNo = parseInt(byte22.at(2)! + hex2bin(fileHex[address]), 2);
	let formNo = parseInt(byte22.slice(3), 2);
	//Form Number Zero TODO
	if (formNo === 0) formNo = 1;
	const species = pokemon[PF][dexNo];
	const form = pokemon[PF][dexNo].forms.find((f) => f.formNo === formNo)!;

	//Byte #2: Held Item
	let heldItem = 'None';
	if (!(fileHex[address + 1] === '00')) {
		heldItem = items[PF][parseInt(fileHex[address + 1], 16) - 1].name;
	}

	//Bytes #3-#6: Moveset
	const moveset: string[] = [];
	for (let i = 2; i < 6; i++) {
		if (fileHex[address + i] === '00') {
			moveset.push('None');
		} else {
			moveset.push(moves[PF][parseInt(fileHex[address + i], 16) - 1].name);
		}
	}

	//Bytes #7-#8: Original Trainer ID
	const OTID = parseInt(fileHex[address + 6] + fileHex[address + 7], 16);

	//Bytes #9-#11: Experience
	const exp = parseInt(fileHex[address + 8] + fileHex[address + 9] + fileHex[address + 10], 16);

	//Bytes #12-#17: Effort Values
	const evs = [];
	for (let i = 11; i < 17; i++) {
		evs.push(parseInt(fileHex[address + i], 16));
	}

	//Bytes #18-#20: Determinant Values
	const dvs = [];
	for (let i = 0; i < 6; i++) {
		dvs.push(parseInt(fileHex[address + 17 + Math.floor(i / 2)].at(i % 2)!, 16));
	}

	//Bytes #21: Shininess, Ability, Nature
	const byte21 = hex2bin(fileHex[address + 20]);
	const shininess = byte21.at(0)! === '0' ? 'Not Shiny' : 'Shiny';
	const ability = abilities[PF].find(
		(ability) => form.abilities.at(parseInt(byte21.slice(1, 3), 2) - 1)! === ability.name
	)!.name;
	const nature = getNature(parseInt(byte21.slice(3), 2));

	//Byte #22: Gender, isEgg
	const gender = form.hasGender ? (byte22.at(0)! === '0' ? 'Male' : 'Female') : 'Genderless';
	const isEgg = byte22.at(1)! === '0' ? false : true;

	//Byte #23-#26: PP Ups, Power Points
	const PPUPs = [];
	const powerPoints = [];
	for (let i = 22; i < 26; i++) {
		PPUPs.push(parseInt(hex2bin(fileHex[address + i]).slice(0, 2), 2));
		powerPoints.push(parseInt(hex2bin(fileHex[address + i]).slice(0, 6), 2));
	}
	//Byte #27: Happiness / Hatch Cycles
	const happiness = parseInt(fileHex[address + 26], 16);

	//Byte #28: Pokerus
	const pokerus: { strain: number | 'None' | 'Cured'; daysRemaining: number } = {
		strain: 'None',
		daysRemaining: 0
	};
	const pokerusStr = hex2bin(fileHex[address + 27]).slice(4);
	if (pokerusStr === '1101') {
		pokerus.strain = 'Cured';
	} else if (pokerusStr != '0000') {
		pokerus.strain = pokerusStr.split('1').length - 1;
		pokerus.daysRemaining = pokerus.strain - (4 - pokerusStr.replace(/^0+/, '').length);
	}

	//Byte #29: Caught Time, Caught Ball
	const byte26 = hex2bin(fileHex[address + 28]);
	const caughtTime = ['Evening', 'Morning', 'Day', 'Night'][parseInt(byte26.slice(1, 3), 2)];
	let caughtBall = 'Park Ball';
	if (byte26.slice(3) != '00000') {
		caughtBall = items[PF][parseInt(byte26.slice(3), 2) - 1].name;
	}

	//Byte #30: Caught Level
	const caughtLevel = parseInt(fileHex[address + 29], 16);

	//Byte #31: Caught Location
	const caughtLocation = locations[PF][parseInt(fileHex[address + 30], 16)].name;

	//Byte #32: Level
	const level = parseInt(fileHex[address + 31], 16);

	//Byte #33: Status
	const byte33 = hex2bin(fileHex[address + 32]);
	let status: { name: string; turnsRemaining?: number } = { name: 'None' };
	if (byte33.includes('1')) {
		const statuses = [
			'Badly Poisoned',
			'Paralysis',
			'Freeze',
			'Burn',
			'Poison',
			'Sleep',
			'Sleep',
			'Sleep'
		];
		status.name = statuses.find((s, i) => '1' === byte33[i])!;
		if (status.name === 'Sleep') {
			status.turnsRemaining = parseInt(byte33.slice(5), 2);
		}
	}

	//Byte #34: Unused

	//Byte #35-#36: Current HP
	const currentHP = parseInt(fileHex[address + 34] + fileHex[address + 35], 16);

	//Byte #37-#48: Stats (Big Endian)
	const stats = [];
	for (let i = 0; i < 6; i++) {
		stats.push(parseInt(fileHex[address + 36 + i * 2] + fileHex[address + 36 + (i * 2 + 1)], 16));
	}

	return {
		species: species.name,
		form: form.id,
		heldItem,
		moves: moveset,
		OTID,
		exp,
		evs,
		dvs,
		shininess,
		ability,
		nature,
		gender,
		isEgg,
		PPUPs,
		powerPoints,
		happiness,
		pokerus,
		caughtTime,
		caughtBall,
		caughtLevel,
		caughtLocation,
		level,
		status,
		currentHP,
		stats
	};
}
export default parsePartyMon;
