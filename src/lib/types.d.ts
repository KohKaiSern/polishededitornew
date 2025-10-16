export interface Mon {
	species: string;
	heldItem: string;
	moves: Array<string>;
	exp: number;
	level: number;
	statExps: Array<number>;
	dvs: Array<number>;
	happiness: number;
	isEgg: boolean;
}

interface Item {
	name: string;
	qty: number;
}

export interface BagSlot {
	count?: number;
	contents: Array<Item>;
}

export interface Player {
	name: string;
	money: number;
	badges: string[];
	gender: string;
	palette: string;
}
