import items from '$data/items.json';
import locations from '$data/locations.json';
import moves from '$data/moves.json';
import natures from '$data/natures.json';
import pokemon from '$data/pokemon.json';
import type { PartyMon, BoxMon } from '$parsers/types';
import { retrieve, readString } from '$parsers/utils';

export function parsePartyMon(
  file: Uint8Array,
  address: number,
  PF: 'polished' | 'faithful'
): PartyMon {
  return {
    species: species(file, address, PF),
    form: form(file, address, PF),
    heldItem: heldItem(file, address + 1, PF),
    moveset: moveset(file, address + 2, PF),
    OTID: OTID(file, address + 6),
    exp: exp(file, address + 8),
    evs: evs(file, address + 11),
    dvs: dvs(file, address + 17),
    shininess: shininess(file, address + 20),
    ability: ability(file, address + 20, PF),
    nature: nature(file, address + 20, PF),
    gender: gender(file, address + 21, PF),
    isEgg: isEgg(file, address + 21),
    powerPoints: powerPoints(file, address + 22),
    PPUPs: partyPPUPs(file, address + 22),
    happiness: happiness(file, address + 26),
    pokerus: pokerus(file, address + 27),
    caughtTime: caughtTime(file, address + 28),
    caughtBall: caughtBall(file, address + 28, PF),
    caughtLevel: caughtLevel(file, address + 29),
    caughtLocation: caughtLocation(file, address + 30, PF),
    level: level(file, address + 31),
    status: status(file, address + 32),
    currentHP: currentHP(file, address + 34),
    stats: stats(file, address + 36),
    OTNickname: [],
    hyperTraining: [],
    nickname: []
  };
}

export function parseBoxMon(
  file: Uint8Array,
  address: number,
  PF: 'polished' | 'faithful'
): BoxMon {
  return {
    species: species(file, address, PF),
    form: form(file, address, PF),
    heldItem: heldItem(file, address + 1, PF),
    moveset: moveset(file, address + 2, PF),
    OTID: OTID(file, address + 6),
    exp: exp(file, address + 8),
    evs: evs(file, address + 11),
    dvs: dvs(file, address + 17),
    shininess: shininess(file, address + 20),
    ability: ability(file, address + 20, PF),
    nature: nature(file, address + 20, PF),
    gender: gender(file, address + 21, PF),
    isEgg: isEgg(file, address + 21),
    PPUPs: BoxPPUPs(file, address + 22),
    happiness: happiness(file, address + 23),
    pokerus: pokerus(file, address + 24),
    caughtTime: caughtTime(file, address + 25),
    caughtBall: caughtBall(file, address + 25, PF),
    caughtLevel: caughtLevel(file, address + 26),
    caughtLocation: caughtLocation(file, address + 27, PF),
    level: level(file, address + 28),
    hyperTraining: hyperTraining(file, address + 29),
    nickname: readString(file, address + 32, 10, true),
    OTNickname: readString(file, address + 42, 7, true)
  };
}

const species = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string =>
  pokemon[PF].find((p) => p.index === (((file[address + 21] << 3) & 0x100) | file[address]))!.name;

const form = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string => {
  const mon = pokemon[PF].find((p) => p.name === species(file, address, PF))!;
  let result = mon.forms.find((f) => f.index === (file[address + 21] & 0x1f));
  if (!result) {
    result = mon.forms.find((f) => f.index === 1);
  }
  return result!.name;
};

const heldItem = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string => {
  if (file[address] === 0) {
    return 'None';
  }
  return items[PF].find((i) => i.index === file[address])!.name;
};

const moveset = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string[] =>
  Array.from({ length: 4 }, (_, i) => {
    if (file[address + i] === 0) {
      return 'None';
    }
    return moves[PF].find((m) => m.index === file[address + i])!.name;
  });

const OTID = (file: Uint8Array, address: number): number => retrieve(file, address, 2);

