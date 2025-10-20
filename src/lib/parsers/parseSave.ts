import { buf2hex } from '$lib/utils';
import type { BagSlot, Box, Mon, Player } from '$lib/types';
import parseBoxes from './boxes/forward/parseBoxes';

async function parseSave(
	file: File,
	PF: 'polished' | 'faithful'
): Promise<[Mon[], Box[], Record<string, BagSlot>, Player]> {
	const fileHex = await buf2hex(file);
	const boxes: Box[] = parseBoxes(fileHex, PF);
	return [[], boxes, {}, { name: '', money: -1, gender: '', palette: '', badges: [] }];
}

export default parseSave;
