import type { Base } from './types';
import { applyPalette } from './utils';

//This file contains common extractors for similar file formats.

export function extractIDs<T extends Base>(
  data: T[],
  IDS: string[],
  empty: T,
  start?: string,
  end?: string
): T[] {
  let lineNo = 0;
  if (start) while (!IDS[lineNo].includes(start)) lineNo++;
  //Find starting index
  while (!IDS[lineNo].includes('const_def')) lineNo++;
  const match = IDS[lineNo].match(/const_def (\d+)/);
  let index = match ? parseInt(match[1]) : 0;
  lineNo++;
  for (; lineNo < IDS.length; lineNo++) {
    if (end) if (IDS[lineNo].includes(end)) break;
    if (IDS[lineNo].startsWith('const')) {
      data.push({
        ...empty,
        id: IDS[lineNo].startsWith('const_skip') ? null : IDS[lineNo].match(/[A-Z_\d]+/)!.at(0)!,
        index
      });
      index++;
    }
  }
  return data;
}

export function extractNames<T extends Base & { name: string }>(
  data: T[],
  NAMES: string[],
  initial: number,
  start?: string,
  end?: string
): T[] {
  let lineNo = 0;
  if (start) while (!NAMES[lineNo].includes(start)) lineNo++;
  let index = initial;
  for (; lineNo < NAMES.length; lineNo++) {
    if (end) if (NAMES[lineNo].includes(end)) break;
    if (!NAMES[lineNo].includes('"')) continue;
    const entry = data.find((i) => i.index === index);
    if (entry) {
      entry.name = NAMES[lineNo].split('"').at(1)!;
    }
    index++;
  }
  return data;
}

export function extractDescs<T extends Base & { description: string }>(
  data: T[],
  DESCS: string[],
  initial: number,
  start?: string,
  end?: string
): T[] {
  let lineNo = 0;
  if (start) while (!DESCS[lineNo].includes(start)) lineNo++;
  let index = initial;
  for (; lineNo < DESCS.length; lineNo++) {
    if (end) if (DESCS[lineNo].includes(end)) break;
    if (!DESCS[lineNo].startsWith('dw')) continue;
    const pointer = DESCS[lineNo].slice(3) + ':';
    let descIndex = DESCS.findIndex((l) => l.includes(pointer))!;
    while (!DESCS[descIndex].includes('"')) descIndex++;
    let description = '';
    while (DESCS[descIndex].includes('"')) {
      description += DESCS[descIndex].split('"').at(1)!;
      if (description.at(-1)! === '-') {
        description = description.slice(0, -1);
      } else {
        description += ' ';
      }
      descIndex++;
    }
    const entry = data.find((i) => i.index === index);
    if (entry) {
      entry.description = description.slice(0, -1);
    }
    index++;
  }
  return data;
}

export function extractPaths<T extends Base & { spritePath: string }>(
  data: T[],
  PTRS: string[],
  PATHS: string[],
  initial: number,
  start?: string,
  end?: string
): T[] {
  let lineNo = 0;
  let index = initial;
  if (start) while (!PTRS[lineNo].includes(start)) lineNo++;
  for (; lineNo < PTRS.length; lineNo++) {
    if (end) if (PTRS[lineNo].includes(end)) break;
    if (!PTRS[lineNo].startsWith('dba')) continue;
    const pointer = PTRS[lineNo].slice(4) + '::';
    let pathIndex = PATHS.findIndex((line) => line.includes(pointer));
    while (!PATHS[pathIndex].includes('"')) pathIndex++;
    const spritePath = PATHS[pathIndex].split('"').at(1)!.replace('2bpp.lz', 'png');
    const entry = data.find((i) => i.index === index);
    if (entry) {
      entry.spritePath = spritePath;
    }
    index++;
  }
  return data;
}

export function extractPNGs<T extends Base & { spritePath: string }>(
  data: T[],
  PALS: string[],
  initial: number,
  start?: string,
  end?: string
): T[] {
  let lineNo = 0;
  let index = initial;
  if (start) while (!PALS[lineNo].includes(start)) lineNo++;
  for (; lineNo < PALS.length; lineNo++) {
    if (end) if (PALS[lineNo].includes(end)) break;
    if (!PALS[lineNo].startsWith('RGB')) continue;
    const color1 = PALS[lineNo].match(/\d+/g)!.slice(0, 3).map(Number);
    const color2 = PALS[lineNo + 1].match(/\d+/g)!.slice(0, 3).map(Number);
    const entry = data.find((i) => i.index === index)!;
    applyPalette(entry.spritePath, `gfx/items/${entry.id}.png`, color1, color2);
    entry.spritePath = `gfx/items/${entry.id}.png`;
    lineNo++;
    index++;
  }
  return data;
}
