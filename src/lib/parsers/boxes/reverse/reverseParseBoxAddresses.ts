import addresses from '$data/addresses.json';
import { bin2hex } from '$lib/utils';
import type { Mon } from '$lib/types';

function reverseParseBoxAddresses(fileHex: string[], mons: (Mon | null)[][]): string[] {
  let monIndex = 1;
  for (let box = 0; box < 20; box++) {
    let flagStr = '';
    for (let i = 0; i < 20; i++) {
      //Empty Slot
      if (!mons[box][i]) {
        fileHex[addresses.sBackupNewBox1 + (33 * box + i)] = '00';
        flagStr += '0';
        continue;
      }
      fileHex[addresses.sBackupNewBox1 + (33 * box + i)] = (
        monIndex > 200 ? monIndex - 200 : monIndex
      )
        .toString(16)
        .padStart(2, '0');
      flagStr += monIndex > 200 ? '1' : '0';
      monIndex++;
    }
    fileHex[addresses.sBackupNewBox1 + 33 * box + 20] = bin2hex(
      flagStr.slice(0, 8).split('').reverse().join('')
    );
    fileHex[addresses.sBackupNewBox1 + 33 * box + 21] = bin2hex(
      flagStr.slice(8, 16).split('').reverse().join('')
    );
    fileHex[addresses.sBackupNewBox1 + 33 * box + 22] = bin2hex(
      flagStr.slice(16, 24).split('').reverse().join('')
    );
  }
  return fileHex;
}
export default reverseParseBoxAddresses;
