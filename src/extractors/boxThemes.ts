import type { BoxTheme } from './types';
import { extractIDs, extractNames } from './common';
import { splitReadNew } from './utils';

const IDS = splitReadNew('constants/pc_constants.asm');
const NAMES = splitReadNew('data/pc/theme_names.asm');

const boxThemes: {
  polished: BoxTheme[];
  faithful: BoxTheme[];
} = {
  polished: [],
  faithful: []
};

const NULL_BOXTHEME: BoxTheme = {
  id: null,
  index: -1,
  name: ''
};

for (const PF of ['polished', 'faithful'] as const) {
  boxThemes[PF] = extractIDs(
    boxThemes[PF],
    IDS[PF],
    NULL_BOXTHEME,
    undefined,
    'NUM_BILLS_PC_THEMES'
  );
  boxThemes[PF] = extractNames(boxThemes[PF], NAMES[PF], 0);
}

export default boxThemes;
