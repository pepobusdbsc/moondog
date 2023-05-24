import tokens from './tokens97'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'MODO-WBNB LP',
    lpAddresses: {
      // 97: '0xF612ccF014B7A1e53Bd57f00715C2b1af3239D6F',
      // 97: '0xd6bBe2712e1A2Bd79Cfc46E550273bc1b8cC95D4',
      97:'0x7bbe86d45ba08ffb20d056e7bbfd412ba245a4e2',
      56: '0x8195438d073D6f253974c09a45adBd457Cee990f',
    },
    token: tokens.modo,
    quoteToken: tokens.wbnb,
    infoAddress:'https://analytics.moondoge.com/#/pair/0x8195438d073d6f253974c09a45adbd457cee990f',
    lpSymbolAddress: 'https://exchange.moondoge.com/#/add/BNB/0xF9F89Ef3C1B96a662dB5fC9184dBf6ca1416dFe5',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0xF9F89Ef3C1B96a662dB5fC9184dBf6ca1416dFe5',
  },
  // {
  //   pid: 2,
  //   lpSymbol: 'WBNB-BAKE LP',
  //   lpAddresses: {
  //     97: '0x901dbb3c33Ce9efC717165C9F1cE74FDa816A7fF',
  //     56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //   },
  //   token: tokens.wbnb,
  //   quoteToken: tokens.bake,
  // },
  // {
  //   pid: 3,
  //   lpSymbol: 'WBNB-LDC LP',
  //   lpAddresses: {
  //     97: '0xD5F23d57Df618AfB1727A81DB840F1ED4e1DEF5F',
  //     56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //   },
  //   token: tokens.ldc,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 4,
  //   lpSymbol: 'WBNB-MC LP',
  //   lpAddresses: {
  //     97: '0x1653866370ed9ccAaeDA7ac1530F8ED96E626072',
  //     56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //   },
  //   token: tokens.mc,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 5,
  //   lpSymbol: 'WBNB-MoCo LP',
  //   lpAddresses: {
  //     97: '0x93Ff83002Bab0BCB7c6e9D2Fd16d7F47381F42Ca',
  //     56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //   },
  //   token: tokens.moco,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 2,
  //   lpSymbol: 'WBNB-DF LP',
  //   lpAddresses: {
  //     // 97: '0xdf313729F79F9174560f28562e398013cEe8A5C2',
  //     97: '0x7EFCd2781d9c26Fe88fAa676f3D9286574D7662C',
  //     56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //   },
  //   token: tokens.df,
  //   quoteToken: tokens.wbnb,
  //   infoAddress:'https://analytics.moondoge.com/#/pair/0x20f0fff6852d061ba2cfcf701e27f9ab86c97021',
  //   lpSymbolAddress:'https://exchange.moondoge.com/#/add/BNB/0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
  //   addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
  // },
  {
    pid: 2,
    lpSymbol: 'DOGE-WBNB LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0x20F0fFf6852d061Ba2CFCf701E27f9aB86c97021',
    },
    token: tokens.doge,
    quoteToken: tokens.wbnb,
    infoAddress:'https://analytics.moondoge.com/#/pair/0x20f0fff6852d061ba2cfcf701e27f9ab86c97021',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/BNB/0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
  },
  {
    pid: 3,
    lpSymbol: 'WBNB-BUSD LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0x0b15bd663f1233096c15dd7e236895d6f4a81221',
    },
    token: tokens.wbnb,
    quoteToken: tokens.busd,
    infoAddress:'https://analytics.moondoge.com/#/pair/0x0b15bd663f1233096c15dd7e236895d6f4a81221',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/BNB/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  },
  {
    pid: 4,
    lpSymbol: 'DOGE-BUSD LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0x59396cc06fbc5510ce8203ea50005fe43c2d6ca6',
    },
    token: tokens.doge,
    quoteToken: tokens.busd,
    infoAddress:'https://analytics.moondoge.com/#/pair/0x59396cc06fbc5510ce8203ea50005fe43c2d6ca6',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/BNB/0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
  },
  {
    pid: 5,
    lpSymbol: 'MODO-BUSD LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0x42aaaabeb3f749bd3cd5934a30881cfab88d7f94',
    },
    token: tokens.modo,
    quoteToken: tokens.busd,
    infoAddress:'https://analytics.moondoge.com/#/pair/0x42aaaabeb3f749bd3cd5934a30881cfab88d7f94',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/BNB/0xF9F89Ef3C1B96a662dB5fC9184dBf6ca1416dFe5',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0xF9F89Ef3C1B96a662dB5fC9184dBf6ca1416dFe5',
  },
  {
    pid: 6,
    lpSymbol: 'CAKE-DOGE LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0x57f15c1ef9ddc28b1c2f3521c4762f32711dc6bc',
    },
    token: tokens.cake,
    quoteToken: tokens.doge,
    infoAddress:'https://analytics.moondoge.com/#/pair/0x57f15c1ef9ddc28b1c2f3521c4762f32711dc6bc',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/BNB/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
  {
    pid: 7,
    lpSymbol: 'CAKE-MODO LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0xb598fdb04573b08d50dce0cb33a3bdef61f7f875',
    },
    token: tokens.cake,
    quoteToken: tokens.modo,
    infoAddress:'https://analytics.moondoge.com/#/pair/0xb598fdb04573b08d50dce0cb33a3bdef61f7f875',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/BNB/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  },
  {
    pid: 8,
    lpSymbol: 'MODO-DOGE LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0xf8cd13ad7e20f4edbc091c562886c670562c765f',
    },
    token: tokens.modo,
    quoteToken: tokens.doge,
    infoAddress:'https://analytics.moondoge.com/#/pair/0xf8cd13ad7e20f4edbc091c562886c670562c765f',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/BNB/0xF9F89Ef3C1B96a662dB5fC9184dBf6ca1416dFe5',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/BNB/0xF9F89Ef3C1B96a662dB5fC9184dBf6ca1416dFe5',
  },
  {
    pid: 10,
    lpSymbol: 'MODO-VALUE LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0x15859A5DE20EC2f9fAf1524c0A8Be492fe49Bf6b',
    },
    token: tokens.modo,
    quoteToken: tokens.value,
    infoAddress:'https://analytics.moondoge.com/#/pair/0x15859A5DE20EC2f9fAf1524c0A8Be492fe49Bf6b',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/0xc64def48a8a588020469cdd7a227f551129cdcb0/0xf9f89ef3c1b96a662db5fc9184dbf6ca1416dfe5',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/0xc64def48a8a588020469cdd7a227f551129cdcb0/0xf9f89ef3c1b96a662db5fc9184dbf6ca1416dfe5',
  },
  {
    pid: 11,
    lpSymbol: 'WOOL-MASKDOGE LP',
    lpAddresses: {
      97: '0x21b5f4070099e7719f18c8eb722857174e12a8a6',
      56: '0x5c35d4d69eedf5cfefd0841777952485b3131b4b',
    },
    token: tokens.wool,
    quoteToken: tokens.maskDoge,
    infoAddress:'https://analytics.moondoge.com/#/pair/0x5c35d4d69eedf5cfefd0841777952485b3131b4b',
    lpSymbolAddress:'https://exchange.moondoge.com/#/add/0x18ff245c134d9daa6fed977617654490ba4da526/0x998c7216342cf45907626A0D65d41dE88CC1E63b',
    addLiquidityUrl: 'https://exchange.moondoge.com/#/add/0x18ff245c134d9daa6fed977617654490ba4da526/0x998c7216342cf45907626A0D65d41dE88CC1E63b',
  }
  // {
  //   pid: 7,
  //   lpSymbol: 'WBNB-DBN LP',
  //   lpAddresses: {
  //     97: '0xef442bb171776A2161477AADc7d12F3E585370eA',
  //     56: '0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6',
  //   },
  //   token: tokens.mc,
  //   quoteToken: tokens.wbnb,
  // },
  // {
  //   pid: 8,
  //   lpSymbol: 'BUSD-WBNB LP',
  //   lpAddresses: {
  //     97: '0x317605788CFC5Bffff22070a081DC7e7fadd3dda',
  //     56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
  //   },
  //   token: tokens.busd,
  //   quoteToken: tokens.wbnb,
  // },
]

export default farms
