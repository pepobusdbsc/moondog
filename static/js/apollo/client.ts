import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

// const subgraphUrl = 'http://graph-node-8000-963457672.us-east-2.elb.amazonaws.com'
// const subgraphUrl = 'http://18.117.103.245:8000'
// 生产环境直接通过url访问
// const subgraphUrl = ''
// 生产环境直接通过url访问
const subgraphUrl = process.env.REACT_APP_GRAPQL

export const client = new ApolloClient({
  link: new HttpLink({
    // uri: `${subgraphUrl}/subgraphs/name/moondogeswap/exchange`,
    uri:'https://graphnode.moondoge.com/subgraphs/name/moondogeswap/exchangetest'
  }),
  cache: new InMemoryCache(),
  // shouldBatch: true,
})

export const healthClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'http://172.26.2.179:8030/graphql',
    uri: 'https://api.thegraph.com/index-node/graphql',
  }),
  cache: new InMemoryCache(),
  // shouldBatch: true,
})

export const blockClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'http://172.26.2.179:8000/subgraphs/name/moondogeswap/blocks',
    // uri: 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks',
    uri: `${subgraphUrl}/subgraphs/name/moondogeswap/blocks0`,
  }),
  cache: new InMemoryCache(),
})
