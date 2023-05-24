import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import farmsConfig from 'config/constants/farms97'

const fetchFarms = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAddress = getAddress(farmConfig.lpAddresses)
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.token.address),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAddress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.token.address),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'decimals',
        },
      ]

      const [
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls)
      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(18))
        .times(new BigNumber(2))
        .times(lpTokenRatio)
      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
      const quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio)
      // console.log('lpSymbol', farmConfig.lpSymbol)
      // console.log('quoteTokenAmount', new BigNumber(tokenBalanceLP).toNumber())
      // console.log(farmConfig)
      // console.log('tokenAmount', quoteTokenAmount.div(tokenAmount).toJSON())
      const [info, totalAllocPoint] = await multicall(masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
      const liquidityResponse = await fetch(`https://dqdyh.moondoge.com/api/singleTvl?lpAddress=${lpAddress}`)
      const responseData = await liquidityResponse.json()
      const totalLiquidity = new BigNumber(responseData?.data?.single_value_locked_all || 0)

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        // multiplier: `${allocPoint.div(100).toString()}X`,
        multiplier: `${allocPoint.div(new BigNumber(totalAllocPoint).toNumber()).times(18).times(10).toFixed(2).toString()}X`,
        totalLiquidity
      }
    }),
  )
  return data
}

export default fetchFarms
