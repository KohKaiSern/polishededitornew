export interface Mon {
	species: string;
	form: string;
	heldItem: string;
	moves: string[];
	OTID: number;
	exp: number;
	evs: number[];
	dvs: number[];
	shininess: 'Shiny' | 'Not Shiny';
	ability: string;
	nature: string;
	isEgg: boolean;
	gender: string;
	PPUPs: number[];
	happiness: number;
	pokerus: number[];
	level: number;
	OTGender: string;
	caughtBall: string;
	caughtTime: string;
	caughtLevel: number;
	caughtLocation: string;
	nickname: string;
	OTNickname: string;
}

export interface Box {
	name: string;
	theme: string;
	mons: Mon[];
}

export interface Item {
	name: string;
	qty: number;
}

export interface BagSlot {
	count?: number;
	contents: Item[];
}

export interface Player {
	name: string;
	money: number;
	badges: string[];
	gender: string;
	palette: string;
}
