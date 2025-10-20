import type { Ability } from './types';
import { consolidate, reduce, splitRead } from './utils';

function extractNames(NAMES: string[]): Omit<Ability, 'description'>[] {
	const names: Omit<Ability, 'description'>[] = [];
	for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
		if (!NAMES[lineNo].includes('rawchar')) continue;
		names.push({
			id: reduce(NAMES[lineNo].split(':').at(0)!),
			name: NAMES[lineNo].split('"').at(1)!
		});
	}
	return names;
}

function extractDescs(DESCS: string[]): Omit<Ability, 'name'>[] {
	const descriptions: Omit<Ability, 'name'>[] = [];
	for (let lineNo = 0; lineNo < DESCS.length; lineNo++) {
		if (!DESCS[lineNo].includes('Description:')) continue;
		//Collect all abilities with this description.
		const ids = [];
		while (DESCS[lineNo].includes('Description:')) {
			ids.push(reduce(DESCS[lineNo].replace('Description:', '')));
			lineNo++;
		}
		//Then read the description.
		let description = '';
		while (DESCS[lineNo].includes('"')) {
			description += DESCS[lineNo].split('"').at(1)!;
			//Deal with hyphens
			description = description.at(-1) === '-' ? description.slice(0, -1) : description + ' ';
			lineNo++;
		}
		//Remove the extra space at the end
		description = description.slice(0, -1);

		for (const id of ids) {
			descriptions.push({
				id,
				description
			});
		}
	}
	return descriptions;
}

const NAMES = splitRead('data/abilities/names.asm');
const DESCS = splitRead('data/abilities/descriptions.asm');

const abilities = {
	polished: consolidate<Ability>('id', extractNames(NAMES.polished), extractDescs(DESCS.polished)),
	faithful: consolidate<Ability>('id', extractNames(NAMES.faithful), extractDescs(DESCS.faithful))
};
export default abilities;
