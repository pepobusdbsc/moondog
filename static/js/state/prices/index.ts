/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { PriceApiResponse, PriceApiThunk, PriceState } from 'state/types'
import { PriceApiThunk, PriceState, PriceApiResponse } from 'state/types'

import pricesJson from './prices.json'



const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}

// Thunks
export const fetchPrices = createAsyncThunk<any>('prices/fetch', async () => {
  // const response = await fetch('https://api.pancakeswap.info/api/tokens')
  // const response = await fetch('http://172.18.10.18:9899/api/tokens')
  const response = await fetch('https://dqdyh.moondoge.com/api/tokens')
  const data = (await response.json()) as PriceApiResponse
  const fetchTokens = data.data.data;
  const tokens =  Object.assign(fetchTokens, pricesJson.data);
  // const data = pricesJson
  // data.updated_at = Date.now();
  // Return normalized token names
  return {
    updated_at: data.data.updated_at,
    data: Object.keys(tokens).reduce((accum, token) => {
      return {
        ...accum,
        // [token.toLowerCase()]: parseFloat(data.data[token].price),
        [token.toLowerCase()]: parseFloat(tokens[token].price),
      }
    }, {}),
  }
})

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPrices.fulfilled, (state, action: PayloadAction<PriceApiThunk>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.updated_at
      state.data = action.payload.data
    })
  },
})

export default pricesSlice.reducer
