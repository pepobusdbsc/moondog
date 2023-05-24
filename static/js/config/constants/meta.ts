import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'MoonDogeSwap',
  description:
    'Ready to go to the moon with Dogecoin? Explore MoonDoge, a cheaper and faster DEX based on Binance Smart Chain (BSC) with high yield farming for MODO.',
  image: '',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/competition': {
    title: 'MoonDogeSwap Easter Battle',
    description: 'Register now for the MoonDogeSwap Easter battle!',
    image: '',
  },
}
