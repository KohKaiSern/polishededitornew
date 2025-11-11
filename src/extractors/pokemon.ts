import { readFileSync, readdirSync, mkdirSync } from 'fs';
import { extractNames } from './common';
import { applyPalette, splitRead, createGIF } from './utils';
import type { MonList, Mon, Ability, Move, GrowthRate, Species, FormMap } from './types';
import abilities from './abilities';
import growthRates from './growthRates';
import moves from './moves';

function extractIDs(mons: MonList, IDS: string[], empty: Mon): MonList {
  let lineNo = 0;
  while (!IDS[lineNo].includes('const_def')) lineNo++;
  let index = parseInt(IDS[lineNo].match(/\d+/)!.at(0)!);
  for (; lineNo < IDS.length; lineNo++) {
    if (IDS[lineNo].startsWith('DEF NUM_SPECIES')) {
      mons.constants.num_species = index - 1;
    }
    if (IDS[lineNo].startsWith('DEF NUM_COSMETIC_FORMS')) {
      mons.constants.num_cosmetics = index - mons.constants.num_species - 1;
    }
    if (/const(_skip)?(?!_)/.test(IDS[lineNo])) {
      mons.contents.push({
        ...structuredClone(empty),
        id: IDS[lineNo].startsWith('const_skip')
          ? null
          : IDS[lineNo].match(/[A-Z][A-Z_\d]+/)!.at(0)!,
        index
      });
      index++;
    }
  }
  return mons;
}

function extractBases(
  mons: MonList,
  BASE_PTRS: string[],
  BASES: { filename: string; contents: string[] }[],
  abilities: Ability[],
  moves: Move[],
  growthRates: GrowthRate[]
): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < BASE_PTRS.length; lineNo++) {
    if (!BASE_PTRS[lineNo].startsWith('INCLUDE')) continue;
    const path = BASE_PTRS[lineNo].split('/').at(-1)!.slice(0, -1);
    const BASE = BASES.find((b) => b.filename === path)!.contents;
    const mon = mons.contents.find((m) => m.index === index)!;
    mon.bsts = BASE[0].match(/\d+/g)!.map(Number);
    mon.types = Array.from(new Set(BASE[1].match(/[A-Z_]+/g)!));
    mon.hasGender = BASE[5].includes('UNKNOWN');
    mon.abilities = BASE[6]
      .match(/[A-Z][A-Z_\d]+/g)!
      .slice(1)
      .map((ability) => abilities.find((a) => a.id === ability)!.name);
    mon.growthCFs = growthRates.find((g) => g.id === BASE[7].slice(3))!.coefficients;
    if (BASE[10] != 'tmhm') {
      mon.learnsets.tmhm = BASE[10]
        .match(/[A-Z_\d]+/g)!
        .map((move) => ({ name: moves.find((m) => m.id === move)!.name }));
    }
    index++;
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics;
    }
  }
  return mons;
}

function extractLvlMoves(
  mons: MonList,
  LVL_PTRS: string[],
  LVL_MOVES: string[],
  moves: Move[]
): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < LVL_PTRS.length; lineNo++) {
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics;
    }
    if (!LVL_PTRS[lineNo].startsWith('dw')) continue;
    const pointer = LVL_PTRS[lineNo].slice(3).replace('EvosAttacks', '');
    let learnsetIndex = LVL_MOVES.findIndex((line) => line === `evos_attacks ${pointer}`);
    if (learnsetIndex === -1) {
      learnsetIndex = LVL_MOVES.findIndex((line) => line.includes(`${pointer}EvosAttacks:`));
    }
    const mon = mons.contents.find((m) => m.index === index)!;
    while (!/^(learnset|db)/.test(LVL_MOVES[learnsetIndex])) learnsetIndex++;
    while (LVL_MOVES[learnsetIndex].startsWith('learnset')) {
      mon.learnsets.level.push({
        name: moves.find((m) => m.id === LVL_MOVES[learnsetIndex].match(/[A-Z][A-Z_\d]+/)!.at(0)!)!
          .name,
        level: parseInt(LVL_MOVES[learnsetIndex].match(/\d+/)!.at(0)!)
      });
      learnsetIndex++;
    }
    index++;
  }
  return mons;
}

