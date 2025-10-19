import reverseParseBoxNames from './reverseParseBoxNames.js';
import reverseParseBoxThemes from './reverseParseBoxThemes.js';
import reverseParseMon from './reverseParseMon.js';
import parseBoxAddresses from '../../boxes/forward/parseBoxAddresses.js';
import type { Box } from '$lib/types';

function reverseParseBoxes(fileHex: string[], boxes: Box[], PF: 'polished' | 'faithful'): string[] {
	fileHex = reverseParseBoxNames(
		fileHex,
		boxes.map((box) => box.name)
	);
	fileHex = reverseParseBoxThemes(
		fileHex,
		boxes.map((box) => box.theme)
	);
	const addresses = parseBoxAddresses(fileHex);
	for (let box = 0; box < 20; box++) {
		for (let i = 0; i < 20; i++) {
			fileHex = reverseParseMon(fileHex, addresses[box][i], boxes[box].mons[i], PF);
		}
	}
	return fileHex;
}
export default reverseParseBoxes;
