import { splitRead } from './utils';
import type { MonList, Mon, Ability, Move, GrowthRate, Base } from './types';
import { extractNames } from './common';
import { readdirSync } from 'fs';
import abilities from './abilities';
import growthRates from './growthRates';
import moves from './moves';

function extractIDs(mons: MonList, IDS: string[], empty: Mon): MonList {
  let lineNo = 0;
  while (!IDS[lineNo].includes('const_def')) lineNo++;
  let index = parseInt(IDS[lineNo].match(/\d+/)!.at(0)!)
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
        id: IDS[lineNo].startsWith('const_skip') ? null : IDS[lineNo].match(/[A-Z][A-Z_\d]+/)!.at(0)!,
        index
      });
      index++;
    }
  }
  return mons
}

function extractBases(mons: MonList, BASE_PTRS: string[], BASES: { filename: string, contents: string[] }[], abilities: Ability[], moves: Move[], growthRates: GrowthRate[]): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < BASE_PTRS.length; lineNo++) {
    if (!BASE_PTRS[lineNo].startsWith("INCLUDE")) continue;
    const path = BASE_PTRS[lineNo].split('/').at(-1)!.slice(0, -1)
    const BASE = BASES.find(b => b.filename === path)!.contents;
    const mon = mons.contents.find(m => m.index === index)!
    mon.bsts = BASE[0].match(/\d+/g)!.map(Number)
    mon.types = Array.from(new Set(BASE[1].match(/[A-Z_]+/g)!))
    mon.hasGender = BASE[5].includes('UNKNOWN')
    mon.abilities = BASE[6].match(/[A-Z][A-Z_\d]+/g)!.slice(1).map(ability =>
      abilities.find(a => a.id === ability)!.name
    )
    mon.growthCFs = growthRates.find(g => g.id === BASE[7].slice(3))!.coefficients
    if (BASE[10] != 'tmhm') {
      mon.learnsets.tmhm = BASE[10].match(/[A-Z_\d]+/g)!.map(move =>
        ({ name: moves.find(m => m.id === move)!.name })
      )
    }
    index++
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics
    }
  }
  return mons
}

function extractLvlMoves(mons: MonList, LVL_PTRS: string[], LVL_MOVES: string[], moves: Move[]): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < LVL_PTRS.length; lineNo++) {
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics
    }
    if (!LVL_PTRS[lineNo].startsWith('dw')) continue;
    const pointer = LVL_PTRS[lineNo].slice(3).replace('EvosAttacks', '')
    let learnsetIndex = LVL_MOVES.findIndex(line => line === `evos_attacks ${pointer}`);
    if (learnsetIndex === -1) {
      learnsetIndex = LVL_MOVES.findIndex(line => line.includes(`${pointer}EvosAttacks:`))
    }
    const mon = mons.contents.find(m => m.index === index)!
    while (!/^(learnset|db)/.test(LVL_MOVES[learnsetIndex])) learnsetIndex++;
    while (LVL_MOVES[learnsetIndex].startsWith('learnset')) {
      mon.learnsets.level.push({
        name: moves.find(m => m.id === LVL_MOVES[learnsetIndex].match(/[A-Z][A-Z_\d]+/)!.at(0)!)!.name,
        level: parseInt(LVL_MOVES[learnsetIndex].match(/\d+/)!.at(0)!)
      })
      learnsetIndex++
    }
    index++
  }
  return mons
}

function extractEggMoves(mons: MonList, EGG_PTRS: string[], EGG_MOVES: string[], moves: Move[]): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < EGG_PTRS.length; lineNo++) {
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics
    }
    if (!EGG_PTRS[lineNo].startsWith('dw')) continue;
    const pointer = EGG_PTRS[lineNo].slice(3) + ':'
    let learnsetIndex = EGG_MOVES.findIndex(line => line === pointer)!
    const mon = mons.contents.find(m => m.index === index)!
    while (!EGG_MOVES[learnsetIndex].startsWith('db')) learnsetIndex++;
    while (EGG_MOVES[learnsetIndex].startsWith('db')) {
      if (EGG_MOVES[learnsetIndex].includes('$ff')) break;
      mon.learnsets.egg.push({
        name: moves.find(m => m.id === EGG_MOVES[learnsetIndex].slice(3))!.name
      })
      learnsetIndex++;
    }
    index++;
  }
  return mons
}

