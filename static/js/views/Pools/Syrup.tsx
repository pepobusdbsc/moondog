import React, { useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Flex, Button, Text, HelpIcon, Link, useMatchBreakpoints } from 'moondoge-uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import usePersistState from 'hooks/usePersistState'
import { usePools, useBlock } from 'state/hooks'
import PageHeader from 'components/PageHeader'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import Coming from './components/Coming'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
// import Divider from './components/Divider'

const ButtonText = styled(Text)`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`
const StyledLink = styled(Link)`
  display: inline;
  height: fit-content;
`
const Box = styled.div`
  padding-top:20px;
  background:${({ theme }) => theme.isDark ? '#110F06' : '#fff'};
`;
const PageBox = styled(Page)`
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#fff'};
  box-shadow: 0px 4px 12px rgba(59, 41, 9, 0.08);
  border-radius: 20px;
`

const Syrup: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const pools = usePools(account)
  const { currentBlock } = useBlock()
  const { isDark } = useTheme()
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;

  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || currentBlock > pool.endBlock),
    [currentBlock, pools],
  )
  // const stakedOnlyPools = useMemo(
  //   () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
  //   [openPools],
  // )
  const stakedOnlyPools = useMemo(
    () => openPools.filter((pool) => pool.userData),
    [openPools],
  )

  return (
    <Box>
      <PageHeader innerBackgroundImg={isDark ? '/images/lottary/lottaryDark.png' : '/images/lottary/lottaryLight.png'}>
        <Flex justifyContent="space-between">
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Text color="#1A191B" fontSize={isMobile ? '40px' : '50px'} bold>
              {TranslateString(1213, 'Moon Pools')}
            </Text>
            <Text color="1A191B" fontSize={isMobile ? '20px' : '24px'} bold>
              {TranslateString(1214, 'Stake Tokens to Earn More Tokens')}
              {/* .High APR, low risk. */}
            </Text>

          </Flex>
          <Flex>
            <StyledLink color="backgroundAlt" href="https://docs.moondoge.com/products/staking" external>
              <Button px={['14px', null, null, null, '24px']} variant="subtle" style={{
                border: '2px solid #A56A46',
                background: 'linear-gradient(180deg, #FEF6E3 0%, #FEC23D 100%)',
                borderRadius: '25px',
              }}>
                <ButtonText color="primary" fontSize="16px" bold>
                  {TranslateString(1215, 'Help')}
                </ButtonText>
                <HelpIcon color="primary" ml={[null, null, null, 0, '6px']} widths="16px" />
              </Button>
            </StyledLink>
          </Flex>
        </Flex>
      </PageHeader>
      <PoolTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
      {/* <Divider /> */}
      <PageBox>
        <FlexLayout>
          <Route exact path={`${path}`}>
            <>
              {stakedOnly
                ? orderBy(stakedOnlyPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)
                : orderBy(openPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)}
              <Coming />
            </>
          </Route>
          <Route path={`${path}/history`}>
            {orderBy(finishedPools, ['sortOrder']).map((pool) => (
              <PoolCard key={pool.sousId} pool={pool} />
            ))}
          </Route>
        </FlexLayout>
      </PageBox>
    </Box>
  )
}

export default Syrup
