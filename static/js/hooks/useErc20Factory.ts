import { useState, useEffect,useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useErc20FactoryContract, useMarketingERC20Contract } from 'hooks/useContract'
import {
  addYieldExcludeFromReward,
  addTaxExcludeFromFee,
  removeTaxExcludeFromFee,
  removeYieldExcludeFromReward,
  createLiquidityIncreaseERC20,
  createLiquidityMarketingERC20,
  createMintableERC20,
  getCreateFee
} from 'utils/erc20FactoryUtils'
import { getBalanceNumber } from 'utils/formatBalance'
import useRefresh from './useRefresh'

export  const useCreateFee = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const [expectPayBnb, setExpectPayBnb] = useState(0)
  const [valueBnb, setValueBnb] = useState(0)
  const erc20FactoryContract = useErc20FactoryContract();

  useEffect(() => {
    const fetchFee = async () => {
      const bnb = await getCreateFee(erc20FactoryContract);
      setValueBnb(bnb)
      const expectBnb = getBalanceNumber(bnb);
      setExpectPayBnb(expectBnb)
    }
    if (account && erc20FactoryContract ) {
      fetchFee()
    }
  }, [account, erc20FactoryContract, fastRefresh])

  return {expectPayBnb,valueBnb}
}

export const useCreateMintableERC20 = (tokenParameters) => {
  const { account } = useWeb3React()
  const erc20FactoryContract = useErc20FactoryContract();
  const handleCreate = useCallback(
    async () => {
      const txHash = await createMintableERC20(erc20FactoryContract, account,tokenParameters);
      return txHash
    },
    [account,erc20FactoryContract,tokenParameters]
  )

  return { onCreate: handleCreate }
}

export const useCreateLiquidityIncreaseERC20 = (tokenParameters) => {
  const { account } = useWeb3React()
  const erc20FactoryContract = useErc20FactoryContract();
  const handleCreate = useCallback(
    async () => {
      const txHash = await createLiquidityIncreaseERC20(erc20FactoryContract, account,tokenParameters);
      return txHash
    },
    [account,erc20FactoryContract,tokenParameters]
  )

  return { onIncreaseCreate: handleCreate }
}

export const useCreateLiquidityMarketingERC20 = (tokenParameters) => {
  const { account } = useWeb3React()
  const erc20FactoryContract = useErc20FactoryContract();
  const handleCreate = useCallback(
    async () => {
      const txHash = await createLiquidityMarketingERC20(erc20FactoryContract, account,tokenParameters);
      return txHash
    },
    [account,erc20FactoryContract,tokenParameters]
  )

  return { onMarketingCreate: handleCreate }
}

export const useAddYieldWhiteList = ({contract,address}) => {
  const { account } = useWeb3React()
  const marketingERC20Contract = useMarketingERC20Contract(contract);

  const handleAdd = useCallback(
    async () => {
      const txHash = await addYieldExcludeFromReward(account,marketingERC20Contract,address);
      return txHash
    },
    [account,marketingERC20Contract,address]
  )

  return { onAdd: handleAdd }
}

export const useAddTaxWhiteList = ({contract,address}) => {
  const { account } = useWeb3React()
  const marketingERC20Contract = useMarketingERC20Contract(contract);

  const handleAdd = useCallback(
    async () => {
      const txHash = await addTaxExcludeFromFee(account,marketingERC20Contract,address);
      return txHash
    },
    [account,marketingERC20Contract,address]
  )

  return { onTaxAdd: handleAdd }
}

export const useRemoveTaxWhiteList = (contract) => {
  const { account } = useWeb3React()
  const marketingERC20Contract = useMarketingERC20Contract(contract);
  const handleRemove = useCallback(
    async (address) => {
      const txHash = await removeTaxExcludeFromFee(account,marketingERC20Contract,address);
      return txHash
    },
    [account,marketingERC20Contract]
  )

  return { onRemoveTax: handleRemove }
}

export const useRemoveYieldWhiteList = (contract) => {
  const { account } = useWeb3React()
  const marketingERC20Contract = useMarketingERC20Contract(contract);
  const handleRemove = useCallback(
    async (address) => {
      const txHash = await removeYieldExcludeFromReward(account,marketingERC20Contract,address);
      return txHash
    },
    [account,marketingERC20Contract]
  )

  return { onRemoveYield: handleRemove }
}

export default useCreateFee

