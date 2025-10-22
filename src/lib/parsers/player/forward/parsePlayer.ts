import addresses from '$data/addresses.json';
import type { Player } from '$lib/types';

function parsePlayer(fileHex: string[], PF: 'polished' | 'faithful'): Player {
	const baseAddress = addresses.sBackupGameData - addresses.wGameData;

	return { name: '', money: -1, badges: [], gender: '', palette: '' };
}
export default parsePlayer;
