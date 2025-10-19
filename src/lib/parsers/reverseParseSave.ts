import { hex2buf } from '$lib/utils';
import type { Mon, Box, BagSlot, Player } from '../types.d.ts';
import reverseParseBoxes from './boxes/reverse/reverseParseBoxes.js';

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
	fileHex = reverseParseBoxes(fileHex, boxes, PF);

	return hex2buf(fileHex);
}
export default reverseParseSave;
