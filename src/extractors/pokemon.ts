import { splitRead } from './utils';
import type { MonList, Mon } from './types';

const IDS = splitRead('constants/pokemon_constants.asm');
const NAMES = splitRead('data/pokemon/names.asm');

const mons: {
  polished: MonList;
  faithful: MonList;
} = {
  polished: { constants: { num_species: -1, num_cosmetics: -1 }, contents: [] },
  faithful: { constants: { num_species: -1, num_cosmetics: -1 }, contents: [] }
};

const NULL_MON: Mon = {
  id: null,
  index: -1,
  name: '',
};

for (const PF of ['polished', 'faithful'] as const) {
}

export default mons;
