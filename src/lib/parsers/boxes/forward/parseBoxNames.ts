import addresses from '$data/addresses.json';
import { readString } from '$lib/utils';

function parseBoxNames(fileHex: string[]): string[] {
	const names: string[] = [];
	for (let box = 0; box < 20; box++) {
		const address = addresses.sBackupNewBox1 + 33 * box + 23;
		names.push(readString(fileHex, address, 9, false));
	}
	return names;
}
export default parseBoxNames;
