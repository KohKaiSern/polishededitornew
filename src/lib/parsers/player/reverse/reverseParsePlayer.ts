import addresses from '$data/addresses.json';
import { writeString } from '$lib/utils';
import type { Player } from '$lib/types';

function reverseParsePlayer(
  fileHex: string[],
  player: Player,
  PF: 'polished' | 'faithful'
): string[] {
  //ID
  fileHex[addresses.wPlayerID] = player.id.toString(16).padStart(4, ' 0').slice(0, 2);
  fileHex[addresses.wPlayerID + 1] = player.id.toString(16).padStart(4, '0').slice(2);

  //Gender
  fileHex[addresses.wPlayerGender] = ['Male', 'Female', 'Non-Binary']
    .findIndex((g) => g === player.gender)
    .toString(16)
    .padStart(2, '0');

  //Name
  fileHex = writeString(fileHex, addresses.wPlayerName, 8, player.name, false);

  //Rival's Name
  fileHex = writeString(fileHex, addresses.wRivalName, 8, player.rivalName, false);

  //Money
  for (let i = 0; i < 3; i++) {
    fileHex[addresses.wMoney + i] = player.money
      .toString(16)
      .padStart(6, '0')
      .slice(i * 2, (i + 1) * 2);
  }

  return fileHex;
}
export default reverseParsePlayer;
