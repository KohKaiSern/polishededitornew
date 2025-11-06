import type { Location } from './types';
import { extractIDs } from './common';
import { splitReadNew } from './utils';

//This file uses pointers instead of a simple index-based system, which is why
//it requires a special extractNames implementation.
function extractNames(data: Location[], NAMES: string[]): Location[] {
  let index = 0;
  for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
    if (!NAMES[lineNo].startsWith('landmark')) continue;
    const pointer = NAMES[lineNo].split(', ').at(-1)! + ':';
    let descIndex = NAMES.findIndex((l) => l.includes(pointer))!;
    while (!NAMES[descIndex].includes('"')) descIndex++;
    data.find((i) => i.index === index)!.name = NAMES[descIndex].split('"').at(1)!;
    index++;
  }
  return data;
}

const IDS = splitReadNew('constants/landmark_constants.asm');
const NAMES = splitReadNew('data/maps/landmarks.asm');

const locations: {
  polished: Location[];
  faithful: Location[];
} = {
  polished: [],
  faithful: []
};

const NULL_LOCATION: Location = {
  id: null,
  index: -1,
  name: ''
};

for (const PF of ['polished', 'faithful'] as const) {
  locations[PF] = extractIDs(locations[PF], IDS[PF], NULL_LOCATION, undefined, 'NUM_LANDMARKS');
  locations[PF] = extractNames(locations[PF], NAMES[PF]);
}

export default locations;
