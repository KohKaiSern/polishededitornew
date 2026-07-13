import addresses from '$data/addresses.json';
import { parsePartyMon } from '$parsers/mon/parseMon';
import type { PartyMon } from '$parsers/types';
import { readString } from '$parsers/utils';

function parseParty(file: Uint8Array, PF: 'polished' | 'faithful'): PartyMon[] {
  const party = [];
  for (let i = 0; i < file[addresses.sBackupPokémonData]; i++) {
    party.push(parsePartyMon(file, addresses.sBackupPokémonData + 8 + 48 * i, PF));
    party[i].OTNickname = readString(file, addresses.wPartyMonOTs + i * 11, 7, false);
    party[i].hyperTraining = [7, 6, 5, 4, 3, 2].map((j) =>
      Boolean(file[addresses.wPartyMon1HyperTraining + i * 11] & (1 << j))
    );
    party[i].nickname = readString(file, addresses.wPartyMon1Nickname + i * 11, 10, false);
  }
  return party;
}

export default parseParty;
