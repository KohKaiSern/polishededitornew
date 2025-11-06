import addresses from '$data/addresses.json';
import { hex2bin, readString } from '$lib/utils';
import type { PartyMon } from '$lib/types';
import parsePartyMon from './parsePartyMon';

function parseParty(fileHex: string[], PF: 'polished' | 'faithful'): PartyMon[] {
  const party = Array(6).fill(null);
  const address = addresses.sBackupPokémonData + 8;
  for (let i = 0; i < parseInt(fileHex[address - 8], 16); i++) {
    party[i] = parsePartyMon(fileHex, address + 48 * i, PF);
    party[i]['OTNickname'] = readString(fileHex, addresses.wPartyMonOTs + i * 11, 7, false);
    party[i]['hyperTraining'] = [...hex2bin(fileHex[addresses.wPartyMon1HyperTraining + i * 11]).slice(0, 6)].map(
      (stat) => (stat === '1' ? true : false)
    );
    party[i]['nickname'] = readString(fileHex, addresses.wPartyMon1Nickname + i * 11, 10, false);
  }
  return party;
}
export default parseParty;
