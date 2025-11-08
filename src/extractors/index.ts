import { writeJSON } from './utils';
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
import mons from './pokemon';
import tmhms from './tmhms';
import versions from './versions';
import wings from './wings';

for (const [name, obj] of Object.entries({
  abilities,
  addresses,
  apricorns,
  boxThemes,
  charmap,
  expCandy,
  growthRates,
  items,
  keyItems,
  locations,
  moves,
  mons,
  tmhms,
  versions,
  wings
})) {
  writeJSON(name, obj);
}
