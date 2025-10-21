import { buf2hex } from '$lib/utils';
import type { BagSlot, Box, PartyMon, Player } from '$lib/types';
import parseBag from './bag/forward/parseBag';
import parseBoxes from './boxes/forward/parseBoxes';
import parseParty from './party/forward/parseParty';

async function parseSave(
	file: File,
	PF: 'polished' | 'faithful'
): Promise<[PartyMon[], Box[], Record<string, BagSlot>, Player]> {
	const fileHex = await buf2hex(file);
	const party: PartyMon[] = parseParty(fileHex, PF);
	const boxes: Box[] = parseBoxes(fileHex, PF);
	const bag: Record<string, BagSlot> = parseBag(fileHex, PF);
	return [party, boxes, bag, { name: '', money: -1, gender: '', palette: '', badges: [] }];
}

export default parseSave;
