import type { Mon, BagSlot, Player } from '$lib/types';

function parseSave(file: File): [Mon[][], Record<string, BagSlot>, Player] {
	return [[], {}, { name: '', money: -1, gender: '', palette: '', badges: [] }];
}

export default parseSave;
