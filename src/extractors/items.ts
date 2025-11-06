import type { Item } from './types';
import { extractDescs, extractIDs, extractNames, extractPNGs, extractPaths } from './common';
import { splitReadNew } from './utils';

function extractAttrs(items: Item[], ATTRS: string[]): Item[] {
  let index = 1;
  for (let lineNo = 0; lineNo < ATTRS.length; lineNo++) {
    if (ATTRS[lineNo].includes('NUM_ITEMS')) break;
    if (!ATTRS[lineNo].startsWith('item_attribute')) continue;
    items.find((i) => i.index === index)!.category = ATTRS[lineNo].split(',').at(3)!.slice(1);
    index++;
  }
  return items;
}

const IDS = splitReadNew('constants/item_constants.asm');
const NAMES = splitReadNew('data/items/names.asm');
const DESCS = splitReadNew('data/items/descriptions.asm');
const ATTRS = splitReadNew('data/items/attributes.asm');
const PTRS = splitReadNew('data/items/icon_pointers.asm');
const PATHS = splitReadNew('gfx/items.asm');
const PALS = splitReadNew('gfx/items/items.pal');

const items: {
  polished: Item[];
  faithful: Item[];
} = {
  polished: [],
  faithful: []
};

const NULL_ITEM: Item = {
  id: null,
  index: -1,
  name: '',
  description: '',
  category: '',
  spritePath: ''
};

for (const PF of ['polished', 'faithful'] as const) {
  items[PF] = extractIDs(items[PF], IDS[PF], NULL_ITEM, undefined, 'NUM_ITEMS');
  items[PF] = extractNames(items[PF], NAMES[PF], 0);
  items[PF] = extractDescs(items[PF], DESCS[PF], 1, undefined, 'NUM_ITEMS');
  items[PF] = extractAttrs(items[PF], ATTRS[PF]);
  items[PF] = extractPaths(items[PF], PTRS[PF], PATHS[PF], 0, undefined, 'NUM_ITEMS');
  //Special Case: Park Ball
  items[PF][0].id = 'PARK_BALL';
  items[PF][0].spritePath = 'gfx/items/park_ball.png';
  items[PF] = extractPNGs(items[PF], PALS[PF], 0);
}

export default items;
