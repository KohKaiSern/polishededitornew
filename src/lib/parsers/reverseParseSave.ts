import { hex2buf } from '$lib/utils';
import type { Mon, Box, BagSlot, Player } from '../types.d.ts';
import reverseParseBoxNames from './reverseParseBoxNames.js';

async function reverseParseSave(
	file: File,
	party: Mon[],
	boxes: Box[],
	bag: Record<string, BagSlot>,
	player: Player
): Promise<ArrayBuffer> {
	let fileHex = Array.from(await file.bytes()).map((x) =>
		x.toString(16).padStart(2, '0').toUpperCase()
	);
	fileHex = reverseParseBoxNames(
		fileHex,
		boxes.map((box) => box.name)
	);

	return hex2buf(fileHex);
}
export default reverseParseSave;