const exp = (file: Uint8Array, address: number): number => retrieve(file, address, 3);

const evs = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 6 }, (_, i) => file[address + i]);

const dvs = (file: Uint8Array, address: number): number[] =>
  Array.from(
    { length: 6 },
    (_, i) => (file[address + Math.floor(i / 2)] >> (4 * (1 - (i % 2)))) & 0xf
  );

const shininess = (file: Uint8Array, address: number): 'Shiny' | 'Not Shiny' =>
  file[address] >> 7 === 1 ? 'Shiny' : 'Not Shiny';

const ability = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string => {
  const s = species(file, address - 20, PF);
  const f = form(file, address - 20, PF);
  const mon = pokemon[PF].find((p) => p.name === s)!.forms.find((form) => form.name === f)!;
  return mon.abilities[(((file[address] >> 5) & 0x3) + 2) % 3];
};

const nature = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string =>
  natures[PF].find((n) => n.index === (file[address] & 0x1f))!.name;

const gender = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string => {
  const s = species(file, address - 21, PF);
  const f = form(file, address - 21, PF);
  const mon = pokemon[PF].find((p) => p.name === s)!.forms.find((form) => form.name === f)!;
  return mon.hasGender ? (file[address] >> 7 === 1 ? 'Female' : 'Male') : 'Genderless';
};

const isEgg = (file: Uint8Array, address: number): boolean => Boolean((file[address] >> 6) & 0x1);

const powerPoints = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 4 }, (_, i) => file[address + i] & 0x3f);

const partyPPUPs = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 4 }, (_, i) => file[address + i] >> 6);

const BoxPPUPs = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 4 }, (_, i) => (file[address] >> (i * 2)) & 0x3);

const happiness = (file: Uint8Array, address: number): number => file[address];

const pokerus = (
  file: Uint8Array,
  address: number
): {
  strain: number | 'None' | 'Cured';
  daysRemaining?: number;
} => {
  const x = file[address]
  if (x === 0b1101) {
    return { strain: 'Cured' };
  }
  if (x === 0) {
    return { strain: 'None' };
  }
  return {
    strain: 5 - x.toString(2).split('').filter(bit => bit === '1').length,
    daysRemaining: Math.clz32(x) - 27
  };
};

const caughtTime = (file: Uint8Array, address: number) =>
  ['Evening', 'Morning', 'Day', 'Night'][(file[address] >> 5) & 0x3];

const caughtBall = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string =>
  items[PF].find((i) => i.index === (file[address] & 0x1f))!.name;

const caughtLevel = (file: Uint8Array, address: number): number => file[address];

const caughtLocation = (file: Uint8Array, address: number, PF: 'polished' | 'faithful'): string =>
  locations[PF].find((l) => l.index === file[address])!.name;

const level = (file: Uint8Array, address: number): number => file[address];

const status = (
  file: Uint8Array,
  address: number
): {
  name: string;
  turnsRemaining?: number;
} => {
  const statuses = [
    'Badly Poisoned',
    'Paralysis',
    'Freeze',
    'Burn',
    'Poison',
    'Sleep',
    'Sleep',
    'Sleep'
  ];
  for (let i = 0; i < 8; i++) {
    if (((file[address] >> i) & 1) === 1) {
      const name = statuses[7 - i];
      if (name === 'Sleep') {
        return {
          name,
          turnsRemaining: file[address]
        };
      }
      return { name };
    }
  }
  return { name: 'None' };
};

const currentHP = (file: Uint8Array, address: number): number => retrieve(file, address, 2);

const stats = (file: Uint8Array, address: number): number[] =>
  Array.from({ length: 6 }, (_, i) => retrieve(file, address + i * 2, 2));

const hyperTraining = (file: Uint8Array, address: number): boolean[] =>
  [7, 6, 5, 4, 3, 2].map((j) => Boolean(file[address] & (1 << j)));
