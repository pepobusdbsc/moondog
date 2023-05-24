import { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import BigNumber from 'bignumber.js'
import { useLockFactoryContract } from 'hooks/useContract'
import { getBalanceNumber } from 'utils/formatBalance'
import { approveLock, createTimeLock, createTokenTimeLock, getLockCreateFee, lockReleaseMax } from 'utils/lockFactoryUtils'
import { getInitializableTimeLockContract, getInitializableVestingContract } from 'utils/contractHelpers'
import useRefresh from './useRefresh'
import useWeb3 from './useWeb3'

export  const useLockCreateFee = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const [expectPayBnb, setExpectPayBnb] = useState(0)
  const [valueBnb, setValueBnb] = useState(0)
  const lockFactoryContract = useLockFactoryContract();

  useEffect(() => {
    const fetchFee = async () => {
      const bnb = await getLockCreateFee(lockFactoryContract);
      setValueBnb(bnb)
      const expectBnb = getBalanceNumber(bnb);
      setExpectPayBnb(expectBnb)
    }
    if (account && lockFactoryContract ) {
      fetchFee()
    }
  }, [account, lockFactoryContract, fastRefresh])

  return {expectPayBnb,valueBnb}
}

export const useCreateTimeLock = () => {
  const { account } = useWeb3React()
  const lockFactoryContract = useLockFactoryContract();

  const handleCreate = useCallback(
    async (tokenParameters) => {
      const txHash = await createTimeLock(lockFactoryContract, account,tokenParameters);
      return txHash
    },
    [account,lockFactoryContract]
  )

  return { onCreate: handleCreate }
}
export const useCreateTokenTimeLock = () => {
  const { account } = useWeb3React()
  const lockFactoryContract = useLockFactoryContract();

  const handleCreate = useCallback(
    async (tokenParameters) => {
      const txHash = await createTokenTimeLock(lockFactoryContract, account,tokenParameters);
      return txHash
    },
    [account,lockFactoryContract]
  )

  return { onCreateTokenLock: handleCreate }
}

// Approve a lock
export const useApproveLock = () => {
  const { account } = useWeb3React()
  const lockFactoryContract = useLockFactoryContract();

  const handleApprove = useCallback(async (lpContract: Contract) => {
    try {
      const tx = await approveLock(lpContract, lockFactoryContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lockFactoryContract])

  return { onApprove: handleApprove }
}
// withdraw
export const useWithdraw = () => {
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const handleWithdraw = useCallback(async (type: number,contractAddress:string) => {
    try {
      let typeContract:any = "";
      if(type === 1){
        typeContract = getInitializableTimeLockContract(contractAddress,web3)
      }else{
        typeContract = getInitializableVestingContract(contractAddress,web3)
      }
      const tx = await lockReleaseMax(typeContract,account)
      return tx
    } catch (e) {
      return false
    }
  }, [account,web3])

  return { onWithdraw: handleWithdraw }
}
export default useLockCreateFee

