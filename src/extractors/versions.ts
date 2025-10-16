import { splitRead } from './utils';

function extractSaveVersion(SAVE_VERSION: string[]): number {
	return parseInt(
		SAVE_VERSION.find((line) => line.includes('SAVE_VERSION'))!
			.split(' ')
			.at(-1)!
	);
}

function extractGameVersion(GAME_VERSION: string[]): string {
	return GAME_VERSION.find((line) => line.includes('VERSION'))!
		.split(':= ')
		.at(1)!;
}

const SAVE_VERSION = splitRead('constants/misc_constants.asm');
const GAME_VERSION = splitRead('Makefile');

const versions = {
	game: extractGameVersion(GAME_VERSION.polished),
	save: extractSaveVersion(SAVE_VERSION.polished)
};
export default versions;
