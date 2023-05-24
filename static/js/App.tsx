import React, { useEffect, lazy } from 'react'
import { Router, Redirect, Route, Switch, HashRouter } from 'react-router-dom'
import { ResetCSS } from 'moondoge-uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { useFetchPriceList, useFetchProfile, useFetchPublicData } from 'state/hooks'
import GACookieTip from './components/GACookieTip'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
// import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
// import EasterEgg from './components/EasterEgg'
import Pools from './views/Pools'
import CreateToken from './views/CreateToken'
import MoonLock from './views/MoonLock'
import WhiteListManagement from './views/CreateToken/WhiteListManagement'
// import history from './routerHistory'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const Lottery = lazy(() => import('./views/Lottery'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
// const Collectibles = lazy(() => import('./views/Collectibles'))
// const Teams = lazy(() => import('./views/Teams'))
// const Team = lazy(() => import('./views/Teams/Team'))
const Profile = lazy(() => import('./views/Profile'))
// const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
const ComingSoon = lazy(() => import('./views/ComingSoon'))
const HomeInfo = lazy(() => import('./views/Home/HomeInfo'))
const Whitepaper = lazy(() => import('./components/Whitepaper'))

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null
  }, [])

  useEagerConnect()
  useFetchPublicData()
  useFetchProfile()
  useFetchPriceList()

  return (
    <HashRouter>
      <ResetCSS />
      <GlobalStyle />
      <GACookieTip />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/homeinfo">
              <HomeInfo />
            </Route>
            <Route path="/exchange">
              {/* <Farms /> */}
              <ComingSoon />
            </Route>
            <Route path="/yield">
              <Farms />
              {/* <ComingSoon /> */}
            </Route>
            <Route path="/stake">
              <Pools />
              {/* <ComingSoon /> */}
            </Route>
            <Route path="/createToken">
              <CreateToken />
              {/* <ComingSoon /> */}
            </Route>
            <Route path="/moonLock">
              <MoonLock />
            </Route>
            <Route path="/whiteList/:id">
              <WhiteListManagement />
            </Route>
            <Route path="/raffle">
              <Lottery />
              {/* <ComingSoon /> */}
            </Route>
            <Route path="/profile">
              <Profile />
              {/* <ComingSoon /> */}
            </Route>
            <Route path="/analytics">
              {/* <Profile /> */}
              <ComingSoon />
            </Route>
            <Route path="/whitepaper">
              {/* <Profile /> */}
              <Whitepaper />
            </Route>
            {/* <Route path="/ifo">
              <Ifos />
            </Route>
            <Route path="/collectibles">
              <Collectibles />
            </Route>
            <Route exact path="/teams">
              <Teams />
            </Route>
            <Route path="/teams/:id">
              <Team />
            </Route>

            <Route path="/competition">
              <TradingCompetition />
            </Route> */}
            {/* Redirect */}
            {/* <Route path="/staking">
              <Redirect to="/pools" />
            </Route>
            <Route path="/syrup">
              <Redirect to="/pools" />
            </Route>
            <Route path="/nft">
              <Redirect to="/collectibles" />
            </Route> */}
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      {/* <EasterEgg iterations={2} />
      <ToastListener /> */}
    </HashRouter>
  )
}

export default React.memo(App)
