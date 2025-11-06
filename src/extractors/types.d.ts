export interface Base {
  id: string | null;
  index: number;
}

export interface Form {
  id: string;
  formNo: number;
  type: string[];
  abilities: string[];
  bsts: number[];
  growthRate: string;
  hasGender: boolean;
  learnsets: { level: { name: string; level: number }[]; egg: string[]; tmhm: string[] };
}

export interface Species {
  id: string;
  name: string;
  dexNo: number;
  forms: Partial<Form>[];
}

export interface Item extends Base {
  name: string;
  description: string;
  category: string;
  spritePath: string;
}

export interface KeyItem extends Base {
  name: string;
  description: string;
  spritePath: string;
}

export interface Move extends Base {
  name: string;
  basePower: number;
  type: string;
  accuracy: number;
  powerPoints: number;
  effectChance: number;
  category: string;
  description: string;
}

export interface Ability extends Base {
  name: string;
  description: string;
}

export interface Location {
  id: string;
  name: string;
  locationNo: number;
}

export interface Apricorn extends Base {
  name: string;
  ball: string;
  spritePath: string;
}

export interface ExpCandy extends Base {
  name: string;
  description: string;
  spritePath: string;
}

export interface Wing extends Base {
  name: string;
  spritePath: string;
}

export interface BoxTheme extends Base {
  name: string;
}
