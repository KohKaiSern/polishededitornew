import { splitRead, reduce } from './utils';

function extractCoefficients(COEFFICIENTS: string[]): Record<string, number[]> {
	const coefficients: Record<string, number[]> = {};
	for (let lineNo = 0; lineNo < COEFFICIENTS.length; lineNo++) {
		if (!COEFFICIENTS[lineNo].startsWith('growth_rate')) continue;
		coefficients[reduce(COEFFICIENTS[lineNo].split(';').at(1)!)] = COEFFICIENTS[lineNo]
			.match(/\d+/g)!
			.map((x) => parseInt(x));
	}
	return coefficients;
}

const COEFFICIENTS = splitRead('data/growth_rates.asm');

const growthRateCoefficients = {
	polished: extractCoefficients(COEFFICIENTS.polished),
	faithful: extractCoefficients(COEFFICIENTS.faithful)
};
export default growthRateCoefficients;
