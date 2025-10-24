import type { PartyMon, Player } from './types';
import addresses from './data/addresses.json';
import charmap from './data/charmap.json';
import versions from './data/versions.json';

export const buf2hex = async (buf: File): Promise<string[]> => {
	return [...(await buf.bytes())].map((x) => x.toString(16).padStart(2, '0').toUpperCase());
};

export const hex2buf = (hex: string[]): ArrayBuffer => {
	const bytes = new Uint8Array(hex.map((byte) => parseInt(byte, 16)));
	return bytes.buffer;
};

export const hex2bin = (hex: string): string => {
	return parseInt(hex, 16).toString(2).padStart(8, '0');
};

export const bin2hex = (bin: string): string => {
	return parseInt(bin, 2).toString(16).padStart(2, '0').toUpperCase();
};

const TYPE_COLORS: Record<string, string> = {
	Bug: '#92BC2C',
	Dark: '#595761',
	Dragon: '#0C69C8',
	Electric: '#F2D94E',
	Fire: '#FBA54C',
	Fairy: '#EE90E6',
	Fighting: '#D3425F',
	Flying: '#A1BBEC',
	Ghost: '#5F6DBC',
	Grass: '#5FBD58',
	Ground: '#DA7C4D',
	Ice: '#75D0C1',
	Normal: '#A0A29F',
	Poison: '#B763CF',
	Psychic: '#FA8581',
	Rock: '#C9BB8A',
	Steel: '#5695A3',
	Water: '#539DDF'
};

export const getTypeColor = (type: string): string => {
	return TYPE_COLORS[type];
};

const HIDDEN_POWER_TYPES = [
	'Fighting',
	'Flying',
	'Poison',
	'Ground',
	'Rock',
	'Bug',
	'Ghost',
	'Steel',
	'Fire',
	'Water',
	'Grass',
	'Electric',
	'Psychic',
	'Ice',
	'Dragon',
	'Dark'
];

export const getHiddenPowerType = (x: number): string => {
	return HIDDEN_POWER_TYPES[x];
};

const NATURES = [
	'Hardy',
	'Lonely',
	'Brave',
	'Adamant',
	'Naughty',
	'Bold',
	'Docile',
	'Relaxed',
	'Impish',
	'Lax',
	'Timid',
	'Hasty',
	'Serious',
	'Jolly',
	'Naive',
	'Modest',
	'Mild',
	'Quiet',
	'Bashful',
	'Rash',
	'Calm',
	'Gentle',
	'Sassy',
	'Careful',
	'Quirky'
];

export const getNature = (x: number): string => {
	return NATURES[x];
};

export const getNatureNo = (nature: string): number => {
	return NATURES.findIndex((n) => n === nature);
};

export const validateSave = async (file: File): Promise<string> => {
	if (file.size < 32000 || file.size > 33000) {
		return "This doesn't look like a save file. Make sure it's a battery save and not an emulator save state.";
	}
	const fileHex = await buf2hex(file);
	const playerSaveVersion = parseInt(
		fileHex[addresses.sSaveVersion] + fileHex[addresses.sSaveVersion + 1],
		16
	);
	if (playerSaveVersion === versions.save) {
		return 'Save Validated!';
	}
	return `This save has the wrong save version. The current save version is ${versions.save}. Make sure that you're on the latest stable release, ${versions.game}.`;
};

export const readString = (
	fileHex: string[],
	address: number,
	length: number,
	hasChecksum: boolean
): string => {
	let name = '';
	for (let i = 0; i < length; i++) {
		if (hasChecksum) {
			fileHex[address + i] = bin2hex('1' + hex2bin(fileHex[address + i]).slice(1));
		}
		//Terminators
		if (fileHex[address + i] === '53' || fileHex[address + i] === 'FB') break;
		//Space
		if (fileHex[address + i] === '7F') {
			name += ' ';
			continue;
		}
		//Zero
		if (fileHex[address + i] === '00') {
			name += '0';
			continue;
		}
		name += charmap[fileHex[address + i] as keyof typeof charmap];
	}
	return name;
};

export const writeString = (
	fileHex: string[],
	address: number,
	length: number,
	name: string,
	hasChecksum: boolean
) => {
	for (let i = 0; i < name.length; i++) {
		//Space
		if (name[i] === ' ') {
			fileHex[address + i] = '7F';
			continue;
		}
		//Zero
		if (name[i] === '0' && hasChecksum) {
			fileHex[address + i] = '00';
			continue;
		}
		fileHex[address + i] = Object.keys(charmap).find(
			(c) => charmap[c as keyof typeof charmap] === name[i]
		)!;
		continue;
	}
	//Once we finish the name, we should add the terminator,
	//followed by FFs for the rest of the bytes.
	//...unless it's max length already.
	if (length === name.length) return fileHex;
	fileHex[address + name.length] = hasChecksum ? 'FB' : '53';
	for (let i = name.length + 1; i < length; i++) {
		fileHex[address + i] = hasChecksum ? 'FB' : 'FF';
	}
	return fileHex;
};

export const cammyFormat = (str: string): string => {
	if (str === 'spiky_eared') {
		return 'spiky';
	}
	return str
		.toLowerCase()
		.replaceAll(' ', '_')
		.replaceAll('-', '_')
		.replaceAll("'", '_')
		.replaceAll('.', '_')
		.replaceAll('♂', '_m')
		.replaceAll('♀', '_f')
		.replaceAll('é', 'e');
};

const TYPE_COLOURS = {
	bug: '#92BC2C',
	dark: '#595761',
	dragon: '#0C69C8',
	electric: '#F2D94E',
	fire: '#FBA54C',
	fairy: '#EE90E6',
	fighting: '#D3425F',
	flying: '#A1BBEC',
	ghost: '#5F6DBC',
	grass: '#5FBD58',
	ground: '#DA7C4D',
	ice: '#75D0C1',
	normal: '#A0A29F',
	poison: '#B763CF',
	psychic: '#FA8581',
	rock: '#C9BB8A',
	steel: '#5695A3',
	water: '#539DDF'
};

export const getTypeColour = (type: string): string => {
	return TYPE_COLOURS[type as keyof typeof TYPE_COLOURS];
};

export const getEmptyPartyMon = (player: Player): PartyMon => {
	return {
		species: 'Bulbasaur',
		form: 'plain',
		heldItem: 'None',
		moves: ['Tackle', 'None', 'None', 'None'],
		OTID: player.id,
		exp: 0,
		evs: [0, 0, 0, 0, 0, 0],
		dvs: [0, 0, 0, 0, 0, 0],
		shininess: 'Not Shiny',
		ability: 'Overgrow',
		nature: 'Hardy',
		isEgg: false,
		gender: 'Male',
		PPUPs: [0, 0, 0, 0],
		powerPoints: [35, 0, 0, 0],
		happiness: 0,
		pokerus: {
			strain: 'None',
			daysRemaining: 'None'
		},
		level: 1,
		caughtBall: 'Poké Ball',
		caughtTime: 'Day',
		caughtLevel: 1,
		caughtLocation: 'New Bark Town',
		hyperTraining: [false, false, false, false, false, false],
		nickname: 'Bulbasaur',
		OTNickname: player.name,
		currentHP: 12,
		stats: [12, 6, 6, 6, 6, 6],
		status: { name: 'None' }
	};
};
