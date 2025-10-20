import { buf2hex, hex2buf } from '$lib/utils';
import type { BagSlot, Box, PartyMon, Player } from '../types.d.ts';
import reverseParseBoxes from './boxes/reverse/reverseParseBoxes.js';

async function reverseParseSave(
	file: File,
	party: PartyMon[],
	boxes: Box[],
	bag: Record<string, BagSlot>,
	player: Player,
	PF: 'polished' | 'faithful'
): Promise<ArrayBuffer> {
	let fileHex = await buf2hex(file);
	fileHex = reverseParseBoxes(fileHex, boxes, PF);

	return hex2buf(fileHex);
}
export default reverseParseSave;
