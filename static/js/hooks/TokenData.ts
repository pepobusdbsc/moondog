/* eslint-disable */
import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { client } from '../apollo/client'
import {
  TOKEN_DATA,
  FILTERED_TRANSACTIONS,
  TOKEN_CHART,
  TOKENS_CURRENT,
  TOKENS_DYNAMIC,
  PRICES_BY_BLOCK,
  PAIR_DATA,
} from '../apollo/queries'

import { useBnbPrice } from './GlobalData'


import {
  get2DayPercentChange,
  getPercentChange,
  getBlockFromTimestamp,
  isAddress,
  getBlocksFromTimestamps,
  splitQuery,
} from '../utils'
import { useLatestBlocks } from './Application'
import { updateNameData } from '../utils/data'

const timeframeOptions = {
  WEEK: '1 week',
  MONTH: '1 month',
  // THREE_MONTHS: '3 months',
  // YEAR: '1 year',
  ALL_TIME: 'All time',
}
const UPDATE = 'UPDATE'
const UPDATE_TOKEN_TXNS = 'UPDATE_TOKEN_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_PRICE_DATA = 'UPDATE_PRICE_DATA'
const UPDATE_TOP_TOKENS = ' UPDATE_TOP_TOKENS'
const UPDATE_ALL_PAIRS = 'UPDATE_ALL_PAIRS'

const TOKEN_PAIRS_KEY = 'TOKEN_PAIRS_KEY'

dayjs.extend(utc)


const getTopTokens = async (bnbPrice, bnbPriceOld) => {
  const utcCurrentTime = dayjs.unix(Math.ceil(Date.now() / 1000))
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
  const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix()
  let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
  let twoDayBlock = await getBlockFromTimestamp(utcTwoDaysBack)

  try {
    let current = await client.query({
      query: TOKENS_CURRENT,
      fetchPolicy: 'cache-first',
    })

    let oneDayResult = await client.query({
      query: TOKENS_DYNAMIC(oneDayBlock),
      fetchPolicy: 'cache-first',
    })

    let twoDayResult = await client.query({
      query: TOKENS_DYNAMIC(twoDayBlock),
      fetchPolicy: 'cache-first',
    })
    let oneDayData = oneDayResult?.data?.tokens.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let twoDayData = twoDayResult?.data?.tokens.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let bulkResults = await Promise.all(
      current &&
        oneDayData &&
        twoDayData &&
        current?.data?.tokens.map(async (token) => {
          let data = token

          // let liquidityDataThisToken = liquidityData?.[token.id]
          let oneDayHistory = oneDayData?.[token.id]
          let twoDayHistory = twoDayData?.[token.id]

          // catch the case where token wasnt in top list in previous days
          if (!oneDayHistory) {
            let oneDayResult = await client.query({
              query: TOKEN_DATA(token.id, oneDayBlock),
              fetchPolicy: 'cache-first',
            })
            oneDayHistory = oneDayResult.data.tokens[0]
          }
          if (!twoDayHistory) {
            let twoDayResult = await client.query({
              query: TOKEN_DATA(token.id, twoDayBlock),
              fetchPolicy: 'cache-first',
            })
            twoDayHistory = twoDayResult.data.tokens[0]
          }
          // calculate percentage changes and daily changes
          const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
            data?.tradeVolumeUSD,
            oneDayHistory?.tradeVolumeUSD ?? 0,
            twoDayHistory?.tradeVolumeUSD ?? 0
          )
          const [oneDayTxns, txnChange] = get2DayPercentChange(
            data.txCount,
            oneDayHistory?.txCount ?? 0,
            twoDayHistory?.txCount ?? 0
          )

          const currentLiquidityUSD = data?.totalLiquidity * bnbPrice * data?.derivedBNB
          const oldLiquidityUSD = oneDayHistory?.totalLiquidity * bnbPriceOld * oneDayHistory?.derivedBNB

          // percent changes
          const priceChangeUSD = getPercentChange(
            data?.derivedBNB * bnbPrice,
            oneDayHistory?.derivedBNB ? oneDayHistory?.derivedBNB * bnbPriceOld : 0
          )
          // set data
          data.priceUSD = data?.derivedBNB * bnbPrice
          data.totalLiquidityUSD = currentLiquidityUSD
          data.oneDayVolumeUSD = parseFloat(`${oneDayVolumeUSD}`)
          data.volumeChangeUSD = volumeChangeUSD
          data.priceChangeUSD = priceChangeUSD
          data.liquidityChangeUSD = getPercentChange(currentLiquidityUSD ?? 0, oldLiquidityUSD ?? 0)
          data.oneDayTxns = oneDayTxns
          data.txnChange = txnChange

          // new tokens
          if (!oneDayHistory && data) {
            data.oneDayVolumeUSD = data.tradeVolumeUSD
            data.oneDayVolumeBNB = data.tradeVolume * data.derivedBNB
            data.oneDayTxns = data.txCount
          }

          // update name data for
          updateNameData({
            token0: data,
          })

          // HOTFIX for Aave
          if (data.id === '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
            const aaveData = await client.query({
              query: PAIR_DATA('0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f'),
              fetchPolicy: 'cache-first',
            })
            const result = aaveData.data.pairs[0]
            data.totalLiquidityUSD = parseFloat(result.reserveUSD) / 2
            data.liquidityChangeUSD = 0
            data.priceChangeUSD = 0
          }

          return data
        })
    )

    return bulkResults

    // calculate percentage changes and daily changes
  } catch (e) {
    console.log(e)
  }
}

