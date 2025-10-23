import { readdirSync } from 'fs';
import type { Form, Species } from './types';
import abilities from './abilities';
import moves from './moves';
import { capitalize, findMove, reduce, splitRead } from './utils';

function extractNames(NAMES: string[]): Species[] {
	const names: Species[] = [];
	let dexNo = 0;
	for (let lineNo = 0; lineNo < NAMES.length; lineNo++) {
		if (!NAMES[lineNo].includes('"')) continue;
		if (NAMES[lineNo].split('"').at(1)! === 'Dudunsparc') {
			names.push({
				id: 'dudunsparce',
				name: 'Dudunsparce',
				dexNo,
				forms: []
			});
		} else {
			names.push({
				id: reduce(NAMES[lineNo].split('"').at(1)!),
				name: NAMES[lineNo].split('"').at(1)!,
				dexNo,
				forms: []
			});
		}
		dexNo++;
	}
	return names;
}

function extractForms(FORMS: string[], pokemon: Species[]): Species[] {
	for (let lineNo = 0; lineNo < FORMS.length; lineNo++) {
		//Non-regional forms
		if (FORMS[lineNo].includes('ext_const_def')) {
			const id = reduce(FORMS[lineNo - 1].slice(2));
			if (!FORMS[lineNo].includes(';')) lineNo++;
			while (FORMS[lineNo].startsWith('ext_const')) {
				const [, formID, formNo] = FORMS[lineNo].match(/[A-Z0-9]+_(.+)_FORM.+\((.+)\)/)!;
				pokemon
					.find((mon) => mon.id === id)!
					.forms.push({
						id: reduce(formID),
						formNo: parseInt(formNo, 16)
					});
				lineNo++;
			}
		}
		//Regional forms
		else if (/DEF.*EQU \d/gm.test(FORMS[lineNo])) {
			const [, id, formNo] = FORMS[lineNo].match(/DEF (.*)_FORM.*EQU (\d+)/)!;
			lineNo++;
			while (FORMS[lineNo].includes(';')) {
				pokemon
					.find((mon) => mon.id === reduce(FORMS[lineNo].split(/[\d\w] /).at(-1)!))!
					.forms.push({
						id: reduce(id),
						formNo: parseInt(formNo, 16)
					});
				lineNo++;
			}
		}
	}
	//Plain forms
	for (const mon of pokemon) {
		if (mon.forms.find((form) => form.formNo === 1)) continue;
		mon.forms.push({
			id: 'plain',
			formNo: 1,
			bsts: [],
			type: [],
			hasGender: false,
			abilities: [],
			growthRate: '',
			learnsets: { egg: [], tmhm: [], level: [] }
		});
	}
	return pokemon;
}

function findMon(
	ATTRS: string[],
	FILENAME: string,
	pokemon: Species[],
	PF: 'polished' | 'faithful'
): Species[] {
	//Find the species and form
	let underscores = FILENAME.split('_').length;
	while (underscores > 0) {
		const speciesID = reduce(FILENAME.split('_').slice(0, underscores).join(''));
		const formID = reduce(FILENAME.split('_').slice(underscores).join(''));
		const species = pokemon.find((mon) => mon.id === speciesID);
		//Cosmetic Variants / No Variants
		if (species && underscores === FILENAME.split('_').length) {
			for (const form of species.forms) {
				Object.assign(form, extractAttrs(ATTRS, form, PF));
			}
		}
		//Functional Variants
		const form = species?.forms.find((form) => form.id === formID);
		if (form) {
			Object.assign(form, extractAttrs(ATTRS, form, PF));
			break;
		}
		underscores -= 1;
	}
	return pokemon;
}

function extractAttrs(ATTRS: string[], form: Partial<Form>, PF: 'polished' | 'faithful'): Form {
	if (!ATTRS[0].includes('db')) ATTRS = ATTRS.slice(1);
	if (ATTRS[10].startsWith(';')) ATTRS = ATTRS.slice(0, 10).concat(ATTRS.slice(11));
	return {
		id: form.id!,
		formNo: form.formNo!,
		bsts: ATTRS[0].match(/\d+/g)!.slice(0, 6).map(Number),
		type: Array.from(new Set(ATTRS[3].match(/[A-Z]+/g)!.map((type) => capitalize(type)))),
		hasGender: !ATTRS[7].includes('GENDER_UNKNOWN'),
		abilities: ATTRS[9]
			.split(', ')
			.slice(1)
			.map((ability) => abilities[PF].find((a) => a.id === reduce(ability))!.name),
		growthRate: reduce(ATTRS[10].match(/GROWTH_(.+?) /)!.at(1)!),
		learnsets: {
			tmhm: (ATTRS[16].match(/[A-Z_]+/g) || []).map((move) => findMove(reduce(move), moves, PF)),
			egg: [],
			level: []
		}
	};
}

