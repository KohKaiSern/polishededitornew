import { writeJSON } from './utils';
import items from './items';
import moves from './moves';
import abilities from './abilities';

for (const [name, obj] of Object.entries({
  items,
  moves,
  abilities
})) {
  writeJSON(name, obj);
}
