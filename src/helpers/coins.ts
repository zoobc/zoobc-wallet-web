export interface CoinInterface {
  name: string;
  segwitAvailable?: boolean;
  bip49available?: boolean;
  network: string;
  coinValue: number;
  purposeValue?: number;
  derivationStandard?:
    | 'sep5'
    | 'bip32'
    | 'bip44'
    | 'bip49'
    | 'bip84'
    | 'bip141';
  curveName?: 'secp256k1' | 'P-256' | 'ed25519';
}

export function findCoin(coinName: string): CoinInterface {
  const coinConfig = coins.find(c => c.name.startsWith(coinName));
  if (!coinConfig) throw new Error('coin not found');
  return coinConfig;
}

export const coins: Array<CoinInterface> = [
  {
    name: 'AC - Asiacoin',
    network: 'asiacoin',
    coinValue: 51,
  },
  {
    name: 'ACC - Adcoin',
    network: 'adcoin',
    coinValue: 161,
  },
  {
    name: 'AUR - Auroracoin',
    network: 'auroracoin',
    coinValue: 85,
  },
  {
    name: 'AXE - Axe',
    network: 'axe',
    coinValue: 4242,
  },
  {
    name: 'ANON - ANON',
    network: 'anon',
    coinValue: 220,
  },
  {
    name: 'BOLI - Bolivarcoin',
    network: 'bolivarcoin',
    coinValue: 278,
  },
  {
    name: 'BCA - Bitcoin Atom',
    network: 'atom',
    coinValue: 185,
  },
  {
    name: 'BCH - Bitcoin Cash',
    network: 'bitcoin',
    // DOM.bitcoinCashAddressTypeContainer.removeClass("hidden");
    coinValue: 145,
  },
  {
    name: 'BEET - Beetlecoin',
    network: 'beetlecoin',
    coinValue: 800,
  },
  {
    name: 'BELA - Belacoin',
    network: 'belacoin',
    coinValue: 73,
  },
  {
    name: 'BLK - BlackCoin',
    network: 'blackcoin',
    coinValue: 10,
  },
  {
    name: 'BND - Blocknode',
    network: 'blocknode',
    coinValue: 2941,
  },
  {
    name: 'tBND - Blocknode Testnet',
    network: 'blocknode_testnet',
    coinValue: 1,
  },
  {
    name: 'BRIT - Britcoin',
    network: 'britcoin',
    coinValue: 70,
  },
  {
    name: 'BSD - Bitsend',
    network: 'bitsend',
    coinValue: 91,
  },
  {
    name: 'BST - BlockStamp',
    network: 'blockstamp',
    coinValue: 254,
  },
  {
    name: 'BTA - Bata',
    network: 'bata',
    coinValue: 89,
  },
  {
    name: 'BTC - Bitcoin',
    network: 'bitcoin',
    coinValue: 0,
  },
  {
    name: 'BTC - Bitcoin Testnet',
    network: 'testnet',
    coinValue: 1,
  },
  {
    name: 'BITG - Bitcoin Green',
    network: 'bitcoingreen',
    coinValue: 222,
  },
  {
    name: 'BTCP - Bitcoin Private',
    network: 'bitcoinprivate',
    coinValue: 183,
  },
  {
    name: 'BTCZ - Bitcoinz',
    network: 'bitcoinz',
    coinValue: 177,
  },
  {
    name: 'BTDX - BitCloud',
    network: 'bitcloud',
    coinValue: 218,
  },
  {
    name: 'BTG - Bitcoin Gold',
    network: 'bgold',
    coinValue: 156,
  },
  {
    name: 'BTX - Bitcore',
    network: 'bitcore',
    coinValue: 160,
  },
  {
    name: 'CCN - Cannacoin',
    network: 'cannacoin',
    coinValue: 19,
  },
  {
    name: 'CESC - Cryptoescudo',
    network: 'cannacoin',
    coinValue: 111,
  },
  {
    name: 'CDN - Canadaecoin',
    network: 'canadaecoin',
    coinValue: 34,
  },
  {
    name: 'CLAM - Clams',
    network: 'clam',
    coinValue: 23,
  },
  {
    name: 'CLO - Callisto',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 820,
  },
  {
    name: 'CLUB - Clubcoin',
    network: 'clubcoin',
    coinValue: 79,
  },
  {
    name: 'CMP - Compcoin',
    network: 'compcoin',
    coinValue: 71,
  },
  {
    name: 'CRAVE - Crave',
    network: 'crave',
    coinValue: 186,
  },
  {
    name: 'CRW - Crown (Legacy)',
    network: 'crown',
    coinValue: 72,
  },
  {
    name: 'CRW - Crown',
    network: 'crown',
    coinValue: 72,
  },
  {
    name: 'DASH - Dash',
    network: 'dash',
    coinValue: 5,
  },
  {
    name: 'DASH - Dash Testnet',
    network: 'dashtn',
    coinValue: 1,
  },
  {
    name: 'DFC - Defcoin',
    network: 'defcoin',
    coinValue: 1337,
  },
  {
    name: 'DGB - Digibyte',
    network: 'digibyte',
    coinValue: 20,
  },
  {
    name: 'DGC - Digitalcoin',
    network: 'digitalcoin',
    coinValue: 18,
  },
  {
    name: 'DMD - Diamond',
    network: 'diamond',
    coinValue: 152,
  },
  {
    name: 'DNR - Denarius',
    network: 'denarius',
    coinValue: 116,
  },
  {
    name: 'DOGE - Dogecoin',
    network: 'dogecoin',
    coinValue: 3,
  },
  {
    name: 'DXN - DEXON',
    network: 'bitcoin',
    coinValue: 237,
  },
  {
    name: 'ECN - Ecoin',
    network: 'ecoin',
    coinValue: 115,
  },
  {
    name: 'EDRC - Edrcoin',
    network: 'edrcoin',
    coinValue: 56,
  },
  {
    name: 'EFL - Egulden',
    network: 'egulden',
    coinValue: 78,
  },
  {
    name: 'ELLA - Ellaism',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 163,
  },
  {
    name: 'EMC2 - Einsteinium',
    network: 'einsteinium',
    coinValue: 41,
  },
  {
    name: 'ERC - Europecoin',
    network: 'europecoin',
    coinValue: 151,
  },
  {
    name: 'ESN - Ethersocial Network',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 31102,
  },
  {
    name: 'ETC - Ethereum Classic',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 61,
  },
  {
    name: 'ETH - Ethereum',
    network: 'bitcoin',
    coinValue: 60,
  },
  {
    name: 'EXCL - Exclusivecoin',
    network: 'exclusivecoin',
    coinValue: 190,
  },
  {
    name: 'EXCC - ExchangeCoin',
    network: 'exchangecoin',
    coinValue: 0,
  },
  {
    name: 'EXP - Expanse',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 40,
  },
  {
    name: 'FJC - Fujicoin',
    network: 'fujicoin',
    coinValue: 75,
  },
  {
    name: 'FLASH - Flashcoin',
    network: 'flashcoin',
    coinValue: 120,
  },
  {
    name: 'FRST - Firstcoin',
    network: 'firstcoin',
    coinValue: 167,
  },
  {
    name: 'FTC - Feathercoin',
    network: 'feathercoin',
    coinValue: 8,
  },
  {
    name: 'GAME - GameCredits',
    network: 'game',
    coinValue: 101,
  },
  {
    name: 'GBX - Gobyte',
    network: 'gobyte',
    coinValue: 176,
  },
  {
    name: 'GCR - GCRCoin',
    network: 'gcr',
    coinValue: 79,
  },
  {
    name: 'GRC - Gridcoin',
    network: 'gridcoin',
    coinValue: 84,
  },
  {
    name: 'HNC - Helleniccoin',
    network: 'helleniccoin',
    coinValue: 168,
  },
  {
    name: 'HUSH - Hush',
    network: 'hush',
    coinValue: 197,
  },
  {
    name: 'INSN - Insane',
    network: 'insane',
    coinValue: 68,
  },
  {
    name: 'IOP - Iop',
    network: 'iop',
    coinValue: 66,
  },
  {
    name: 'IXC - Ixcoin',
    network: 'ixcoin',
    coinValue: 86,
  },
  {
    name: 'JBS - Jumbucks',
    network: 'jumbucks',
    coinValue: 26,
  },
  {
    name: 'KMD - Komodo',
    bip49available: false,
    network: 'komodo',
    coinValue: 141,
  },
  {
    name: 'KOBO - Kobocoin',
    bip49available: false,
    network: 'kobocoin',
    coinValue: 196,
  },
  {
    name: 'LBC - Library Credits',
    network: 'lbry',
    coinValue: 140,
  },
  {
    name: 'LCC - Litecoincash',
    network: 'litecoincash',
    coinValue: 192,
  },
  {
    name: 'LDCN - Landcoin',
    network: 'landcoin',
    coinValue: 63,
  },
  {
    name: 'LINX - Linx',
    network: 'linx',
    coinValue: 114,
  },
  {
    name: 'LKR - Lkrcoin',
    segwitAvailable: false,
    network: 'lkrcoin',
    coinValue: 557,
  },
  {
    name: 'LTC - Litecoin',
    network: 'litecoin',
    coinValue: 2,
    // DOM.litecoinLtubContainer.removeClass("hidden");
  },
  {
    name: 'LTZ - LitecoinZ',
    network: 'litecoinz',
    coinValue: 221,
  },
  {
    name: 'LYNX - Lynx',
    network: 'lynx',
    coinValue: 191,
  },
  {
    name: 'MAZA - Maza',
    network: 'maza',
    coinValue: 13,
  },
  {
    name: 'MEC - Megacoin',
    network: 'megacoin',
    coinValue: 217,
  },
  {
    name: 'MIX - MIX',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 76,
  },
  {
    name: 'MNX - Minexcoin',
    network: 'minexcoin',
    coinValue: 182,
  },
  {
    name: 'MONA - Monacoin',
    network: 'monacoin',
    coinValue: 22,
  },
  {
    name: 'MUSIC - Musicoin',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 184,
  },
  {
    name: 'NAV - Navcoin',
    network: 'navcoin',
    coinValue: 130,
  },
  {
    name: 'NAS - Nebulas',
    network: 'bitcoin',
    coinValue: 2718,
  },
  {
    name: 'NEBL - Neblio',
    network: 'neblio',
    coinValue: 146,
  },
  {
    name: 'NEOS - Neoscoin',
    network: 'neoscoin',
    coinValue: 25,
  },
  {
    name: 'NIX - NIX Platform',
    network: 'nix',
    coinValue: 400,
  },
  {
    name: 'NLG - Gulden',
    network: 'gulden',
    coinValue: 87,
  },
  {
    name: 'NMC - Namecoin',
    network: 'namecoin',
    coinValue: 7,
  },
  {
    name: 'NRG - Energi',
    network: 'energi',
    coinValue: 204,
  },
  {
    name: 'NRO - Neurocoin',
    network: 'neurocoin',
    coinValue: 110,
  },
  {
    name: 'NSR - Nushares',
    network: 'nushares',
    coinValue: 11,
  },
  {
    name: 'NYC - Newyorkc',
    network: 'newyorkc',
    coinValue: 179,
  },
  {
    name: 'NVC - Novacoin',
    network: 'novacoin',
    coinValue: 50,
  },
  {
    name: 'OK - Okcash',
    network: 'okcash',
    coinValue: 69,
  },
  {
    name: 'OMNI - Omnicore',
    network: 'omnicore',
    coinValue: 200,
  },
  {
    name: 'ONION - DeepOnion',
    network: 'deeponion',
    coinValue: 305,
  },
  {
    name: 'ONX - Onixcoin',
    network: 'onixcoin',
    coinValue: 174,
  },
  {
    name: 'PHR - Phore',
    network: 'phore',
    coinValue: 444,
  },
  {
    name: 'PINK - Pinkcoin',
    network: 'pinkcoin',
    coinValue: 117,
  },
  {
    name: 'PIRL - Pirl',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 164,
  },
  {
    name: 'PIVX - PIVX',
    network: 'pivx',
    coinValue: 119,
  },
  {
    name: 'PIVX - PIVX Testnet',
    network: 'pivxtestnet',
    coinValue: 1,
  },
  {
    name: 'POA - Poa',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 178,
  },
  {
    name: 'POSW - POSWcoin',
    network: 'poswcoin',
    coinValue: 47,
  },
  {
    name: 'POT - Potcoin',
    network: 'potcoin',
    coinValue: 81,
  },
  {
    name: 'PPC - Peercoin',
    network: 'peercoin',
    coinValue: 6,
  },
  {
    name: 'PRJ - ProjectCoin',
    network: 'projectcoin',
    coinValue: 533,
  },
  {
    name: 'PSB - Pesobit',
    network: 'pesobit',
    coinValue: 62,
  },
  {
    name: 'PUT - Putincoin',
    network: 'putincoin',
    coinValue: 122,
  },
  {
    name: 'RVN - Ravencoin',
    network: 'ravencoin',
    coinValue: 175,
  },
  {
    name: 'RBY - Rubycoin',
    network: 'rubycoin',
    coinValue: 16,
  },
  {
    name: 'RDD - Reddcoin',
    network: 'reddcoin',
    coinValue: 4,
  },
  {
    name: 'RVR - RevolutionVR',
    network: 'revolutionvr',
    coinValue: 129,
  },
  {
    name: 'SAFE - Safecoin',
    network: 'safecoin',
    coinValue: 19165,
  },
  {
    name: 'SLS - Salus',
    network: 'salus',
    coinValue: 63,
  },
  {
    name: 'SDC - ShadowCash',
    network: 'shadow',
    coinValue: 35,
  },
  {
    name: 'SDC - ShadowCash Testnet',
    network: 'shadowtn',
    coinValue: 1,
  },
  {
    name: 'SLM - Slimcoin',
    network: 'slimcoin',
    coinValue: 63,
  },
  {
    name: 'SLM - Slimcoin Testnet',
    network: 'slimcointn',
    coinValue: 111,
  },
  {
    name: 'SLP - Simple Ledger Protocol',
    network: 'bitcoin',
    // DOM.bitcoinCashAddressTypeContainer.removeClass("hidden");
    coinValue: 245,
  },
  {
    name: 'SLR - Solarcoin',
    network: 'solarcoin',
    coinValue: 58,
  },
  {
    name: 'SMLY - Smileycoin',
    network: 'smileycoin',
    coinValue: 59,
  },
  {
    name: 'STASH - Stash',
    network: 'stash',
    coinValue: 0xc0c0,
  },
  {
    name: 'STASH - Stash Testnet',
    network: 'stashtn',
    coinValue: 0xcafe,
  },
  {
    name: 'STRAT - Stratis',
    network: 'stratis',
    coinValue: 105,
  },
  {
    name: 'TSTRAT - Stratis Testnet',
    network: 'stratistest',
    coinValue: 105,
  },
  {
    name: 'SYS - Syscoin',
    network: 'syscoin',
    coinValue: 57,
  },
  {
    name: 'THC - Hempcoin',
    network: 'hempcoin',
    coinValue: 113,
  },
  {
    name: 'TOA - Toa',
    network: 'toa',
    coinValue: 159,
  },
  {
    name: 'USC - Ultimatesecurecash',
    network: 'ultimatesecurecash',
    coinValue: 112,
  },
  {
    name: 'USNBT - NuBits',
    network: 'nubits',
    coinValue: 12,
  },
  {
    name: 'UNO - Unobtanium',
    network: 'unobtanium',
    coinValue: 92,
  },
  {
    name: 'VASH - Vpncoin',
    network: 'vpncoin',
    coinValue: 33,
  },
  {
    name: 'VIA - Viacoin',
    network: 'viacoin',
    coinValue: 14,
  },
  {
    name: 'VIA - Viacoin Testnet',
    network: 'viacointestnet',
    coinValue: 1,
  },
  {
    name: 'VIVO - Vivo',
    network: 'vivo',
    coinValue: 166,
  },
  {
    name: 'VTC - Vertcoin',
    network: 'vertcoin',
    coinValue: 28,
  },
  {
    name: 'WC - Wincoin',
    network: 'wincoin',
    coinValue: 181,
  },
  {
    name: 'XAX - Artax',
    network: 'artax',
    coinValue: 219,
  },
  {
    name: 'XBC - Bitcoinplus',
    network: 'bitcoinplus',
    coinValue: 65,
  },
  {
    name: 'XMY - Myriadcoin',
    network: 'myriadcoin',
    coinValue: 90,
  },
  {
    name: 'XRP - Ripple',
    network: 'bitcoin',
    coinValue: 144,
  },
  {
    name: 'XVC - Vcash',
    network: 'vcash',
    coinValue: 127,
  },
  {
    name: 'XVG - Verge',
    network: 'verge',
    coinValue: 77,
  },
  {
    name: 'XUEZ - Xuez',
    segwitAvailable: false,
    network: 'xuez',
    coinValue: 225,
  },
  {
    name: 'XWC - Whitecoin',
    network: 'whitecoin',
    coinValue: 155,
  },
  {
    name: 'XZC - Zcoin',
    network: 'zcoin',
    coinValue: 136,
  },
  {
    name: 'ZCL - Zclassic',
    network: 'zclassic',
    coinValue: 147,
  },
  {
    name: 'ZEC - Zcash',
    network: 'zcash',
    coinValue: 133,
  },
  {
    name: 'ZEN - Zencash',
    network: 'zencash',
    coinValue: 121,
  },
  {
    name: 'XLM - Stellar',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 148,
    purposeValue: 44,
    derivationStandard: 'sep5',
    curveName: 'ed25519',
  },
  {
    name: 'ZBC - ZooBlockchain',
    segwitAvailable: false,
    network: 'bitcoin',
    coinValue: 148,
    purposeValue: 44,
    derivationStandard: 'sep5',
    curveName: 'ed25519',
  },
];