function extractEggMoves(
	EGG_POINTERS: string[],
	EGG_MOVES: string[],
	pokemon: Species[],
	PF: 'polished' | 'faithful'
): Species[] {
	for (const species of pokemon) {
		for (const form of species.forms) {
			//Trying to look for a functional variant
			let pointer = EGG_POINTERS.find(
				(line) => reduce(line).includes(species.id) && reduce(line).includes(form.id!)
			);
			//Failing which, the form is a cosmetic/base variant and will follow the base pointer.
			if (!pointer) {
				pointer = EGG_POINTERS.find((line) => reduce(line).includes(species.id));
			}
			//Extract the pointer name
			if (pointer) {
				pointer = pointer.match(/dw (\S+)/)!.at(1)!;
			}
			//Grab the egg moves
			for (let lineNo = 0; lineNo < EGG_MOVES.length; lineNo++) {
				if (!EGG_MOVES[lineNo].includes(pointer!)) continue;
				lineNo++;
				while (EGG_MOVES[lineNo].startsWith('dp')) lineNo++;
				while (!EGG_MOVES[lineNo].includes('$ff')) {
					form.learnsets!.egg.push(
						findMove(reduce(EGG_MOVES[lineNo].match(/[A-Z_]+/)!.at(0)!), moves, PF)
					);
					lineNo++;
				}
			}
		}
	}
	return pokemon;
}

function extractLevelMoves(
	LEVEL_MOVES: string[],
	pokemon: Species[],
	PF: 'polished' | 'faithful'
): Species[] {
	for (const species of pokemon) {
		for (const form of species.forms) {
			//Trying to look for a functional variant
			let entry = LEVEL_MOVES.findIndex(
				(line) => reduce(line) === 'evosattacks' + species.id + form.id
			);
			if (entry === -1) {
				//Default to a cosmetic/base variant
				entry = LEVEL_MOVES.findIndex((line) => reduce(line) === 'evosattacks' + species.id);
			}
			if (entry === -1) {
				//Default to pre-evolution
				entry = LEVEL_MOVES.findIndex(
					(line) => reduce(line).includes('evodata') && reduce(line).includes(species.id)
				);
			}
			if (entry != -1) {
				while (!LEVEL_MOVES[entry].startsWith('learnset')) entry++;
				while (LEVEL_MOVES[entry].startsWith('learnset')) {
					form.learnsets!.level.push({
						name: findMove(reduce(LEVEL_MOVES[entry].match(/[A-Z_]+/)!.at(0)!), moves, PF),
						level: parseInt(LEVEL_MOVES[entry].match(/\d+/)!.at(0)!)
					});
					entry++;
				}
			}
		}
	}
	return pokemon;
}

const NAMES = splitRead('data/pokemon/names.asm');
const FORMS = splitRead('constants/pokemon_constants.asm');
const ATTRS_DIR = readdirSync(
	import.meta.dirname + '/../../polishedcrystal/data/pokemon/base_stats'
);
const EGG_POINTERS = splitRead('data/pokemon/egg_move_pointers.asm');
const EGG_MOVES = splitRead('data/pokemon/egg_moves.asm');
const LEVEL_MOVES = splitRead('data/pokemon/evos_attacks.asm');

const pokemon = {
	polished: extractForms(FORMS.polished, extractNames(NAMES.polished)),
	faithful: extractForms(FORMS.faithful, extractNames(NAMES.faithful))
};

for (const FILENAME of ATTRS_DIR) {
	const ATTRS = splitRead('data/pokemon/base_stats/' + FILENAME);
	pokemon.polished = findMon(ATTRS.polished, FILENAME.slice(0, -4), pokemon.polished, 'polished');
	pokemon.faithful = findMon(ATTRS.faithful, FILENAME.slice(0, -4), pokemon.faithful, 'faithful');
}

pokemon.polished = extractLevelMoves(
	LEVEL_MOVES.polished,
	extractEggMoves(EGG_POINTERS.polished, EGG_MOVES.polished, pokemon.polished, 'polished'),
	'polished'
);

pokemon.faithful = extractLevelMoves(
	LEVEL_MOVES.faithful,
	extractEggMoves(EGG_POINTERS.faithful, EGG_MOVES.faithful, pokemon.faithful, 'faithful'),
	'faithful'
);

export default pokemon;
