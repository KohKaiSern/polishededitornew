import { writeJSON } from './utils';
import abilities from './abilities';
import apricorns from './apricorns';
import boxThemes from './boxThemes';
import charmap from './charmap';
import items from './items';
import moves from './moves';
import addresses from './addresses';

for (const [name, obj] of Object.entries({
  addresses,
  apricorns,
  boxThemes,
  charmap,
  items,
  moves,
  abilities
})) {
  writeJSON(name, obj);
}
