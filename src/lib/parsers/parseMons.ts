import parseAddresses from './parseAddresses';
import type { Mon } from '$lib/types';

function parseMons(fileHex: string[], PF: 'polished' | 'faithful'): Mon[][] {
	const addresses = parseAddresses(fileHex);
	return [[]];
}
export default parseMons;
