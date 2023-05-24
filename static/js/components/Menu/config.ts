import { MenuEntry } from 'moondoge-uikit'

import TestConfig from "./TestConfig"
import DevConfig from "./DevConfig"
import ProdConfig from "./ProdConfig"

const configMap:{ [key:string] : MenuEntry[]} = {
  "test" : TestConfig,
  "development" : DevConfig,
  "production" : ProdConfig,
}

const config = configMap[process.env.NODE_ENV || 'production']

export default config
