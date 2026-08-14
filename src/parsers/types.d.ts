export interface BoxMon {
  species: string;
  form: string;
  dunsparceForm: 'Two-Segment' | 'Three-Segment';
  heldItem: string;
  moveset: string[];
  OTID: number;
  exp: number;
  evs: number[];
  dvs: number[];
  shininess: 'Shiny' | 'Not Shiny';
  ability: string;
  nature: string;
  gender: string;
  isEgg: boolean;
  PPUPs: number[];
  happiness: number;
  pokerus: {
    strain: number | 'None' | 'Cured';
    daysRemaining?: number;
  };
  caughtTime: string;
  caughtBall: string;
  caughtLevel: number;
  caughtLocation: string;
  level: number;
  hyperTraining: boolean[];
  nickname: string[];
  OTNickname: string[];
}

export interface PartyMon extends BoxMon {
  currentHP: number;
  stats: number[];
  status: {
    name: string;
    turnsRemaining?: number;
  };
  powerPoints: number[];
}

export interface Box {
  name: string[];
  theme: string;
  mons: (Mon | null)[];
}

export interface Item {
  name: string;
  qty: number;
}

export type Bag = Record<string, Item[]>;

export interface Player {
  id: number;
  name: string[];
  rivalName: string[];
  money: number;
  gender: string;
}

export type Pokedex = Record<number, number>;

export interface Data {
  party: PartyMon[];
  boxes: Box[];
  bag: Bag;
  player: Player;
  pokedex: Pokedex;
}
