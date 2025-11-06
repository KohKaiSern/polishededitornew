import type { Move } from './types';
import moves from './moves';
import { splitReadNew } from './utils';

function extractTMHMs(
  tmhms: Record<string, string>,
  TMHMS: string[],
  moves: Move[]
): Record<string, string> {
  let index = 1;
  let NUM_TMS = -1;
  for (let lineNo = 0; lineNo < TMHMS.length; lineNo++) {
    if (TMHMS[lineNo].includes('NUM_HMS')) break;
    if (TMHMS[lineNo].includes('NUM_TMS')) NUM_TMS = index - 1;
    if (!TMHMS[lineNo].startsWith('db')) continue;
    const move = moves.find((m) => m.id === TMHMS[lineNo].match(/[A-Z_]+/)!.at(0)!)!.name;
    tmhms[
      NUM_TMS === -1
        ? `TM${index.toString().padStart(2, '0')}`
        : `HM0${(index - NUM_TMS).toString()}`
    ] = move;
    index++;
  }
  return tmhms;
}

const TMHMS = splitReadNew('data/moves/tmhm_moves.asm');

const tmhms: {
  polished: Record<string, string>;
  faithful: Record<string, string>;
} = {
  polished: {},
  faithful: {}
};

for (const PF of ['polished', 'faithful'] as const) {
  tmhms[PF] = extractTMHMs(tmhms[PF], TMHMS[PF], moves[PF]);
}

export default tmhms;
