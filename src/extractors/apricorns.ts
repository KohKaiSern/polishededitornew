import type { Apricorn } from './types';
import items from '$data/items.json';
import { consolidate, reduce, splitRead } from './utils';

function extractNames(NAMES: string[]): Omit<Apricorn, 'ball'>[] {
  const names: Omit<Apricorn, 'ball'>[] = [];
  for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
    if (!NAMES[lineNo].includes('"')) continue;
    names.push({
      id: reduce(NAMES[lineNo].split('"').at(1)!),
      name: NAMES[lineNo].split('"').at(1)!
    });
  }
  return names;
}

function extractBalls(BALLS: string[], PF: 'polished' | 'faithful'): Omit<Apricorn, 'name'>[] {
  const balls: Omit<Apricorn, 'name'>[] = [];
  for (let lineNo = 0; lineNo < BALLS.length; lineNo++) {
    if (!BALLS[lineNo].includes('checkevent EVENT_GAVE_KURT')) continue;
    balls.push({
      id: reduce(BALLS[lineNo].split('_').slice(-2).join('')),
      ball: items[PF].find(
        (item) => reduce(item.name) === reduce(BALLS[lineNo + 1].split('.Give').at(1)!)
      )!.name
    });
    lineNo++;
  }
  return balls;
}

const NAMES = splitRead('data/items/apricorn_names.asm');
const BALLS = splitRead('maps/KurtsHouse.asm');

const apricorns = {
  polished: consolidate<Apricorn>(
    'id',
    extractNames(NAMES.polished),
    extractBalls(BALLS.polished, 'polished')
  ),
  faithful: consolidate<Apricorn>(
    'id',
    extractNames(NAMES.faithful),
    extractBalls(BALLS.faithful, 'faithful')
  )
};
export default apricorns;
