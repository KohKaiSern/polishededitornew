import checksumMon from '$lib/parsers/checksumMon.js';
import type { Box } from '$lib/types';
import parseBoxAddresses from '../../boxes/forward/parseBoxAddresses.js';
import reverseParseBoxAddresses from './reverseParseBoxAddresses.js';
import reverseParseBoxNames from './reverseParseBoxNames.js';
import reverseParseBoxThemes from './reverseParseBoxThemes.js';
import reverseParseMon from './reverseParseMon.js';

function reverseParseBoxes(fileHex: string[], boxes: Box[], PF: 'polished' | 'faithful'): string[] {
	fileHex = reverseParseBoxNames(
		fileHex,
		boxes.map((box) => box.name)
	);
	fileHex = reverseParseBoxThemes(
		fileHex,
		boxes.map((box) => box.theme)
	);
	fileHex = reverseParseBoxAddresses(
		fileHex,
		boxes.map((box) => box.mons)
	);
	const addresses = parseBoxAddresses(fileHex);
	for (let box = 0; box < 20; box++) {
		for (let i = 0; i < 20; i++) {
			if (boxes[box].mons[i]) {
				fileHex = reverseParseMon(fileHex, addresses[box][i], boxes[box].mons[i]!, PF);
				fileHex = checksumMon(fileHex, addresses[box][i]);
			}
		}
	}
	return fileHex;
}
export default reverseParseBoxes;
