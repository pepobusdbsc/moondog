import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getLotteryContract,
  getLotteryTicketContract,
  getMasterchefContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getClaimRefundContract,
  getTradingCompetitionContract,
  getEasterNftContract,
  getErc721Contract,
  getAirDropContract,
  getSecondAirDropContract,
  getErc20FactoryContract,
  getMarketingErc20Contract,
  getLockFactoryContract,
  getInitializableTimeLockContract,
  getInitializableVestingContract
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getIfoV1Contract(address, web3), [address, web3])
}

export const useIfoV2Contract = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getIfoV2Contract(address, web3), [address, web3])
}

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getErc721Contract(address, web3), [address, web3])
}

export const useCake = () => {
  const web3 = useWeb3()
  return useMemo(() => getCakeContract(web3), [web3])
}

export const useBunnyFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnyFactoryContract(web3), [web3])
}

export const usePancakeRabbits = () => {
  const web3 = useWeb3()
  return useMemo(() => getPancakeRabbitContract(web3), [web3])
}

export const useProfile = () => {
  const web3 = useWeb3()
  return useMemo(() => getProfileContract(web3), [web3])
}

export const useLottery = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryContract(web3), [web3])
}

export const useLotteryTicket = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryTicketContract(web3), [web3])
}

export const useMasterchef = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const useSousChef = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getSouschefContract(id, web3), [id, web3])
}

export const usePointCenterIfoContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getPointCenterIfoContract(web3), [web3])
}

export const useBunnySpecialContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnySpecialContract(web3), [web3])
}

export const useClaimRefundContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getClaimRefundContract(web3), [web3])
}

export const useTradingCompetitionContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getTradingCompetitionContract(web3), [web3])
}

export const useEasterNftContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getEasterNftContract(web3), [web3])
}

export const useGetAirDropContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getAirDropContract(web3), [web3])
}

export const useGetSecondAirDropContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getSecondAirDropContract(web3), [web3])
}

export const useErc20FactoryContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getErc20FactoryContract(web3), [web3])
}

export const useMarketingERC20Contract = (contractAddress) => {
  const web3 = useWeb3()
  return useMemo(() => getMarketingErc20Contract(contractAddress,web3), [contractAddress,web3])
}

export const useLockFactoryContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getLockFactoryContract(web3), [web3])
}

export const useInitializableTimeLockContract = (contractAddress) => {
  const web3 = useWeb3()
  return useMemo(() => getInitializableTimeLockContract(contractAddress,web3), [contractAddress,web3])
}

export const useInitializableVestingContract = (contractAddress) => {
  const web3 = useWeb3()
  return useMemo(() => getInitializableVestingContract(contractAddress,web3), [contractAddress,web3])
}
