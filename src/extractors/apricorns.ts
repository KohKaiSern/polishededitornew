import { extractIDs, extractNames, extractPNGs } from './common';
import { splitRead } from './utils';
import type { Apricorn, Item } from './types';
import items from './items';

function extractBalls(apricorns: Apricorn[], BALLS: string[], items: Item[]): Apricorn[] {
	let index = 1;
	for (let lineNo = 0; lineNo < BALLS.length; lineNo++) {
		if (!BALLS[lineNo].includes('checkevent EVENT_GAVE_KURT')) continue;
		const pointer = BALLS[lineNo + 1].split(' ').at(1)! + ':';
		let ballIndex = BALLS.findIndex((line) => line.includes(pointer))!;
		while (!BALLS[ballIndex].includes('verbosegiveitemvar')) ballIndex++;
		const ball = BALLS[ballIndex].match(/([A-Z_]+),/)!.at(1)!;
		const apricorn = apricorns.find((a) => a.index === index);
		if (apricorn) {
			apricorn.ball = items.find((i) => i.id === ball)!.name;
		}
		index++;
	}
	return apricorns;
}

const IDS = splitRead('constants/item_constants.asm');
const NAMES = splitRead('data/items/apricorn_names.asm');
const BALLS = splitRead('maps/KurtsHouse.asm');
const PALS = splitRead('gfx/items/apricorns.pal');

const apricorns: {
	polished: Apricorn[];
	faithful: Apricorn[];
} = {
	polished: [],
	faithful: []
};

const NULL_APRICORN: Apricorn = {
	id: null,
	index: -1,
	name: '',
	ball: '',
	spritePath: 'gfx/items/apricorn.png'
};

for (const PF of ['polished', 'faithful'] as const) {
	apricorns[PF] = extractIDs(
		apricorns[PF],
		IDS[PF],
		NULL_APRICORN,
		'const_value - 1 == NUM_ITEMS',
		'NUM_APRICORNS'
	);
	apricorns[PF] = extractNames(apricorns[PF], NAMES[PF], 1);
	apricorns[PF] = extractBalls(apricorns[PF], BALLS[PF], items[PF]);
	apricorns[PF] = extractPNGs(apricorns[PF], PALS[PF], 1);
}

export default apricorns;
