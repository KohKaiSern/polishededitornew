import type { Move } from './types';
import { consolidate, reduce, splitRead } from './utils';

function extractNames(NAMES: string[]): Pick<Move, 'id' | 'name' | 'moveNo'>[] {
	const names: Pick<Move, 'id' | 'name' | 'moveNo'>[] = [];
	let moveNo = 1;
	for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
		if (!NAMES[lineNo].includes('"')) continue;
		names.push({
			id: reduce(NAMES[lineNo].split('"').at(1)!),
			name: NAMES[lineNo].split('"').at(1)!,
			moveNo
		});
		moveNo++;
	}
	return names;
}

function extractAttrs(ATTRS: string[]): Omit<Move, 'name' | 'id' | 'description'>[] {
	const attributes: Omit<Move, 'name' | 'id' | 'description'>[] = [];
	let moveNo = 1;
	for (let lineNo = 0; lineNo < ATTRS.length; lineNo++) {
		if (!ATTRS[lineNo].startsWith('move ')) continue;
		attributes.push({
			moveNo,
			basePower: parseInt(ATTRS[lineNo].split(',').at(2)!.trim()),
			type: ATTRS[lineNo].split(',').at(3)!.trim(),
			accuracy: parseInt(ATTRS[lineNo].split(',').at(4)!.trim()),
			powerPoints: parseInt(ATTRS[lineNo].split(',').at(5)!.trim()),
			effectChance: parseInt(ATTRS[lineNo].split(',').at(6)!.trim()),
			category: ATTRS[lineNo].split(',').at(7)!.trim()
		});
		moveNo++;
	}
	return attributes;
}

function extractDescs(DESCS: string[]): Pick<Move, 'moveNo' | 'description'>[] {
	const descriptions: Pick<Move, 'moveNo' | 'description'>[] = [];
	for (let lineNo = 0; lineNo < DESCS.length; lineNo++) {
		if (!DESCS[lineNo].includes('Description:')) continue;
		//Collect all items with this description.
		const ids = [];
		while (DESCS[lineNo].includes('Description:')) {
			ids.push(DESCS[lineNo].slice(0, -1));
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
				moveNo: DESCS.findIndex((line) => line.slice(3).startsWith(id)) - 2,
				description
			});
		}
	}
	return descriptions;
}

const NAMES = splitRead('data/moves/names.asm');
const ATTRS = splitRead('data/moves/moves.asm');
const DESCS = splitRead('data/moves/descriptions.asm');

const moves = {
	polished: consolidate<Move>(
		'moveNo',
		extractNames(NAMES.polished),
		extractAttrs(ATTRS.polished),
		extractDescs(DESCS.polished)
	),
	faithful: consolidate<Move>(
		'moveNo',
		extractNames(NAMES.faithful),
		extractAttrs(ATTRS.faithful),
		extractDescs(DESCS.faithful)
	)
};
export default moves;
