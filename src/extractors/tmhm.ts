import moves from '../lib/data/moves.json';
import { reduce, splitRead } from './utils';

function extractNames(NAMES: string[], PF: 'polished' | 'faithful'): Record<string, string> {
	const names: Record<string, string> = {};
	for (let lineNo = 0; lineNo < NAMES.length - 2; lineNo++) {
		if (!NAMES[lineNo].includes('db')) continue;
		if (PF === 'polished') {
			NAMES[lineNo] = NAMES[lineNo].replace('ROCK_SMASH', 'BRICK_BREAK');
		}
		names[NAMES[lineNo].match(/; (.+?) /)!.at(1)!] = moves[PF].find(
			(m) => m.id === reduce(NAMES[lineNo].match(/db (.+?) /)!.at(1)!)
		)!.name;
	}
	return names;
}

const NAMES = splitRead('data/moves/tmhm_moves.asm');

const tmhm = {
	polished: extractNames(NAMES.polished, 'polished'),
	faithful: extractNames(NAMES.faithful, 'faithful')
};
export default tmhm;
