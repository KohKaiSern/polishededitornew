import versions from './data/versions.json';
import addresses from './data/addresses.json';

export const hex2buf = (hex: string[]): ArrayBuffer => {
	const bytes = new Uint8Array(hex.map((byte) => parseInt(byte, 16)));
	return bytes.buffer;
};

export const hex2bin = (hex: string): string => {
	return parseInt(hex, 16).toString(2).padStart(8, '0');
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

export const validateSave = async (file: File): Promise<string> => {
	if (file.size < 32000 || file.size > 33000) {
		return "This doesn't look like a save file. Make sure it's a battery save and not an emulator save state.";
	}
	const fileHex = Array.from(await file.bytes()).map((x) =>
		x.toString(16).padStart(2, '0').toUpperCase()
	);
	if (parseInt(fileHex[addresses.sSaveVersion + 1], 16) === versions.save) {
		return 'Save Validated!';
	}
	return `This save has the wrong save version. The current save version is ${versions.save}. Make sure that you're on the latest stable release, ${versions.game}.`;
};