const getTokenData = async (address, bnbPrice, bnbPriceOld) => {
  const utcCurrentTime = dayjs.unix(Math.ceil(Date.now() / 1000))
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()
  const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').startOf('minute').unix()
  let oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
  let twoDayBlock = await getBlockFromTimestamp(utcTwoDaysBack)

  // initialize data arrays
  let data:any = {}
  let oneDayData:any = {}
  let twoDayData:any = {}

  try {
    // fetch all current and historical data
    let result = await client.query({
      query: TOKEN_DATA(address),
      fetchPolicy: 'cache-first',
    })
    data = result?.data?.tokens?.[0]

    // get results from 24 hours in past
    let oneDayResult = await client.query({
      query: TOKEN_DATA(address, oneDayBlock),
      fetchPolicy: 'cache-first',
    })
    oneDayData = oneDayResult.data.tokens[0]

    // get results from 48 hours in past
    let twoDayResult = await client.query({
      query: TOKEN_DATA(address, twoDayBlock),
      fetchPolicy: 'cache-first',
    })
    twoDayData = twoDayResult.data.tokens[0]

    // catch the case where token wasnt in top list in previous days
    if (!oneDayData) {
      let oneDayResult = await client.query({
        query: TOKEN_DATA(address, oneDayBlock),
        fetchPolicy: 'cache-first',
      })
      oneDayData = oneDayResult.data.tokens[0]
    }
    if (!twoDayData) {
      let twoDayResult = await client.query({
        query: TOKEN_DATA(address, twoDayBlock),
        fetchPolicy: 'cache-first',
      })
      twoDayData = twoDayResult.data.tokens[0]
    }

    // calculate percentage changes and daily changes
    const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
      data.tradeVolumeUSD,
      oneDayData?.tradeVolumeUSD ?? 0,
      twoDayData?.tradeVolumeUSD ?? 0
    )

    // calculate percentage changes and daily changes
    const [oneDayVolumeUT, volumeChangeUT] = get2DayPercentChange(
      data.untrackedVolumeUSD,
      oneDayData?.untrackedVolumeUSD ?? 0,
      twoDayData?.untrackedVolumeUSD ?? 0
    )

    // calculate percentage changes and daily changes
    const [oneDayTxns, txnChange] = get2DayPercentChange(
      data.txCount,
      oneDayData?.txCount ?? 0,
      twoDayData?.txCount ?? 0
    )

    const priceChangeUSD = getPercentChange(
      data?.derivedBNB * bnbPrice,
      parseFloat(oneDayData?.derivedBNB ?? 0) * bnbPriceOld
    )

    const currentLiquidityUSD = data?.totalLiquidity * bnbPrice * data?.derivedBNB
    const oldLiquidityUSD = oneDayData?.totalLiquidity * bnbPriceOld * oneDayData?.derivedBNB

    // set data
    data.priceUSD = data?.derivedBNB * bnbPrice
    data.totalLiquidityUSD = currentLiquidityUSD
    data.oneDayVolumeUSD = oneDayVolumeUSD
    data.volumeChangeUSD = volumeChangeUSD
    data.priceChangeUSD = priceChangeUSD
    data.oneDayVolumeUT = oneDayVolumeUT
    data.volumeChangeUT = volumeChangeUT
    const liquidityChangeUSD = getPercentChange(currentLiquidityUSD ?? 0, oldLiquidityUSD ?? 0)
    data.liquidityChangeUSD = liquidityChangeUSD
    data.oneDayTxns = oneDayTxns
    data.txnChange = txnChange

    // new tokens
    if (!oneDayData && data) {
      data.oneDayVolumeUSD = data.tradeVolumeUSD
      data.oneDayVolumeBNB = data.tradeVolume * data.derivedBNB
      data.oneDayTxns = data.txCount
    }

    // update name data for
    updateNameData({
      token0: data,
    })

    // HOTFIX for Aave
    if (data.id === '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9') {
      const aaveData = await client.query({
        query: PAIR_DATA('0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f'),
        fetchPolicy: 'cache-first',
      })
      const result = aaveData.data.pairs[0]
      data.totalLiquidityUSD = parseFloat(result.reserveUSD) / 2
      data.liquidityChangeUSD = 0
      data.priceChangeUSD = 0
    }
  } catch (e) {
    console.log(e)
  }
  return data
}

