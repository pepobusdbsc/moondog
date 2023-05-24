/* eslint-disable no-await-in-loop */
import { ethers } from 'ethers'

export const getLockCreateFee = async (lockFactoryContract) => {
  const fee = await lockFactoryContract.methods._CREATE_FEE_().call();
  return fee
}

export const  createTimeLock = async (lockFactoryContract, account,{ bnb, lockToken,lockAmount,beneficiary,releaseTime}) => {
  return lockFactoryContract.methods
    .createTimeLock(lockToken,lockAmount,beneficiary,releaseTime)
    .send({ from: account, gas: 10000000,value: bnb })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
export const createTokenTimeLock = async (lockFactoryContract, account,{ bnb, lockToken,lockAmount,beneficiary,start,cliffDuration,duration,revocable}) => {
  return lockFactoryContract.methods
    .createVesting(lockToken,lockAmount,beneficiary,start,cliffDuration,duration,revocable)
    .send({ from: account, gas: 10000000,value: bnb })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
export const approveLock = async (lpContract, lockFactoryContract, account) => {
  return lpContract.methods
    .approve(lockFactoryContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
// lock withdraw
export const lockReleaseMax = async (initialContract,account) => {
  return initialContract.methods
    .releaseMax()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
