import type { Move } from './types';
import { extractDescs, extractIDs, extractNames } from './common';
import { splitRead } from './utils';

function extractAttrs(moves: Move[], ATTRS: string[]): Move[] {
  let index = 1;
  for (let lineNo = 0; lineNo < ATTRS.length; lineNo++) {
    if (!ATTRS[lineNo].startsWith('move')) continue;
    const attributes = ATTRS[lineNo]
      .split(',')
      .map((a) => a.trim())
      .slice(2);
    const move = moves.find((m) => m.index === index)!;
    move.basePower = parseInt(attributes.at(0)!);
    move.type = attributes.at(1)!;
    move.accuracy = parseInt(attributes.at(2)!);
    move.powerPoints = parseInt(attributes.at(3)!);
    move.effectChance = parseInt(attributes.at(4)!);
    move.category = attributes.at(5)!;
    index++;
  }
  return moves;
}

const IDS = splitRead('constants/move_constants.asm');
const NAMES = splitRead('data/moves/names.asm');
const DESCS = splitRead('data/moves/descriptions.asm');
const ATTRS = splitRead('data/moves/moves.asm');

const moves: {
  polished: Move[];
  faithful: Move[];
} = {
  polished: [],
  faithful: []
};

const NULL_MOVE: Move = {
  id: null,
  index: -1,
  name: '',
  description: '',
  basePower: -1,
  type: '',
  accuracy: -1,
  powerPoints: -1,
  effectChance: -1,
  category: ''
};

for (const PF of ['polished', 'faithful'] as const) {
  moves[PF] = extractIDs(moves[PF], IDS[PF], NULL_MOVE, undefined, 'NUM_ATTACKS');
  moves[PF] = extractNames(moves[PF], NAMES[PF], 1);
  moves[PF] = extractDescs(moves[PF], DESCS[PF], 1);
  moves[PF] = extractAttrs(moves[PF], ATTRS[PF]);
}

export default moves;
