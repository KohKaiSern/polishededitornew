import addresses from '$data/addresses.json';

function parseBoxAddresses(fileHex: string[]): number[][] {
	const indexes = parseIndexes(fileHex);
	const flags = parseFlags(fileHex);
	const mons = Array(20)
		.fill(null)
		.map(() => Array(20).fill(null));
	for (let box = 0; box < 20; box++) {
		for (let i = 0; i < 20; i++) {
			if (indexes[box][i] === -1) continue;
			const block =
				(flags[box][i] === '0' ? '1' : '2') +
				(indexes[box][i] < 167 ? 'A' : indexes[box][i] < 195 ? 'B' : 'C');
			let address: number = addresses[`sBoxMons${block}` as keyof typeof addresses];
			if (block[1] === 'A') {
				address += indexes[box][i] * 49;
			} else if (block[1] === 'B') {
				address += (indexes[box][i] - 167) * 49;
			} else {
				address += (indexes[box][i] - 195) * 49;
			}
			mons[box][i] = address;
		}
	}
	return mons;
}
export default parseBoxAddresses;

function parseIndexes(fileHex: string[]): number[][] {
	const indexes = Array(20)
		.fill(null)
		.map(() => Array(20).fill(-1));
	for (let box = 0; box < 20; box++) {
		for (let i = 0; i < 20; i++) {
			indexes[box][i] = parseInt(fileHex[addresses.sBackupNewBox1 + (33 * box + i)], 16) - 1;
		}
	}
	return indexes;
}

function parseFlags(fileHex: string[]): string[][] {
	const flags = Array(20)
		.fill(null)
		.map((): string[] => Array(20).fill(''));
	for (let box = 0; box < 20; box++) {
		//Grab the three relevant bytes
		const flagString = parseInt(
			fileHex[addresses.sBackupNewBox1 + 33 * box + 20] +
				fileHex[addresses.sBackupNewBox1 + 33 * box + 21] +
				fileHex[addresses.sBackupNewBox1 + 33 * box + 22],
			16
		)
			.toString(2)
			.padStart(24, '0');
		//Get flag bit
		for (let i = 0; i < 20; i++) {
			flags[box][i] = flagString[Math.floor(i / 8) * 16 + 7 - i];
		}
	}
	return flags;
}