function extractEggMoves(
  mons: MonList,
  EGG_PTRS: string[],
  EGG_MOVES: string[],
  moves: Move[]
): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < EGG_PTRS.length; lineNo++) {
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics;
    }
    if (!EGG_PTRS[lineNo].startsWith('dw')) continue;
    const pointer = EGG_PTRS[lineNo].slice(3) + ':';
    let learnsetIndex = EGG_MOVES.findIndex((line) => line === pointer)!;
    const mon = mons.contents.find((m) => m.index === index)!;
    while (!EGG_MOVES[learnsetIndex].startsWith('db')) learnsetIndex++;
    while (EGG_MOVES[learnsetIndex].startsWith('db')) {
      if (EGG_MOVES[learnsetIndex].includes('$ff')) break;
      mon.learnsets.egg.push({
        name: moves.find((m) => m.id === EGG_MOVES[learnsetIndex].slice(3))!.name
      });
      learnsetIndex++;
    }
    index++;
  }
  return mons;
}

function extractEvoMoves(mons: MonList, EVO_MOVES: string[], moves: Move[]): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < EVO_MOVES.length; lineNo++) {
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics;
    }
    if (!EVO_MOVES[lineNo].startsWith('db')) continue;
    const move = EVO_MOVES[lineNo].slice(3);
    if (move != 'NO_MOVE') {
      const mon = mons.contents.find((m) => m.index === index)!;
      mon.learnsets.evo.push({
        name: moves.find((m) => m.id === move)!.name
      });
    }
    index++;
  }
  return mons;
}

function extractSpritePaths(mons: MonList, PNG_PTRS: string[], PNG_PATHS: string[]): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < PNG_PTRS.length; lineNo++) {
    let pointer = '';
    if (PNG_PTRS[lineNo].startsWith('pics')) {
      pointer = PNG_PTRS[lineNo].slice(5) + 'Frontpic:';
    } else if (PNG_PTRS[lineNo].startsWith('dbas')) {
      pointer = PNG_PTRS[lineNo].split(',').at(0)!.slice(5) + ':';
    } else continue;
    const mon = mons.contents.find((m) => m.index === index)!;
    mon.paths.sprite = PNG_PATHS.find((line) => line.includes(pointer))!
      .split('"')
      .at(1)!
      .replace('front.animated.2bpp.lz', '');
    index++;
  }
  return mons;
}

function extractPalPaths(mons: MonList, PAL_PATHS: string[]): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < PAL_PATHS.length; lineNo++) {
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics;
    }
    if (!PAL_PATHS[lineNo].startsWith('INCLUDE')) continue;
    const mon = mons.contents.find((m) => m.index === index)!;
    mon.paths.palette = PAL_PATHS[lineNo].split('"').at(1)!.replace('normal.pal', '');
    lineNo++;
    index++;
  }
  return mons;
}

function extractAnimPaths(mons: MonList, ANIM_PTRS: string[], ANIM_PATHS: string[]): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < ANIM_PTRS.length; lineNo++) {
    if (!ANIM_PTRS[lineNo].startsWith('dw')) continue;
    const pointer = ANIM_PTRS[lineNo].slice(3);
    const mon = mons.contents.find((m) => m.index === index)!;
    let animIndex = ANIM_PATHS.findIndex((line) => line.includes(pointer))!;
    while (!ANIM_PATHS[animIndex].includes('"')) animIndex++;
    mon.paths.anim = ANIM_PATHS[animIndex].split('"').at(1)!.replace('anim.asm', '');
    index++;
  }
  return mons;
}

function extractForms(
  mons: MonList,
  forms: Record<string, FormMap[]>,
  IDS: string[],
  FORMS: string[]
): Record<string, FormMap[]> {
  const formNums: Record<string, number> = {};
  let num_magikarp = -1;
  let index = -1;
  for (let lineNo = 0; lineNo < IDS.length; lineNo++) {
    if (IDS[lineNo].includes('DEF NUM_MAGIKARP')) num_magikarp = index;
    if (IDS[lineNo].match(/DEF .+_FORM EQU \d+/)) {
      formNums[IDS[lineNo].match(/DEF (.+_FORM)/)!.at(1)!] = parseInt(
        IDS[lineNo].match(/\d+/)!.at(0)!
      );
      continue;
    }
    if (IDS[lineNo].startsWith('ext_const_def')) {
      index = parseInt(IDS[lineNo].match(/\d+/)!.at(0)!);
      if (IDS[lineNo].includes('NUM_MAGIKARP')) index = num_magikarp;
      if (!IDS[lineNo].includes(',')) lineNo++;
      do {
        formNums[IDS[lineNo].match(/[A-Z][A-Z_\d]+/)!.at(0)!] = index;
        index++;
        lineNo++;
      } while (IDS[lineNo].startsWith('ext_const '));
      lineNo--;
    }
  }
  index = mons.constants.num_species + 1;
  for (let lineNo = 0; lineNo < FORMS.length; lineNo++) {
    if (!FORMS[lineNo].startsWith('dp')) continue;
    const match = FORMS[lineNo].match(/[A-Z][A-Z_\d]+/g)!;
    const form = mons.contents.find((m) => m.index === index)!;
    forms[match.at(0)!] ??= [];
    forms[match.at(0)!].push({
      id: match.at(1)!,
      index: form.index,
      formNo: formNums[match.at(1)!]
    });
    index++;
  }
  for (const [form, formNo] of Object.entries(formNums)) {
    if (formNo === 1 && form != 'PLAIN_FORM') {
      forms[form.split('_').at(0)!].push({
        id: form,
        index: mons.contents.find((m) => m.id === form.split('_').at(0)!)!.index,
        formNo
      });
    }
  }
  return forms;
}

