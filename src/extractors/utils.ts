import { readFileSync, writeFileSync } from 'fs';
import sharp from 'sharp';

//Parses a file and splits it into two files - one containing the Polished data
//and the other containing the Faithful data. It also performs some string replacements,
//and removes comments and empty lines.
export function splitRead(path: string): { polished: string[]; faithful: string[] } {
	const files: { polished: string[]; faithful: string[] } = { polished: [], faithful: [] };
	const contents = readFileSync(import.meta.dirname + '/../../polishedcrystal/' + path, 'utf-8')
		.split('\n')
		.map((line) =>
			line
				.replaceAll('#', 'Poké')
				.replaceAll('Poke', 'Poké')
				.replaceAll('@', '')
				.replaceAll('¯', ' ')
				.replaceAll('PSYCHIC_M', 'PSYCHIC')
				.split(';')
				.at(0)!
				.trim()
		)
		.filter((line) => line != '');
	for (let lineNo = 0; lineNo < contents.length; lineNo++) {
		//Check for PF split
		if (/if !?DEF\(FAITHFUL\)/.test(contents[lineNo])) {
			const PF = contents[lineNo].includes('!') ? 'polished' : 'faithful';
			lineNo++;
			while (!/else|endc/.test(contents[lineNo])) {
				files[PF].push(contents[lineNo]);
				lineNo++;
			}
			if (contents[lineNo] === 'else') {
				lineNo++;
				while (contents[lineNo] != 'endc') {
					files[PF === 'polished' ? 'faithful' : 'polished'].push(contents[lineNo]);
					lineNo++;
				}
			}
			continue;
		}
		files.polished.push(contents[lineNo]);
		files.faithful.push(contents[lineNo]);
	}
	return files;
}

export function writeJSON(name: string, obj: object): void {
	writeFileSync(import.meta.dirname + '/../data/' + name + '.json', JSON.stringify(obj, null, 2));
}

//Applies a palette to a 2-bit-per-pixel PNG.
export async function applyPalette(
	inputPath: string,
	outputPath: string,
	color1: number[],
	color2: number[]
): Promise<void> {
	const data = await sharp(import.meta.dirname + '/../../polishedcrystal/' + inputPath)
		.greyscale()
		.raw()
		.toBuffer();
	const metadata = await sharp(
		import.meta.dirname + '/../../polishedcrystal/' + inputPath
	).metadata();
	const levels = Array.from(new Set(data)).sort((a, b) => a - b);
	const palette = [[0, 0, 0], color2.map((c) => c * 8), color1.map((c) => c * 8), [255, 255, 255]];
	const RGBData = Buffer.alloc(data.length * 3);
	for (let i = 0; i < data.length; i++) {
		const [r, g, b] = palette[levels.indexOf(data[i])];
		RGBData[i * 3] = r;
		RGBData[i * 3 + 1] = g;
		RGBData[i * 3 + 2] = b;
	}
	sharp(RGBData, {
		raw: { width: metadata.width!, height: metadata.height!, channels: 3 }
	})
		.png()
		.toFile(import.meta.dirname + '/../' + outputPath);
}