// const getTokenTransactions = async (allPairsFormatted) => {
//   const transactions = {}
//   try {
//     let result = await client.query({
//       query: FILTERED_TRANSACTIONS,
//       variables: {
//         allPairs: allPairsFormatted,
//       },
//       fetchPolicy: 'cache-first',
//     })
//     transactions.mints = result.data.mints
//     transactions.burns = result.data.burns
//     transactions.swaps = result.data.swaps
//   } catch (e) {
//     console.log(e)
//   }
//   return transactions
// }

// const getTokenPairs = async (tokenAddress) => {
//   try {
//     // fetch all current and historical data
//     let result = await client.query({
//       query: TOKEN_DATA(tokenAddress),
//       fetchPolicy: 'cache-first',
//     })
//     return result.data?.['pairs0'].concat(result.data?.['pairs1'])
//   } catch (e) {
//     console.log(e)
//   }
// }

const getIntervalTokenData = async (tokenAddress, startTime, interval = 3600, latestBlock) => {
  const utcEndTime = dayjs.utc()
  let time = startTime

  // create an array of hour start times until we reach current hour
  // buffer by half hour to catch case where graph isnt synced to latest block
  const timestamps = []
  while (time < utcEndTime.unix()) {
    timestamps.push(time)
    time += interval
  }

  // backout if invalid timestamp format
  if (timestamps.length === 0) {
    return []
  }

  // once you have all the timestamps, get the blocks for each timestamp in a bulk query
  let blocks
  try {
    blocks = await getBlocksFromTimestamps(timestamps, 100)

    // catch failing case
    if (!blocks || blocks.length === 0) {
      return []
    }

    if (latestBlock) {
      blocks = blocks.filter((b) => {
        return parseFloat(b.number) <= parseFloat(latestBlock)
      })
    }

    let result = await splitQuery(PRICES_BY_BLOCK, client, [tokenAddress], blocks, 50)

    // format token BNB price results
    let values = []
    for (var row in result) {
      let timestamp = row.split('t')[1]
      let derivedBNB = parseFloat(result[row]?.derivedBNB)
      if (timestamp) {
        values.push({
          timestamp,
          derivedBNB,
        })
      }
    }

    // go through bnb usd prices and assign to original values array
    let index = 0
    for (var brow in result) {
      let timestamp = brow.split('b')[1]
      if (timestamp) {
        values[index].priceUSD = result[brow].bnbPrice * values[index].derivedBNB
        index += 1
      }
    }

    let formattedHistory = []

    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistory.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].priceUSD),
        close: parseFloat(values[i + 1].priceUSD),
      })
    }

    return formattedHistory
  } catch (e) {
    console.log(e)
    console.log('error fetching blocks')
    return []
  }
}

const getTokenChartData = async (tokenAddress) => {
  let data = []
  const utcEndTime = dayjs.utc()
  let utcStartTime = utcEndTime.subtract(1, 'year')
  let startTime = utcStartTime.startOf('minute').unix() - 1

  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      let result = await client.query({
        query: TOKEN_CHART,
        variables: {
          tokenAddr: tokenAddress,
          skip,
        },
        fetchPolicy: 'cache-first',
      })
      if (result.data.tokenDayDatas.length < 1000) {
        allFound = true
      }
      skip += 1000
      data = data.concat(result.data.tokenDayDatas)
    }

    let dayIndexSet = new Set()
    let dayIndexArray = []
    const oneDay = 24 * 60 * 60
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD)
    })

    // fill in empty days
    let timestamp = data[0] && data[0].date ? data[0].date : startTime
    let latestLiquidityUSD = data[0] && data[0].totalLiquidityUSD
    let latestPriceUSD = data[0] && data[0].priceUSD
    let index = 1
    while (timestamp < utcEndTime.startOf('minute').unix() - oneDay) {
      const nextDay = timestamp + oneDay
      let currentDayIndex = (nextDay / oneDay).toFixed(0)
      if (!dayIndexSet.has(currentDayIndex)) {
        data.push({
          date: nextDay,
          dayString: nextDay,
          dailyVolumeUSD: 0,
          priceUSD: latestPriceUSD,
          totalLiquidityUSD: latestLiquidityUSD,
        })
      } else {
        latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD
        latestPriceUSD = dayIndexArray[index].priceUSD
        index = index + 1
      }
      timestamp = nextDay
    }
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log(e)
  }
  return data
}

