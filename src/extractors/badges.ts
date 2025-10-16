import { splitRead } from './utils';

function extractBadges(BADGES: string[]): string[] {
	const badges: string[] = [];
	for (let lineNo = 0; lineNo < BADGES.length; lineNo++) {
		if (!BADGES[lineNo].includes('li ')) continue;
		badges.push(BADGES[lineNo].split('"').at(1)!);
	}
	return badges;
}

const BADGES = splitRead('data/events/badge_names.asm');

const badges = {
	polished: extractBadges(BADGES.polished),
	faithful: extractBadges(BADGES.faithful)
};
export default badges;
