import type { Item } from './types';
import { consolidate, splitRead } from './utils';

function extractNames(NAMES: string[]): Pick<Item, 'itemNo' | 'name'>[] {
	const names: Omit<Item, 'description' | 'category'>[] = [];
	let itemNo = 0;
	for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
		if (!NAMES[lineNo].includes('"')) continue;
		names.push({
			itemNo,
			name: NAMES[lineNo].split('"').at(1)!
		});
		itemNo++;
	}
	return names;
}

function extractCategories(CATEGORIES: string[]): Pick<Item, 'itemNo' | 'category'>[] {
	const attributes: Pick<Item, 'itemNo' | 'category'>[] = [];
	let itemNo = 1;
	for (let lineNo = 0; lineNo < CATEGORIES.length; lineNo++) {
		if (!CATEGORIES[lineNo].startsWith('item_attribute')) continue;
		attributes.push({
			itemNo,
			category: CATEGORIES[lineNo].split(',').at(3)!.slice(1)
		});
		itemNo++;
	}
	return attributes;
}

function extractDescs(DESCS: string[]): Pick<Item, 'itemNo' | 'description'>[] {
	const descriptions: Pick<Item, 'itemNo' | 'description'>[] = [];
	for (let lineNo = 0; lineNo < DESCS.length; lineNo++) {
		if (!DESCS[lineNo].includes('Desc:')) continue;
		//Collect all items with this description.
		const ids = [];
		while (DESCS[lineNo].includes('Desc:')) {
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
				itemNo: DESCS.findIndex((line) => line.includes(id)) - 1,
				description
			});
		}
	}
	return descriptions;
}

const NAMES = splitRead('data/items/names.asm');
const CATEGORIES = splitRead('data/items/attributes.asm');
const DESCS = splitRead('data/items/descriptions.asm');

const items = {
	polished: consolidate<Item>(
		'itemNo',
		extractNames(NAMES.polished),
		extractCategories(CATEGORIES.polished),
		extractDescs(DESCS.polished)
	),
	faithful: consolidate<Item>(
		'itemNo',
		extractNames(NAMES.faithful),
		extractCategories(CATEGORIES.faithful),
		extractDescs(DESCS.faithful)
	)
};
export default items;
