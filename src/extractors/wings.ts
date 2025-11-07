import { extractIDs, extractNames, extractPNGs } from './common';
import { splitRead } from './utils';
import type { Wing } from './types';

const IDS = splitRead('constants/item_constants.asm');
const NAMES = splitRead('data/items/wing_names.asm');
const PALS = splitRead('gfx/items/wings.pal');

const wings: {
	polished: Wing[];
	faithful: Wing[];
} = {
	polished: [],
	faithful: []
};

const NULL_WING: Wing = {
	id: null,
	index: -1,
	name: '',
	spritePath: 'gfx/items/wing.png'
};

for (const PF of ['polished', 'faithful'] as const) {
	wings[PF] = extractIDs(wings[PF], IDS[PF], NULL_WING, 'NUM_APRICORNS', 'NUM_WINGS');
	wings[PF] = extractNames(wings[PF], NAMES[PF], 0);
	wings[PF] = extractPNGs(wings[PF], PALS[PF], 0);
}

export default wings;
