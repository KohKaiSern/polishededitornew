import { splitRead } from './utils';

function extractBoxThemes(BOX_THEMES: string[]): string[] {
	const boxThemes = [];
	for (let lineNo = 0; lineNo < BOX_THEMES.length; lineNo++) {
		if (!BOX_THEMES[lineNo].includes('"')) continue;
		boxThemes.push(BOX_THEMES[lineNo].split('"').at(1)!);
	}
	return boxThemes;
}

const BOX_THEMES = splitRead('data/pc/theme_names.asm');

const boxThemes = extractBoxThemes(BOX_THEMES.polished);
export default boxThemes;