function extractPNGs(mons: MonList, forms: Record<string, FormMap[]>): void {
  for (const mon of mons.contents) {
    try {
      mkdirSync(import.meta.dirname + `/../${mon.paths.sprite}`);
    } catch { }
    if (mon.paths.palette === '') {
      //Cosmetic form: uses species palette
      const species = Object.entries(forms)
        .find(([, f]) => f.find((form) => form.id === mon.id)!)!
        .at(0)!;
      mon.paths.palette = mons.contents.find((m) => m.id === species)!.paths.palette;
    }
    const NORMAL_PAL = readFileSync(
      import.meta.dirname + `/../../polishedcrystal/${mon.paths.palette}/normal.pal`,
      'utf-8'
    )
      .split('\n')
      .filter((line) => line.includes('RGB'))
      .map((line) => line.match(/\d+/g)!.map(Number));
    const SHINY_PAL = readFileSync(
      import.meta.dirname + `/../../polishedcrystal/${mon.paths.palette}/shiny.pal`,
      'utf-8'
    )
      .split('\n')
      .filter((line) => line.includes('RGB'))
      .map((line) => line.match(/\d+/g)!.map(Number));
    applyPalette(
      `${mon.paths.sprite}front.png`,
      `${mon.paths.sprite}normal.png`,
      NORMAL_PAL[0],
      NORMAL_PAL[1]
    );
    applyPalette(
      `${mon.paths.sprite}front.png`,
      `${mon.paths.sprite}shiny.png`,
      SHINY_PAL[0],
      SHINY_PAL[1]
    );
  }
  return;
}

function extractGIFs(mons: MonList): void {
  for (const mon of mons.contents) {
    createGIF(
      mon.paths.sprite + 'normal.png',
      mon.paths.anim + 'anim.asm',
      mon.paths.sprite + 'normal.gif'
    );
    createGIF(
      mon.paths.sprite + 'shiny.png',
      mon.paths.anim + 'anim.asm',
      mon.paths.sprite + 'shiny.gif'
    );
  }
}

function extractPokemon(
  pokemon: Species[],
  mons: MonList,
  forms: Record<string, FormMap[]>
): Species[] {
  for (const mon of mons.contents) {
    if (mon.index <= mons.constants.num_species) {
      pokemon.push({
        id: mon.id,
        index: mon.index,
        name: mon.name,
        forms: []
      });
    }
  }
  for (const mon of pokemon) {
    if (mon.id)
      if (mon.id in forms) {
        for (const form of forms[mon.id]) {
          const result = mons.contents.find((m) => m.index === form.index)!;
          result.id = form.id;
          const capitalize = (str: string): string => {
            str = str.at(0)! + str.slice(1).toLowerCase();
            for (let i = 0; i < str.length; i++) {
              if (str[i] === '-') {
                str = str.slice(0, i + 1) + str.at(i + 1)!.toUpperCase() + str.slice(i + 2);
              }
            }
            return str;
          };
          result.name = capitalize(
            form
              .id!.replace('_FORM', '')
              .replace(mon.id + '_', '')
              .replace('_', '-')
          );
          result.index = form.formNo;
          mon.forms.push(result);
        }
      }
  }
  for (const mon of pokemon) {
    if (!mon.forms.find((form) => form.index === 1)) {
      const result = mons.contents.find((m) => m.index === mon.index)!;
      result.name = 'Plain';
      result.index = 1;
      mon.forms.push(result);
    }
  }
  for (const mon of pokemon) {
    for (const form of mon.forms) {
      if (form.bsts.length === 0) {
        const defForm = mon.forms.find((f) => f.index === 1)!;
        form.bsts = defForm.bsts;
        form.types = defForm.types;
        form.hasGender = defForm.hasGender;
        form.abilities = defForm.abilities;
        form.growthCFs = defForm.growthCFs;
        form.learnsets = defForm.learnsets;
      }
    }
  }
  return pokemon;
}

