import addresses from '$data/addresses.json';
import { readString } from '$lib/utils';
import type { Player } from '$lib/types';

function parsePlayer(fileHex: string[], PF: 'polished' | 'faithful'): Player {
  //ID
  const id = parseInt(fileHex[addresses.wPlayerID] + fileHex[addresses.wPlayerID + 1], 16);

  //Gender
  const gender = ['Male', 'Female', 'Non-Binary'].at(
    parseInt(fileHex[addresses.wPlayerGender], 16)
  )!;

  //Name
  const name = readString(fileHex, addresses.wPlayerName, 7, false);

  //Rival's Name
  const rivalName = readString(fileHex, addresses.wRivalName, 7, false);

  //Money
  const money = parseInt(
    fileHex[addresses.wMoney] + fileHex[addresses.wMoney + 1] + fileHex[addresses.wMoney + 2],
    16
  );

  return { id, gender, name, rivalName, money };
}
export default parsePlayer;
