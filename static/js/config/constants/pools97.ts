import tokens from './tokens97'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 0,
    stakingToken: tokens.modo,
    earningToken: tokens.modo,
    contractAddress: {
      // 97: '0xedbcbcb34f9c7ff49e8d336ad9f517e194599bc6',
      // 97 :'0xBd43F415a70B8a2b726Da537c0824B5A219d3c0c',
      97:'0xC1B6994466b1689AB06898f07F3330613C0938e2',
      56: '0x10f60aF5585169B506847A191B12f364846aa69b',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '2',
    sortOrder: 1,
    isFinished: false,
    hasCoolingOff: false
  },
  {
    sousId: 7,
    stakingToken: tokens.modo,
    earningToken: tokens.value,
    contractAddress: {
      97: '0x79dac49e1dba4cedc907f934dd2cdeadbb9b7ee7',
      56: '0xc8aa8a92168d57a92fa02ae7e7d054f2516e832f',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '5',
    sortOrder: 1,
    isFinished: false,
    projectSiteUrl: 'https://www.valuetoken.net/',
    hasCoolingOff: true
  },
  // {
  //   sousId: 7,
  //   stakingToken: tokens.modo,
  //   earningToken: tokens.ldc,
  //   contractAddress: {
  //     // 97: '0xedbcbcb34f9c7ff49e8d336ad9f517e194599bc6',
  //     // 97 :'0xBd43F415a70B8a2b726Da537c0824B5A219d3c0c',
  //     97:'0xcab6f389bc4ff677103356296a4b5f99a662abcc',
  //     56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  // }
]

export default pools
