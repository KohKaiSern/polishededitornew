export const buf2hex = (buffer: ArrayBuffer): Array<string> => {
	return Array.from(
		[...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0').toUpperCase())
	);
};

export const hex2buf = (hex: string[]): ArrayBuffer => {
	const bytes = new Uint8Array(hex.map((byte) => parseInt(byte, 16)));
	return bytes.buffer;
};

export const hex2bin = (hex: string): string => {
	return parseInt(hex, 16).toString(2).padStart(8, '0');
};

const TYPE_COLORS: Record<string, string> = {
	BUG: '#92BC2C',
	DARK: '#595761',
	DRAGON: '#0C69C8',
	ELECTRIC: '#F2D94E',
	FIRE: '#FBA54C',
	FAIRY: '#EE90E6',
	FIGHTING: '#D3425F',
	FLYING: '#A1BBEC',
	GHOST: '#5F6DBC',
	GRASS: '#5FBD58',
	GROUND: '#DA7C4D',
	ICE: '#75D0C1',
	NORMAL: '#A0A29F',
	POISON: '#B763CF',
	PSYCHIC: '#FA8581',
	ROCK: '#C9BB8A',
	STEEL: '#5695A3',
	WATER: '#539DDF'
};

export const getTypeColor = (type: string): string => {
	return TYPE_COLORS[type];
};

const HIDDEN_POWER_TYPES = [
	'FIGHTING',
	'FLYING',
	'POISON',
	'GROUND',
	'ROCK',
	'BUG',
	'GHOST',
	'STEEL',
	'FIRE',
	'WATER',
	'GRASS',
	'ELECTRIC',
	'PSYCHIC',
	'ICE',
	'DRAGON',
	'DARK'
];

export const getHiddenPowerType = (x: number): string => {
	return HIDDEN_POWER_TYPES[x];
};
