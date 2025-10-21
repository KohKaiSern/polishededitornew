export interface Form {
	id: string;
	formNo: number;
	type: string[];
	abilities: string[];
	bsts: number[];
	growthRate: string;
	hasGender: boolean;
	learnsets: { level: { name: string; level: number }[]; egg: string[]; tmhm: string[] };
}

export interface Species {
	id: string;
	name: string;
	dexNo: number;
	forms: Partial<Form>[];
}

export interface Item {
	name: string;
	itemNo: number;
	description: string;
	category: string;
}

export interface Move {
	id: string;
	name: string;
	moveNo: number;
	basePower: number;
	type: string;
	accuracy: number;
	powerPoints: number;
	effectChance: number;
	category: string;
	description: string;
}

export interface Ability {
	id: string;
	name: string;
	description: string;
}

export interface Location {
	id: string;
	name: string;
	locationNo: number;
}

export interface Apricorn {
	id: string;
	name: string;
	ball: string;
}
