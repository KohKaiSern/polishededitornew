import { hex2buf } from '$lib/utils';
import type { Mon, Box, BagSlot, Player } from '../types.d.ts';
import reverseParseBoxNames from './boxes/reverse/reverseParseBoxNames.js';
import reverseParseBoxThemes from './boxes/reverse/reverseParseBoxThemes.js';
import reverseParseMon from './boxes/reverse/reverseParseMon.js';
import parseBoxAddresses from './boxes/forward/parseBoxAddresses.js';

async function reverseParseSave(
	file: File,
	party: Mon[],
	boxes: Box[],
	bag: Record<string, BagSlot>,
	player: Player,
	PF: 'polished' | 'faithful'
): Promise<ArrayBuffer> {
	let fileHex = Array.from(await file.bytes()).map((x) =>
		x.toString(16).padStart(2, '0').toUpperCase()
	);
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
	return hex2buf(fileHex);
}
export default reverseParseSave;
