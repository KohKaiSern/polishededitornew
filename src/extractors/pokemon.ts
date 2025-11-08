import { splitRead } from './utils';
import type { MonList, Mon } from './types';
import { extractNames } from './common';

function extractIDs(mons: MonList, IDS: string[], empty: Mon): MonList {
  let lineNo = 0;
  while (!IDS[lineNo].includes('const_def')) lineNo++;
  let index = parseInt(IDS[lineNo].match(/\d+/)!.at(0)!)
  for (; lineNo < IDS.length; lineNo++) {
    if (IDS[lineNo].startsWith('DEF NUM_SPECIES')) {
      mons.constants.num_species = index - 1;
    }
    if (IDS[lineNo].startsWith('DEF NUM_COSMETIC_FORMS')) {
      mons.constants.num_cosmetics = index - mons.constants.num_species - 1;
    }
    if (/const(_skip)?(?!_)/.test(IDS[lineNo])) {
      mons.contents.push({
        ...empty,
        id: IDS[lineNo].startsWith('const_skip') ? null : IDS[lineNo].match(/[A-Z][A-Z_\d]+/)!.at(0)!,
        index
      });
      index++;
    }
  }
  return mons
}

const IDS = splitRead('constants/pokemon_constants.asm');
const NAMES = splitRead('data/pokemon/names.asm');

const mons: {
  polished: MonList;
  faithful: MonList;
} = {
  polished: { constants: {}, contents: [] },
  faithful: { constants: {}, contents: [] }
};

const NULL_MON: Mon = {
  id: null,
  index: -1,
  name: '',
};

for (const PF of ['polished', 'faithful'] as const) {
  mons[PF] = extractIDs(mons[PF], IDS[PF], NULL_MON)
  mons[PF].contents = extractNames(mons[PF].contents, NAMES[PF], 0)
}

export default mons;
