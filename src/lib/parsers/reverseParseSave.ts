import { buf2hex, hex2buf } from '$lib/utils';
import type { BagSlot, Box, PartyMon, Player } from '../types';
import reverseParseBag from './bag/reverse/reverseParseBag';
import reverseParseBoxes from './boxes/reverse/reverseParseBoxes';
import checksumPlayer from './checksumPlayer';
import reverseParseParty from './party/reverse/reverseParseParty';
import reverseParsePlayer from './player/reverse/reverseParsePlayer';

async function reverseParseSave(
  file: File,
  party: PartyMon[],
  boxes: Box[],
  bag: Record<string, BagSlot>,
  player: Player,
  PF: 'polished' | 'faithful'
): Promise<ArrayBuffer> {
  let fileHex = await buf2hex(file);

  fileHex = reverseParseParty(fileHex, party, PF);
  fileHex = reverseParseBoxes(fileHex, boxes, PF);
  fileHex = reverseParseBag(fileHex, bag, PF);
  fileHex = reverseParsePlayer(fileHex, player, PF);
  fileHex = checksumPlayer(fileHex);

  return hex2buf(fileHex);
}
export default reverseParseSave;
