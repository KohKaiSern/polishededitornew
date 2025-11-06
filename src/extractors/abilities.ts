import type { Ability } from './types';
import { extractDescs, extractIDs, extractNames } from './common';
import { splitReadNew } from './utils';

const IDS = splitReadNew('constants/ability_constants.asm');
const NAMES = splitReadNew('data/abilities/names.asm');
const DESCS = splitReadNew('data/abilities/descriptions.asm');

const abilities: {
  polished: Ability[];
  faithful: Ability[];
} = {
  polished: [],
  faithful: []
};

const NULL_ABILITY: Ability = {
  id: null,
  index: -1,
  name: '',
  description: ''
};

for (const PF of ['polished', 'faithful'] as const) {
  abilities[PF] = extractIDs(abilities[PF], IDS[PF], NULL_ABILITY);
  abilities[PF] = extractNames(abilities[PF], NAMES[PF], 0);
  abilities[PF] = extractDescs(abilities[PF], DESCS[PF], 0);
}

export default abilities;
