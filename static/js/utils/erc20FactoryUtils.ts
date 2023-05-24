/* eslint-disable no-await-in-loop */

const CREATE_ERC20_ROUTE_ADDRESS = process.env.REACT_APP_MOONDOGE_ROUTER
export const getCreateFee = async (erc20FactoryContract) => {
  const fee = await erc20FactoryContract.methods._CREATE_FEE_().call();
  return fee
}

export const  createMintableERC20 = async (erc20FactoryContract, account,{ bnb,totalSupply,cap,name,symbol,decimals}) => {
  return erc20FactoryContract.methods
    .createMintableERC20(totalSupply,cap,name,symbol,decimals)
    .send({ from: account, gas: 10000000,value: bnb })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const  createLiquidityIncreaseERC20 = async (erc20FactoryContract, account,{ bnb,name,symbol,decimals,totalSupply,txFee,lpFee,MAXAMOUNT,SELLMAXAMOUNT},routerAddress = CREATE_ERC20_ROUTE_ADDRESS) => {
  return erc20FactoryContract.methods
    .createLiquidityIncreaseERC20(name,symbol,decimals,totalSupply,txFee,lpFee,MAXAMOUNT,SELLMAXAMOUNT,routerAddress)
    .send({ from: account, gas: 10000000,value: bnb })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const  createLiquidityMarketingERC20 = async (erc20FactoryContract, account,{ bnb,name,symbol,decimals,totalSupply,txFee,lpFee,mFee,MAXAMOUNT,SELLMAXAMOUNT,marketingAddress},routerAddress = CREATE_ERC20_ROUTE_ADDRESS) => {
  return erc20FactoryContract.methods
    .createLiquidityMarketingERC20(name,symbol,decimals,totalSupply,txFee,lpFee,mFee,MAXAMOUNT,SELLMAXAMOUNT,routerAddress,marketingAddress)
    .send({ from: account, gas: 10000000,value: bnb })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

// add yield list whiteList
export const  addYieldExcludeFromReward = async (account,marketingERC20Contract, address) => {
  return marketingERC20Contract.methods
    .excludeFromReward(address)
    .send({ from: account, gas: 1000000})
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
// add tax list whiteList
export const addTaxExcludeFromFee = async (account,marketingERC20Contract, address) => {
  return marketingERC20Contract.methods
    .excludeFromFee(address)
    .send({ from: account, gas: 1000000})
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
// remove tax list whiteList
export const removeTaxExcludeFromFee = async (account,marketingERC20Contract, address) => {
  return marketingERC20Contract.methods
    .includeInFee(address)
    .send({ from: account, gas: 1000000})
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
// remove yield list whiteList
export const removeYieldExcludeFromReward = async (account,marketingERC20Contract, address) => {
  return marketingERC20Contract.methods
    .includeInReward(address)
    .send({ from: account, gas: 1000000})
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}
