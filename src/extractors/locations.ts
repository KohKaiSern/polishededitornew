import type { Location } from './types';
import { consolidate, reduce, splitRead } from './utils';

function extractNames(NAMES: string[]): Omit<Location, 'locationNo'>[] {
	const names: Omit<Location, 'locationNo'>[] = [];
	for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
		if (!NAMES[lineNo].includes('"')) continue;
		names.push({
			id: reduce(NAMES[lineNo].split(':').at(0)!.replace('Name', '')),
			name: NAMES[lineNo].split('"').at(1)!
		});
	}
	return names;
}

function extractIndexes(INDEXES: string[]): Omit<Location, 'name'>[] {
	const indexes: Omit<Location, 'name'>[] = [];
	for (let lineNo = 0; lineNo < INDEXES.length; lineNo++) {
		if (!INDEXES[lineNo].includes('const ')) continue;
		indexes.push({
			id: reduce(INDEXES[lineNo].split(' ').at(1)!),
			locationNo: parseInt(INDEXES[lineNo].slice(-2), 16)
		});
	}
	return indexes;
}

const NAMES = splitRead('data/maps/landmarks.asm');
const INDEXES = splitRead('constants/landmark_constants.asm');

const locations: { polished: Location[]; faithful: Location[] } = {
	polished: consolidate<Location>(
		'id',
		extractNames(NAMES.polished),
		extractIndexes(INDEXES.polished)
	).sort((a, b) => a.locationNo - b.locationNo),
	faithful: consolidate<Location>(
		'id',
		extractNames(NAMES.faithful),
		extractIndexes(INDEXES.faithful)
	).sort((a, b) => a.locationNo - b.locationNo)
};
export default locations;
