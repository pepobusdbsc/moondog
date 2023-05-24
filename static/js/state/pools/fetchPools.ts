import poolsConfig from 'config/constants/pools97'
// import sousChefABI from 'config/abi/sousChef.json'
import bootCampABI from 'config/abi/bootCamp.json'
import cakeABI from 'config/abi/cake.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    }
  })
  const callsHasCoolingOff = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'hasCoolingOff',
    }
  })
  const starts = await multicall(bootCampABI, callsStartBlock)
  const ends = await multicall(bootCampABI, callsEndBlock)
  const hasCoolingOff = await multicall(bootCampABI, callsHasCoolingOff)

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
      hasCoolingOff:hasCoolingOff? hasCoolingOff[0][0]:false
    }
  })
}

export const fetchPoolsTotalStaking = async () => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')
  const bnbPool = poolsConfig.filter((p) => p.stakingToken.symbol === 'BNB')

  const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const callsBnbPools = bnbPool.map((poolConfig) => {
    return {
      address: getWbnbAddress(),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const nonBnbPoolsTotalStaked = await multicall(cakeABI, callsNonBnbPools)
  const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)

  return [
    ...nonBnbPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
    })),
    ...bnbPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
    })),
  ]
}
