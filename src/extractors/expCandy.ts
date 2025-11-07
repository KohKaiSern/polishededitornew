import { extractDescs, extractIDs, extractNames, extractPaths } from './common';
import { applyPalette, splitRead } from './utils';
import type { ExpCandy } from './types';

const IDS = splitRead('constants/item_constants.asm');
const NAMES = splitRead('data/items/exp_candy_names.asm');
const DESCS = splitRead('data/items/descriptions.asm');
const PTRS = splitRead('data/items/icon_pointers.asm');
const PATHS = splitRead('gfx/items.asm');

//TODO: Exp Candy Palettes
function extractPNGs(expCandy: ExpCandy[]): ExpCandy[] {
	for (const candy of expCandy) {
		const color1 = [8, 21, 31];
		const color2 = [31, 11, 27];
		applyPalette(candy.spritePath, `gfx/items/${candy.id}.png`, color1, color2);
		candy.spritePath = `gfx/items/${candy.id}.png`;
	}
	return expCandy;
}

const expCandy: {
	polished: ExpCandy[];
	faithful: ExpCandy[];
} = {
	polished: [],
	faithful: []
};

const NULL_EXPCANDY: ExpCandy = {
	id: null,
	index: -1,
	name: '',
	description: '',
	spritePath: ''
};

for (const PF of ['polished', 'faithful'] as const) {
	expCandy[PF] = extractIDs(expCandy[PF], IDS[PF], NULL_EXPCANDY, 'NUM_WINGS', 'NUM_CANDIES');
	expCandy[PF] = extractNames(expCandy[PF], NAMES[PF], 1);
	expCandy[PF] = extractDescs(expCandy[PF], DESCS[PF], 1, 'NUM_KEY_ITEMS', 'NUM_CANDIES');
	expCandy[PF] = extractPaths(expCandy[PF], PTRS[PF], PATHS[PF], 0, 'NUM_KEY_ITEMS', 'NUM_CANDIES');
	expCandy[PF] = extractPNGs(expCandy[PF]);
}

export default expCandy;
