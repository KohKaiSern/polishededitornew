import addresses from '$data/addresses.json';
import type { Mon } from '$lib/types';

function reverseParseBoxAddresses(fileHex: string[], mons: Mon[][]): string[] {
	let monIndex = 1;
	let flagStr = '';
	for (let box = 0; box < 20; box++) {
		for (let i = 0; i < 20; i++) {
			//Empty Slot
			if (!mons[box][i]) {
				fileHex[addresses.sBackupNewBox1 + (33 * box + i)] === '00';
				flagStr += '0';
				continue;
			}
			fileHex[addresses.sBackupNewBox1 + (33 * box + i)] = (monIndex % 200)
				.toString(16)
				.padStart(2, '0');
			flagStr += Math.floor(monIndex / 200).toString();
			monIndex++;
		}
		fileHex[addresses.sBackupNewBox1 + 33 * box + 20] = flagStr
			.slice(0, 8)
			.split('')
			.reverse()
			.join('');
		fileHex[addresses.sBackupNewBox1 + 33 * box + 21] = flagStr
			.slice(8, 16)
			.split('')
			.reverse()
			.join('');
		fileHex[addresses.sBackupNewBox1 + 33 * box + 22] = flagStr
			.slice(16, 24)
			.split('')
			.reverse()
			.join('');
	}
	return fileHex;
}
export default reverseParseBoxAddresses;
