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
	pokerus: {
		strain: number | 'None';
		daysRemaining: number | 'None' | 'Cured';
	};
	level: number;
	caughtBall: string;
	caughtTime: string;
	caughtLevel: number;
	caughtLocation: string;
	hyperTraining: boolean[];
	nickname: string;
	OTNickname: string;
}

export interface PartyMon extends Mon {
	currentHP: number;
	stats: number[];
	status: string | ['Sleep', number];
	powerPoints: number[];
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
	id: number;
	name: string;
	rivalName: string;
	money: number;
	badges: { name: string; owned: boolean }[];
	gender: string;
}
