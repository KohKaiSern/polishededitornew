import addresses from '$data/addresses.json';
import boxThemes from '$data/boxThemes.json';

function reverseParseBoxThemes(fileHex: string[], themes: string[], PF: 'polished' | 'faithful'): string[] {
  for (let box = 0; box < 20; box++) {
    const address = addresses.sBackupNewBox1 + 33 * box + 32;
    fileHex[address] = boxThemes[PF]
      .findIndex((boxTheme) => boxTheme.name === themes[box])
      .toString(16)
      .padStart(2, '0');
  }
  return fileHex;
}
export default reverseParseBoxThemes;