const IDS = splitRead('constants/pokemon_constants.asm');
const NAMES = splitRead('data/pokemon/names.asm');
const BASE_PTRS = splitRead('data/pokemon/base_stats.asm');
const BASES: {
  polished: { filename: string; contents: string[] }[];
  faithful: { filename: string; contents: string[] }[];
} = {
  polished: [],
  faithful: []
};
for (const filename of readdirSync(
  import.meta.dirname + '/../../polishedcrystal/data/pokemon/base_stats/'
)) {
  const BASE = splitRead('data/pokemon/base_stats/' + filename);
  for (const PF of ['polished', 'faithful'] as const) {
    BASES[PF].push({
      filename,
      contents: BASE[PF]
    });
  }
}
const LVL_PTRS = splitRead('data/pokemon/evos_attacks_pointers.asm');
const LVL_MOVES = splitRead('data/pokemon/evos_attacks.asm');
const EGG_PTRS = splitRead('data/pokemon/egg_move_pointers.asm');
const EGG_MOVES = splitRead('data/pokemon/egg_moves.asm');
const EVO_MOVES = splitRead('data/pokemon/evolution_moves.asm');
const PNG_PTRS = splitRead('data/pokemon/pic_pointers.asm');
const PNG_PATHS = splitRead('gfx/pokemon.asm');
const PAL_PATHS = splitRead('data/pokemon/palettes.asm');
const ANIM_PTRS = splitRead('gfx/pokemon/anim_pointers.asm');
const ANIM_PATHS = splitRead('gfx/pokemon/anims.asm');
const FORMS = splitRead('data/pokemon/variant_forms.asm');

const mons: {
  polished: MonList;
  faithful: MonList;
} = {
  polished: { constants: {}, contents: [] },
  faithful: { constants: {}, contents: [] }
};

const NULL_MON: Mon = {
  id: null,
  index: -1,
  name: '',
  bsts: [],
  types: [],
  hasGender: false,
  abilities: [],
  growthCFs: [],
  learnsets: {
    level: [],
    egg: [],
    evo: [],
    tmhm: []
  },
  paths: {
    sprite: '',
    palette: '',
    anim: ''
  }
};

const forms: {
  polished: Record<string, FormMap[]>;
  faithful: Record<string, FormMap[]>;
} = {
  polished: {},
  faithful: {}
};

const pokemon: {
  polished: Species[];
  faithful: Species[];
} = {
  polished: [],
  faithful: []
};

for (const PF of ['polished', 'faithful'] as const) {
  mons[PF] = extractIDs(mons[PF], IDS[PF], NULL_MON);
  mons[PF].contents = extractNames(mons[PF].contents, NAMES[PF], 0);
  mons[PF] = extractBases(
    mons[PF],
    BASE_PTRS[PF],
    BASES[PF],
    abilities[PF],
    moves[PF],
    growthRates[PF]
  );
  mons[PF] = extractLvlMoves(mons[PF], LVL_PTRS[PF], LVL_MOVES[PF], moves[PF]);
  mons[PF] = extractEggMoves(mons[PF], EGG_PTRS[PF], EGG_MOVES[PF], moves[PF]);
  mons[PF] = extractEvoMoves(mons[PF], EVO_MOVES[PF], moves[PF]);
  mons[PF] = extractSpritePaths(mons[PF], PNG_PTRS[PF], PNG_PATHS[PF]);
  mons[PF] = extractPalPaths(mons[PF], PAL_PATHS[PF]);
  mons[PF] = extractAnimPaths(mons[PF], ANIM_PTRS[PF], ANIM_PATHS[PF]);
  forms[PF] = extractForms(mons[PF], forms[PF], IDS[PF], FORMS[PF]);
  extractPNGs(mons[PF], forms[PF]);
  extractGIFs(mons[PF]);
  pokemon[PF] = extractPokemon(pokemon[PF], mons[PF], forms[PF]);
}

export default pokemon;
