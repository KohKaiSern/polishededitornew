import abilities from './abilities';
import addresses from './addresses';
import apricorns from './apricorns';
import boxThemes from './boxThemes';
import charmap from './charmap';
import expCandy from './expCandy';
import growthRates from './growthRates';
import items from './items';
import keyItems from './keyItems';
import locations from './locations';
import moves from './moves';
import pokemon from './pokemon';
import tmhm from './tmhm';
import { writeJSON } from './utils';
import versions from './versions';
import wings from './wings';

for (const [name, obj] of Object.entries({
  addresses,
  locations,
  abilities,
  items,
  keyItems,
  moves,
  boxThemes,
  growthRates,
  versions,
  charmap,
  wings,
  expCandy,
  pokemon,
  apricorns,
  tmhm
})) {
  writeJSON(name, obj);
}
