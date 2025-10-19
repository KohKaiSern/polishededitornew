import addresses from '../../../data/addresses.json';
import { writeString } from '$lib/utils';

function reverseParseBoxNames(fileHex: string[], names: string[]): string[] {
	for (let box = 0; box < 20; box++) {
		const address = addresses.sBackupNewBox1 + 33 * box + 23;
		fileHex = writeString(fileHex, address, 9, names[box], false);
	}
	return fileHex;
}
export default reverseParseBoxNames;
