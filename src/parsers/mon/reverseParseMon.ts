import items from '$data/items.json';
import locations from '$data/locations.json';
import moves from '$data/moves.json';
import natures from '$data/natures.json';
import pokemon from '$data/pokemon.json';
import type { BoxMon, PartyMon } from '$parsers/types';
import { insert, writeString } from '$parsers/utils';

export function reverseParsePartyMon(
	file: Uint8Array,
	address: number,
	mon: PartyMon,
	PF: 'polished' | 'faithful'
): Uint8Array {
	file = species(file, address, mon.species, PF);
	file = form(file, address, mon.species, mon.form, PF);
	if (mon.species === 'Dunsparce') {
		file = dunsparceForm(file, address + 21, mon.dunsparceForm);
	}
	file = heldItem(file, address + 1, mon.heldItem, PF);
	file = moveset(file, address + 2, mon.moveset, PF);
	file = OTID(file, address + 6, mon.OTID);
	file = exp(file, address + 8, mon.exp);
	file = evs(file, address + 11, mon.evs);
	file = dvs(file, address + 17, mon.dvs);
	file = shininess(file, address + 20, mon.shininess);
	file = ability(file, address + 20, mon.species, mon.form, mon.ability, PF);
	file = nature(file, address + 20, mon.nature, PF);
	file = gender(file, address + 21, mon.gender);
	file = isEgg(file, address + 21, mon.isEgg);
	file = powerPoints(file, address + 22, mon.powerPoints);
	file = partyPPUPs(file, address + 22, mon.PPUPs);
	file = happiness(file, address + 26, mon.happiness);
	file = pokerus(file, address + 27, mon.pokerus);
	file = caughtTime(file, address + 28, mon.caughtTime);
	file = caughtBall(file, address + 28, mon.caughtBall, PF);
	file = caughtLevel(file, address + 29, mon.caughtLevel);
	file = caughtLocation(file, address + 30, mon.caughtLocation, PF);
	file = level(file, address + 31, mon.level);
	file = status(file, address + 32, mon.status);
	file = currentHP(file, address + 34, mon.currentHP);
	file = stats(file, address + 36, mon.stats);
	return file;
}

export function reverseParseBoxMon(
	file: Uint8Array,
	address: number,
	mon: BoxMon,
	PF: 'polished' | 'faithful'
): Uint8Array {
	file = species(file, address, mon.species, PF);
	file = form(file, address, mon.species, mon.form, PF);
	if (mon.species === 'Dunsparce') {
		file = dunsparceForm(file, address + 21, mon.dunsparceForm);
	}
	file = heldItem(file, address + 1, mon.heldItem, PF);
	file = moveset(file, address + 2, mon.moveset, PF);
	file = OTID(file, address + 6, mon.OTID);
	file = exp(file, address + 8, mon.exp);
	file = evs(file, address + 11, mon.evs);
	file = dvs(file, address + 17, mon.dvs);
	file = shininess(file, address + 20, mon.shininess);
	file = ability(file, address + 20, mon.species, mon.form, mon.ability, PF);
	file = nature(file, address + 20, mon.nature, PF);
	file = gender(file, address + 21, mon.gender);
	file = isEgg(file, address + 21, mon.isEgg);
	file = boxPPUPs(file, address + 22, mon.PPUPs);
	file = happiness(file, address + 23, mon.happiness);
	file = pokerus(file, address + 24, mon.pokerus);
	file = caughtTime(file, address + 25, mon.caughtTime);
	file = caughtBall(file, address + 25, mon.caughtBall, PF);
	file = caughtLevel(file, address + 26, mon.caughtLevel);
	file = caughtLocation(file, address + 27, mon.caughtLocation, PF);
	file = level(file, address + 28, mon.level);
	file = hyperTraining(file, address + 29, mon.hyperTraining);
	file = writeString(file, address + 32, 10, mon.nickname, true);
	file = writeString(file, address + 42, 7, mon.OTNickname, true);
	return file;
}

const species = (
	file: Uint8Array,
	address: number,
	species: string,
	PF: 'polished' | 'faithful'
): Uint8Array => {
	const index = pokemon[PF].find((p) => p.name === species)!.index;
	file[address] = index & 0xff;
	file[address + 21] = (file[address + 21] & 0xdf) | ((index & 0x100) >> 3);
	return file;
};

const form = (
	file: Uint8Array,
	address: number,
	species: string,
	form: string,
	PF: 'polished' | 'faithful'
): Uint8Array => {
	const mon = pokemon[PF].find((p) => p.name === species)!;
	const index = mon.forms.find((f) => f.name === form)!.index;
	file[address + 21] = (file[address + 21] & 0xe0) | index;
	return file;
};

const dunsparceForm = (
	file: Uint8Array,
	address: number,
	dunsparceForm: 'Two-Segment' | 'Three-Segment'
): Uint8Array => (
	(file[address] = (file[address] & 0xe0) | (dunsparceForm === 'Three-Segment' ? 2 : 1)),
	file
);

const heldItem = (
	file: Uint8Array,
	address: number,
	heldItem: string,
	PF: 'polished' | 'faithful'
): Uint8Array => {
	if (heldItem === 'None') {
		file[address] = 0;
	} else {
		file[address] = items[PF].find((i) => i.name === heldItem)!.index;
	}
	return file;
};

const moveset = (
	file: Uint8Array,
	address: number,
	moveset: string[],
	PF: 'polished' | 'faithful'
): Uint8Array => {
	for (let i = 0; i < 4; i++) {
		if (moveset[i] === 'None') {
			file[address + i] = 0;
		} else {
			file[address + i] = moves[PF].find((m) => m.name === moveset[i])!.index;
		}
	}
	return file;
};

