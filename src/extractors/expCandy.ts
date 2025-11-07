import { extractDescs, extractIDs, extractNames, extractPaths } from './common';
import { applyPalette, splitRead } from './utils';
import type { ExpCandy } from './types';

const IDS = splitRead('constants/item_constants.asm');
const NAMES = splitRead('data/items/exp_candy_names.asm');
const DESCS = splitRead('data/items/descriptions.asm');
const PTRS = splitRead('data/items/icon_pointers.asm');
const PATHS = splitRead('gfx/items.asm');
const PALS = splitRead('engine/gfx/color.asm')

function extractPNGs(expCandy: ExpCandy[], PALS: string[]): ExpCandy[] {
  let lineNo = PALS.findIndex(line => line === 'ExpCandyIconPalette:')!
  const color1 = PALS[lineNo + 1].match(/\d+/g)!.slice(0, 3).map(Number)
  const color2 = PALS[lineNo + 2].match(/\d+/g)!.slice(0, 3).map(Number)
  for (const candy of expCandy) {
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
  expCandy[PF] = extractPNGs(expCandy[PF], PALS[PF]);
}

export default expCandy;
