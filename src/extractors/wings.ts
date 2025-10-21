import { splitRead } from './utils';

function extractNames(NAMES: string[]): string[] {
	const names: string[] = [];
	for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
		if (!NAMES[lineNo].includes('"')) continue;
		names.push(NAMES[lineNo].split('"').at(1)!);
	}
	return names;
}

const NAMES = splitRead('data/items/wing_names.asm');

const wings = {
	polished: extractNames(NAMES.polished),
	faithful: extractNames(NAMES.faithful)
};
export default wings;
