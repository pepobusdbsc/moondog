import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getCakeAddress = () => {
  return getAddress(tokens.modo.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getBootCampAddress = () => {
  return getAddress(addresses.bootCamp)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.mulltiCall)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
export const getLotteryAddress = () => {
  return getAddress(addresses.lottery)
}
export const getLotteryTicketAddress = () => {
  return getAddress(addresses.lotteryNFT)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition)
}
export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}
export const getAirDropAddress = () => {
  return getAddress(addresses.airDrop)
}
export const getSecondAirDropAddress = () => {
  return getAddress(addresses.secondAirDrop)
}
export const getErc20FactoryAddress = () => {
  return getAddress(addresses.erc20factory)
}
export const getLockFactoryAddress = () => {
  return getAddress(addresses.lockFactory)
}
export const getInitializableTimeLockAddress = () => {
  return getAddress(addresses.initializableTimeLock)
}
export const getInitializableVestingAddress = () => {
  return getAddress(addresses.initializableVesting)
}

