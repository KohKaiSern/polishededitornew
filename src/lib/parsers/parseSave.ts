import type { Mon, BagSlot, Player } from '$lib/types';
import { buf2hex } from '$lib/utils';
import parseMons from './parseMons';

async function parseSave(
	file: File,
	PF: 'polished' | 'faithful'
): Promise<[Mon[][], Record<string, BagSlot>, Player]> {
	const fileHex = await buf2hex(file);
	const mons: Mon[][] = parseMons(fileHex, PF);
	return [mons, {}, { name: '', money: -1, gender: '', palette: '', badges: [] }];
}

export default parseSave;
