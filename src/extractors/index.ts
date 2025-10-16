import { writeJSON } from './utils';
import addresses from './addresses';
import locations from './locations';
import abilities from './abilities';
import items from './items';
import keyItems from './keyItems';
import moves from './moves';
import growthRateCoefficients from './growthRateCoefficients';
import versions from './versions';
import badges from './badges';
import charmap from './charmap';
import pokemon from './pokemon';

for (const [name, obj] of Object.entries({
	addresses,
	locations,
	abilities,
	items,
	keyItems,
	moves,
	growthRateCoefficients,
	versions,
	badges,
	charmap,
	pokemon
})) {
	writeJSON(name, obj);
}
