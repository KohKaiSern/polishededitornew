import { readFileSync, writeFileSync } from 'fs';
import type { Move } from './types';

//This function acts as a pre-processor to all the used files.
//Its main job is to split a file into two versions, one with
//the Polished information and one with the Faithful information.
//In addition, it performs some global string replacements and removals.
export function splitRead(path: string): { polished: string[]; faithful: string[] } {
  const files: { polished: string[]; faithful: string[] } = { polished: [], faithful: [] };
  const contents = readFileSync(import.meta.dirname + '/../../polishedcrystal/' + path, 'utf-8')
    .split('\n')
    .map((line) =>
      line
        .replaceAll('#', 'Poké')
        .replaceAll('Poke', 'Poké')
        .replaceAll('@', '')
        .replaceAll('¯', ' ')
        .replaceAll('PSYCHIC_M', 'PSYCHIC')
        .trim()
    );
  for (let lineNo = 0; lineNo < contents.length; lineNo++) {
    //Upon encountering a faithful check,
    if (contents[lineNo].includes('if DEF(FAITHFUL)')) {
      lineNo++;
      //Collect all the faithful data.
      while (contents[lineNo] != 'else') {
        files.faithful.push(contents[lineNo]);
        lineNo++;
      }
      lineNo++;
      //Then, collect all the polished data.
      while (contents[lineNo] != 'endc') {
        files.polished.push(contents[lineNo]);
        lineNo++;
      }
    }
    //Normal lines are added to both arrays.
    else {
      files.polished.push(contents[lineNo]);
      files.faithful.push(contents[lineNo]);
    }
  }
  return files;
}

//This is the function used to produce ids. It works on a principle of
//information destruction. The idea is that there are many ways to reference
//a certain move, item, etc., but by reducing the reference down to its
//basic characters, they will always match.
export function reduce(str: string): string {
  return str
    .toLowerCase()
    .replaceAll(' ', '')
    .replaceAll('_', '')
    .replaceAll('-', '')
    .replaceAll("'", '')
    .replaceAll('.', '')
    .replaceAll('♂', 'm')
    .replaceAll('♀', 'f')
    .replaceAll('é', 'e');
}

//This function combines two different object arrays into one,
//as long as they share the same id (which can be changed). It uses a JavaScript map
//to reduce the time complexity down to linear time, at the cost
//of space complexity.
export function consolidate<T extends Record<string, any>>(
  id: keyof T,
  ...data: Partial<T>[][]
): T[] {
  const map = new Map<T[keyof T], Partial<T>>();
  const keys = new Set<string>();

  for (const fragment of data) {
    for (const obj of fragment) {
      map.set(obj[id] as T[keyof T], { ...map.get(obj[id] as T[keyof T]), ...obj });
      for (const key of Object.keys(obj)) {
        keys.add(key);
      }
    }
  }

  return Array.from(map.values()).filter((obj) => {
    for (const key of keys) {
      if (!obj.hasOwnProperty(key)) return false;
    }
    return true;
  }) as T[];
}

export function capitalize(str: string): string {
  return str.at(0)!.toUpperCase() + str.slice(1).toLowerCase();
}

export function findMove(
  id: string,
  moves: { polished: Move[]; faithful: Move[] },
  PF: 'polished' | 'faithful'
): string {
  let move = moves[PF].find((m) => m.id === id);
  if (!move) {
    return "Brick Break"
  }
  return move.name;
}

export function writeJSON(name: string, obj: object): void {
  writeFileSync(import.meta.dirname + '/../data/' + name + '.json', JSON.stringify(obj));
}
