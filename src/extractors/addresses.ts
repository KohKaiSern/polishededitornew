import { splitRead } from './utils';

//Symbols
const SYMBOLS = [
  'sSaveVersion',
  'sBackupNewBox1',
  'sBoxMons1A',
  'sBoxMons1B',
  'sBoxMons1C',
  'sBoxMons2A',
  'sBoxMons2B',
  'sBoxMons2C',
  'sBackupPlayerData',
  'sBackupChecksum',
  'sChecksum',
  'sGameData',
  'sGameDataEnd',
  'sBackupGameData',
  'sBackupGameDataEnd',
  'sBackupPokémonData',
  'wNumItems',
  'wNumMedicine',
  'wNumBalls',
  'wNumBerries',
  'wTMsHMs',
  'wKeyItems',
  'wCoins',
  'wApricorns',
  'wWingAmounts',
  'wCandyAmounts',
  'wBlueCardBalance',
  'wPlayerID',
  'wPlayerGender',
  'wPlayerName',
  'wRivalName',
  'wMoney',
  'wBadges',
  'wPartyMonOTs',
  'wPartyMon1HyperTraining',
  'wPartyMon1Nickname',
  'wGameData',
];

//Converts wRAM address to sRAM
function wToSRAM(address: string): number {
  //M = (0x2000 * PP) + (QQQQ - 0xA000), where the original memory address was PP:QQQQ
  return 8192 * parseInt(address.slice(0, 2), 16) + (parseInt(address.slice(2), 16) - 40960);
}

function makeAddress(addresses: Record<string, number>): Record<string, number> {
  for (const [symbol, address] of Object.entries(addresses)) {
    if (symbol.startsWith('s')) continue;
    addresses[symbol] = address + addresses.sBackupGameData - addresses.wGameData;
  }
  return addresses;
}

function extractAddresses(ADDRESSES: string[]): Record<string, number> {
  const addresses: Record<string, number> = {};
  for (const entry of SYMBOLS) {
    const symbol = ADDRESSES.find((line) => line.endsWith(entry))!;
    addresses[entry] = wToSRAM(symbol.split(' ').at(0)!.replace(':', ''));
  }
  return addresses;
}

const ADDRESSES = splitRead('../polishedcrystal.sym');
const addresses = makeAddress(extractAddresses(ADDRESSES.polished));
export default addresses;
