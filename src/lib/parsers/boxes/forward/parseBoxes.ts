import type { Box } from '$lib/types';
import parseBoxAddresses from './parseBoxAddresses';
import parseBoxNames from './parseBoxNames';
import parseThemes from './parseBoxThemes';
import parseMon from './parseMon';

function parseBoxes(fileHex: string[], PF: 'polished' | 'faithful'): Box[] {
	const names = parseBoxNames(fileHex);
	const themes = parseThemes(fileHex);
	const addresses = parseBoxAddresses(fileHex);
	const mons = Array(20)
		.fill(null)
		.map(() => Array(20).fill(null));
	for (let box = 0; box < 20; box++) {
		for (let i = 0; i < 20; i++) {
			if (!addresses[box][i]) continue;
			mons[box][i] = parseMon(fileHex, addresses[box][i], PF);
		}
	}
	const boxes: Box[] = [];
	for (let box = 0; box < 20; box++) {
		boxes.push({
			name: names[box],
			theme: themes[box],
			mons: mons[box]
		});
	}
	return boxes;
}
export default parseBoxes;
