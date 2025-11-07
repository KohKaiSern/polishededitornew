import { extractIDs } from './common';
import { splitRead } from './utils';
import type { GrowthRate } from './types';

function extractCFs(growthRates: GrowthRate[], CFS: string[]): GrowthRate[] {
	let index = 0;
	for (let lineNo = 0; lineNo < CFS.length; lineNo++) {
		if (!CFS[lineNo].startsWith('growth_rate')) continue;
		growthRates.find((g) => g.index === index)!.coefficients = CFS[lineNo]
			.match(/-?\d+/g)!
			.slice(0, 5)
			.map(Number);
		index++;
	}
	return growthRates;
}

const IDS = splitRead('constants/pokemon_data_constants.asm');
const CFS = splitRead('data/growth_rates.asm');

const growthRates: {
	polished: GrowthRate[];
	faithful: GrowthRate[];
} = {
	polished: [],
	faithful: []
};

const NULL_GROWTHRATE: GrowthRate = {
	id: null,
	index: -1,
	coefficients: []
};

for (const PF of ['polished', 'faithful'] as const) {
	growthRates[PF] = extractIDs(
		growthRates[PF],
		IDS[PF],
		NULL_GROWTHRATE,
		'NUM_HATCH_RATES',
		'NUM_GROWTH_RATES'
	);
	growthRates[PF] = extractCFs(growthRates[PF], CFS[PF]);
}

export default growthRates;
