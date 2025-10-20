import addresses from '$data/addresses.json';
import boxThemes from '$data/boxThemes.json';

function parseBoxThemes(fileHex: string[]): string[] {
	const themes: string[] = [];
	for (let box = 0; box < 20; box++) {
		themes.push(boxThemes[parseInt(fileHex[addresses.sBackupNewBox1 + 33 * box + 32], 16)]);
	}
	return themes;
}
export default parseBoxThemes;
