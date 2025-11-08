export interface Base {
  id: string | null;
  index: number;
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

export interface Location extends Base {
  name: string;
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

export interface GrowthRate extends Base {
  coefficients: number[];
}

export interface Mon extends Base {
  name: string;
  bsts: number[];
  types: string[];
  hasGender: boolean;
  abilities: string[];
  growthCFs: number[];
  learnsets: {
    level: {
      name: string;
      level: number;
    }[],
    egg: {
      name: string;
    }[],
    evo: {
      name: string;
    }[];
    tmhm: {
      name: string;
    }[]
  }
}

export interface MonList {
  constants: Record<string, number>
  contents: Mon[];
}