const OTID = (file: Uint8Array, address: number, OTID: number): Uint8Array => (
	(file = insert(file, address, 2, OTID)),
	file
);

const exp = (file: Uint8Array, address: number, exp: number): Uint8Array => (
	(file = insert(file, address, 3, exp)),
	file
);

const evs = (file: Uint8Array, address: number, evs: number[]): Uint8Array => {
	for (let i = 0; i < 6; i++) {
		file[address + i] = evs[i];
	}
	return file;
};

const dvs = (file: Uint8Array, address: number, dvs: number[]): Uint8Array => {
	for (let i = 0; i < 3; i++) {
		file[address + i] = (dvs[i * 2] << 4) | dvs[i * 2 + 1];
	}
	return file;
};

const shininess = (
	file: Uint8Array,
	address: number,
	shininess: 'Shiny' | 'Not Shiny'
): Uint8Array => (
	(file[address] = (file[address] & 0x7f) | ((shininess === 'Shiny' ? 1 : 0) << 7)),
	file
);

const ability = (
	file: Uint8Array,
	address: number,
	species: string,
	form: string,
	ability: string,
	PF: 'polished' | 'faithful'
): Uint8Array => {
	const mon = pokemon[PF].find((p) => p.name === species)!;
	const f = mon.forms.find((f) => f.name === form)!;
	const index = (f.abilities.findIndex((a) => a === ability)! + 1) % 3;
	file[address] = (file[address] & 0x9f) | (index << 5);
	return file;
};

const nature = (file: Uint8Array, address: number, nature: string, PF: 'polished' | 'faithful') => {
	const index = natures[PF].find((n) => n.name === nature)!.index;
	file[address] = (file[address] & 0xe0) | index;
	return file;
};

const gender = (file: Uint8Array, address: number, gender: string): Uint8Array => (
	(file[address] = (file[address] & 0x7f) | ((gender === 'Female' ? 1 : 0) << 7)),
	file
);

const isEgg = (file: Uint8Array, address: number, isEgg: boolean): Uint8Array => (
	(file[address] = (file[address] & 0xbf) | ((isEgg ? 1 : 0) << 6)),
	file
);

const powerPoints = (file: Uint8Array, address: number, powerPoints: number[]): Uint8Array => {
	for (let i = 0; i < 4; i++) {
		file[address + i] = (file[address + i] & 0xc0) | powerPoints[i];
	}
	return file;
};

const partyPPUPs = (file: Uint8Array, address: number, PPUPs: number[]): Uint8Array => {
	for (let i = 0; i < 4; i++) {
		file[address + i] = (file[address + i] & 0x3f) | (PPUPs[i] << 6);
	}
	return file;
};

const boxPPUPs = (file: Uint8Array, address: number, PPUPs: number[]): Uint8Array => (
	(file[address] = PPUPs.reduce((a, b) => (a << 2) | b)),
	file
);

const happiness = (file: Uint8Array, address: number, happiness: number): Uint8Array => (
	(file[address] = happiness),
	file
);

const pokerus = (
	file: Uint8Array,
	address: number,
	pokerus: {
		strain: number | 'None' | 'Cured';
		daysRemaining?: number;
	}
): Uint8Array => {
	if (pokerus.strain === 'None') {
		file[address] = 0;
	} else if (pokerus.strain === 'Cured') {
		file[address] = 0b1101;
	} else {
		file[address] = (2 ** (5 - pokerus.strain) - 1) << (pokerus.strain - pokerus.daysRemaining!);
	}
	return file;
};

const caughtTime = (file: Uint8Array, address: number, caughtTime: string): Uint8Array => (
	(file[address] =
		(file[address] & 0x1f) |
		(['Evening', 'Morning', 'Day', 'Night'].findIndex((t) => t === caughtTime) << 5)),
	file
);

const caughtBall = (
	file: Uint8Array,
	address: number,
	caughtBall: string,
	PF: 'polished' | 'faithful'
): Uint8Array => (
	(file[address] = (file[address] & 0xe0) | items[PF].find((i) => i.name === caughtBall)!.index),
	file
);

const caughtLevel = (file: Uint8Array, address: number, caughtLevel: number): Uint8Array => (
	(file[address] = caughtLevel),
	file
);

const caughtLocation = (
	file: Uint8Array,
	address: number,
	caughtLocation: string,
	PF: 'polished' | 'faithful'
): Uint8Array => (
	(file[address] = locations[PF].find((l) => l.name === caughtLocation)!.index),
	file
);

const level = (file: Uint8Array, address: number, level: number): Uint8Array => (
	(file[address] = level),
	file
);

const status = (
	file: Uint8Array,
	address: number,
	status: {
		name: string;
		turnsRemaining?: number;
	}
): Uint8Array => {
	if (status.name === 'None') {
		file[address] = 0;
	} else if (status.name === 'Sleep') {
		file[address] = status.turnsRemaining!;
	} else {
		file[address] =
			1 <<
			(7 -
				[
					'Badly Poisoned',
					'Paralysis',
					'Freeze',
					'Burn',
					'Poison',
					'Sleep',
					'Sleep',
					'Sleep'
				].findIndex((s) => s === status.name));
	}
	return file;
};

const currentHP = (file: Uint8Array, address: number, currentHP: number): Uint8Array => (
	(file = insert(file, address, 2, currentHP)),
	file
);

const stats = (file: Uint8Array, address: number, stats: number[]): Uint8Array => {
	for (let i = 0; i < 6; i++) {
		file = insert(file, address + i * 2, 2, stats[i]);
	}
	return file;
};

const hyperTraining = (file: Uint8Array, address: number, hyperTraining: boolean[]): Uint8Array => (
	(file[address] = hyperTraining.map((s) => Number(s)).reduce((a, b) => (a << 1) | b) << 2),
	file
);