export function useTokenData(tokenAddress,bnbPrice?:number|string,bnbPriceOld?:number|string) {
  const [tokenData , setTokenData] = useState<any>(null)

  if(!bnbPrice || !bnbPriceOld){
    const [bnbPriceFetch, bnbPriceOldFetch] = useBnbPrice()
    bnbPrice = bnbPriceFetch;
    bnbPriceOld = bnbPriceOldFetch;
  }
  // const [bnbPrice, bnbPriceOld] = useBnbPrice()

  useEffect(() => {
    if (!tokenData && bnbPrice && bnbPriceOld && isAddress(tokenAddress)) {
      getTokenData(tokenAddress, bnbPrice, bnbPriceOld).then((data) => {
        setTokenData({...data,tokenAddress})
      })
    }
  }, [bnbPrice, bnbPriceOld, tokenAddress,])

  return tokenData || {}
}

// export function useTokenTransactions(tokenAddress) {
//   const [state, { updateTokenTxns }] = useTokenDataContext()
//   const tokenTxns = state?.[tokenAddress]?.txns

//   const allPairsFormatted =
//     state[tokenAddress] &&
//     state[tokenAddress].TOKEN_PAIRS_KEY &&
//     state[tokenAddress].TOKEN_PAIRS_KEY.map((pair) => {
//       return pair.id
//     })

//   useEffect(() => {
//     async function checkForTxns() {
//       if (!tokenTxns && allPairsFormatted) {
//         let transactions = await getTokenTransactions(allPairsFormatted)
//         updateTokenTxns(tokenAddress, transactions)
//       }
//     }
//     checkForTxns()
//   }, [tokenTxns, tokenAddress, updateTokenTxns, allPairsFormatted])

//   return tokenTxns || []
// }

// export function useTokenPairs(tokenAddress) {
//   const [state, { updateAllPairs }] = useTokenDataContext()
//   const tokenPairs = state?.[tokenAddress]?.[TOKEN_PAIRS_KEY]

//   useEffect(() => {
//     async function fetchData() {
//       let allPairs = await getTokenPairs(tokenAddress)
//       updateAllPairs(tokenAddress, allPairs)
//     }
//     if (!tokenPairs && isAddress(tokenAddress)) {
//       fetchData()
//     }
//   }, [tokenAddress, tokenPairs, updateAllPairs])

//   return tokenPairs || []
// }

// export function useTokenChartData(tokenAddress) {
//   const [state, { updateChartData }] = useTokenDataContext()
//   const chartData = state?.[tokenAddress]?.chartData
//   useEffect(() => {
//     async function checkForChartData() {
//       if (!chartData) {
//         let data = await getTokenChartData(tokenAddress)
//         updateChartData(tokenAddress, data)
//       }
//     }
//     checkForChartData()
//   }, [chartData, tokenAddress, updateChartData])
//   return chartData
// }

// /**
//  * get candlestick data for a token - saves in context based on the window and the
//  * interval size
//  * @param {*} tokenAddress
//  * @param {*} timeWindow // a preset time window from constant - how far back to look
//  * @param {*} interval  // the chunk size in seconds - default is 1 hour of 3600s
//  */
// export function useTokenPriceData(tokenAddress, timeWindow, interval = 3600) {
//   const [state, { updatePriceData }] = useTokenDataContext()
//   const chartData = state?.[tokenAddress]?.[timeWindow]?.[interval]
//   const [latestBlock] = useLatestBlocks()

//   useEffect(() => {
//     const currentTime = dayjs.utc()
//     const windowSize = timeWindow === timeframeOptions.MONTH ? 'month' : 'week'
//     const startTime =
//       timeWindow === timeframeOptions.ALL_TIME ? 1589760000 : currentTime.subtract(1, windowSize).startOf('hour').unix()

//     async function fetch() {
//       let data = await getIntervalTokenData(tokenAddress, startTime, interval, latestBlock)
//       updatePriceData(tokenAddress, data, timeWindow, interval)
//     }
//     if (!chartData) {
//       fetch()
//     }
//   }, [chartData, interval, timeWindow, tokenAddress, updatePriceData, latestBlock])

//   return chartData
// }

// export function useAllTokenData() {
//   const [state] = useTokenDataContext()
//   return state
// }