function extractEvoMoves(mons: MonList, EVO_MOVES: string[], moves: Move[]): MonList {
  let index = 1;
  for (let lineNo = 0; lineNo < EVO_MOVES.length; lineNo++) {
    if (index === mons.constants.num_species + 1) {
      index += mons.constants.num_cosmetics
    }
    if (!EVO_MOVES[lineNo].startsWith('db')) continue;
    const move = EVO_MOVES[lineNo].slice(3)
    if (move != 'NO_MOVE') {
      const mon = mons.contents.find(m => m.index === index)!
      mon.learnsets.evo.push({
        name: moves.find(m => m.id === move)!.name
      })
    }
    index++;
  }
  return mons
}

function extractForms(forms: Record<string, Base[]>, IDS: string[], FORMS: string[]): Record<string, Base[]> {
  const formNums: Record<string, number> = {}
  let num_magikarp = -1;
  let index = -1;
  for (let lineNo = 0; lineNo < IDS.length; lineNo++) {
    if (IDS[lineNo].includes('DEF NUM_MAGIKARP')) num_magikarp = index;
    if (IDS[lineNo].match(/DEF .+_FORM EQU \d+/)) {
      formNums[IDS[lineNo].match(/DEF (.+_FORM)/)!.at(1)!] =
        parseInt(IDS[lineNo].match(/\d+/)!.at(0)!)
      continue;
    }
    if (IDS[lineNo].startsWith('ext_const_def')) {
      index = parseInt(IDS[lineNo].match(/\d+/)!.at(0)!)
      if (IDS[lineNo].includes('NUM_MAGIKARP')) index = num_magikarp;
      if (!IDS[lineNo].includes(',')) lineNo++;
      do {
        formNums[IDS[lineNo].match(/[A-Z][A-Z_\d]+/)!.at(0)!] = index;
        index++;
        lineNo++;
      } while (IDS[lineNo].startsWith('ext_const '))
      lineNo--;
    }
  }
  for (let lineNo = 0; lineNo < FORMS.length; lineNo++) {
    if (!FORMS[lineNo].startsWith('dp')) continue;
    const match = FORMS[lineNo].match(/[A-Z_\d]+/g)!
    forms[match.at(0)!] ??= [];
    forms[match.at(0)!].push({
      id: match.at(1)!,
      index: formNums[match.at(1)!]
    })
  }
  for (const [form, formNo] of Object.entries(formNums)) {
    if (formNo === 1 && form != 'PLAIN_FORM') {
      forms[form.split('_').at(0)!].push({
        id: form,
        index: formNo
      })
    }
  }
  return forms;
}

const IDS = splitRead('constants/pokemon_constants.asm');
const NAMES = splitRead('data/pokemon/names.asm');
const BASE_PTRS = splitRead('data/pokemon/base_stats.asm')
const BASES: {
  polished: { filename: string, contents: string[] }[],
  faithful: { filename: string, contents: string[] }[]
} = {
  polished: [],
  faithful: []
}
for (const filename of readdirSync(import.meta.dirname + '/../../polishedcrystal/data/pokemon/base_stats/')) {
  const BASE = splitRead('data/pokemon/base_stats/' + filename)
  for (const PF of ['polished', 'faithful'] as const) {
    BASES[PF].push({
      filename,
      contents: BASE[PF]
    })
  }
}
const LVL_PTRS = splitRead('data/pokemon/evos_attacks_pointers.asm')
const LVL_MOVES = splitRead('data/pokemon/evos_attacks.asm')
const EGG_PTRS = splitRead('data/pokemon/egg_move_pointers.asm')
const EGG_MOVES = splitRead('data/pokemon/egg_moves.asm')
const EVO_MOVES = splitRead('data/pokemon/evolution_moves.asm')
const FORMS = splitRead('data/pokemon/variant_forms.asm')

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
  }
};

const forms: {
  polished: Record<string, Base[]>,
  faithful: Record<string, Base[]>
} = {
  polished: {},
  faithful: {}
}

for (const PF of ['polished', 'faithful'] as const) {
  mons[PF] = extractIDs(mons[PF], IDS[PF], NULL_MON)
  mons[PF].contents = extractNames(mons[PF].contents, NAMES[PF], 0)
  mons[PF] = extractBases(mons[PF], BASE_PTRS[PF], BASES[PF], abilities[PF], moves[PF], growthRates[PF])
  mons[PF] = extractLvlMoves(mons[PF], LVL_PTRS[PF], LVL_MOVES[PF], moves[PF])
  mons[PF] = extractEggMoves(mons[PF], EGG_PTRS[PF], EGG_MOVES[PF], moves[PF])
  mons[PF] = extractEvoMoves(mons[PF], EVO_MOVES[PF], moves[PF])
  forms[PF] = extractForms(forms[PF], IDS[PF], FORMS[PF])
}

export default mons;
