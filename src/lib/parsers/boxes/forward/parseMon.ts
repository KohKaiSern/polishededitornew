import abilities from '$data/abilities.json';
import items from '$data/items.json';
import locations from '$data/locations.json';
import moves from '$data/moves.json';
import pokemon from '$data/pokemon.json';
import { getNature, hex2bin, readString } from '$lib/utils';
import type { Mon } from '$lib/types';

function parseMon(fileHex: string[], address: number, PF: 'polished' | 'faithful'): Mon {
  //Byte #1, Byte #22: Species, Form
  const byte22 = hex2bin(fileHex[address + 21]);
  const dexNo = parseInt(byte22.at(2)! + hex2bin(fileHex[address]), 2);
  let formNo = parseInt(byte22.slice(3), 2);
  const species = pokemon[PF][dexNo];
  let form = species.forms.find((f) => f.formNo === formNo);
  if (!form) {
    form = species.forms.find(f => f.formNo === 1)!
  }
  //Byte #2: Held Item
  let heldItem = 'None';
  if (!(fileHex[address + 1] === '00')) {
    heldItem = items[PF][parseInt(fileHex[address + 1], 16) - 1].name;
  }

  //Bytes #3-#6: Moveset
  const moveset: string[] = [];
  for (let i = 2; i < 6; i++) {
    if (fileHex[address + i] === '00') {
      moveset.push('None');
    } else {
      moveset.push(moves[PF][parseInt(fileHex[address + i], 16) - 1].name);
    }
  }

  //Bytes #7-#8: Original Trainer ID
  const OTID = parseInt(fileHex[address + 6] + fileHex[address + 7], 16);

  //Bytes #9-#11: Experience
  const exp = parseInt(fileHex[address + 8] + fileHex[address + 9] + fileHex[address + 10], 16);

  //Bytes #12-#17: Effort Values
  const evs = [];
  for (let i = 11; i < 17; i++) {
    evs.push(parseInt(fileHex[address + i], 16));
  }

  //Bytes #18-#20: Determinant Values
  const dvs = [];
  for (let i = 0; i < 6; i++) {
    dvs.push(parseInt(fileHex[address + 17 + Math.floor(i / 2)].at(i % 2)!, 16));
  }

  //Bytes #21: Shininess, Ability, Nature
  const byte21 = hex2bin(fileHex[address + 20]);
  const shininess = byte21.at(0)! === '0' ? 'Not Shiny' : 'Shiny';
  const ability = abilities[PF].find(
    (ability) => form.abilities.at(parseInt(byte21.slice(1, 3), 2) - 1)! === ability.name
  )!.name;
  const nature = getNature(parseInt(byte21.slice(3), 2));

  //Byte #22: Gender, isEgg
  const gender = form.hasGender ? (byte22.at(0)! === '0' ? 'Male' : 'Female') : 'Genderless';
  const isEgg = byte22.at(1)! === '0' ? false : true;

  //Byte #23: PP UPs
  const PPUPs = [];
  for (let i = 3; i > -1; i--) {
    PPUPs.push(parseInt(hex2bin(fileHex[address + 22]).slice(i * 2, i * 2 + 1), 2));
  }

  //Byte #24: Happiness / Hatch Cycles
  const happiness = parseInt(fileHex[address + 23], 16);

  //Byte #25: Pokerus
  const pokerus: { strain: number | 'None' | 'Cured'; daysRemaining: number } = {
    strain: 'None',
    daysRemaining: 0
  };
  const pokerusStr = hex2bin(fileHex[address + 24]).slice(4);
  if (pokerusStr === '1101') {
    pokerus.strain = 'Cured';
  } else if (pokerusStr != '0000') {
    pokerus.strain = pokerusStr.split('1').length - 1;
    pokerus.daysRemaining = pokerus.strain - (4 - pokerusStr.replace(/^0+/, '').length);
  }

  //Byte #26: Caught Time, Caught Ball
  const byte26 = hex2bin(fileHex[address + 25]);
  const caughtTime = ['Evening', 'Morning', 'Day', 'Night'][parseInt(byte26.slice(1, 3), 2)];
  let caughtBall = 'Park Ball';
  if (byte26.slice(3) != '00000') {
    caughtBall = items[PF][parseInt(byte26.slice(3), 2) - 1].name;
  }

  //Byte #27: Caught Level
  const caughtLevel = parseInt(fileHex[address + 26], 16);

  //Byte #28: Caught Location
  const caughtLocation = locations[PF][parseInt(fileHex[address + 27], 16)].name;

  //Byte #29: Level
  const level = parseInt(fileHex[address + 28], 16);

  //Byte #30: Hyper Training
  const hyperTraining = [...hex2bin(fileHex[address + 29]).slice(0, 6)].map((stat) =>
    stat === '1' ? true : false
  );

  //Bytes #31-#32: Unused

  //Bytes #33-#42: Nickname
  const nickname = readString(fileHex, address + 32, 10, true);

  //Bytes #43-#49: Original Trainer Nickname
  const OTNickname = readString(fileHex, address + 42, 7, true);

  return {
    species: species.name,
    form: form.id,
    heldItem,
    moves: moveset,
    OTID,
    exp,
    evs,
    dvs,
    shininess,
    ability,
    nature,
    isEgg,
    gender,
    PPUPs,
    happiness,
    pokerus,
    caughtBall,
    caughtTime,
    caughtLevel,
    caughtLocation,
    level,
    hyperTraining,
    nickname,
    OTNickname
  };
}
export default parseMon;
