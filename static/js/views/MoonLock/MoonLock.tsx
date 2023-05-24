import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Route, Link as RouteLink, useRouteMatch, useParams, } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import debounce from 'lodash/debounce'
import { Flex, Button, Text, HelpIcon, useMatchBreakpoints, Link, ButtonMenu, ButtonMenuItem, Input, Spinner } from 'moondoge-uikit'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import Page from 'components/layout/Page'
import useQueryParams from 'hooks/useQueryParams'
import { httpGet } from 'utils/httpFetch'
import PageHeader from 'components/PageHeader'
import LockInfo from "./components/LockInfo"
import LockOrManageLiquidity from "./components/LockOrManageLiquidity"
import CountTimeDown from './components/CountTimeDown'

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
const PageBox = styled(Page) <{ isExact: boolean }>`
// background: ${({ theme }) => theme.isDark ? '#201F1E' : 'linear-gradient(180deg, #FFFBF2 0%, #FFE991 100%)'};
  background-image: url('/images/moonx/container-bg.png');
  background-repeat: no-repeat;
  background-position: bottom 50% center;
  background-size: 100%;
  box-shadow:none;
  text-align:center;
  ${props =>
    props.isExact &&
    css`
border-radius: 25px 25px 0px 0px;
    background: ${({ theme }) => theme.isDark ? ' #201F1E;' : 'linear-gradient(180deg, #FEF6E3 0%, #FEC23D 100%);'};
    box-shadow: 0px 4px 12px rgba(59, 41, 9, 0.08);
    `}
`
const ButTextBox = styled(Flex)`
  display:block;
  width:100%;
  margin:10px auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    display:flex;
    width:80%;
    margin:20px auto;
  }
`;

const SearchBox = styled.div`
  text-align:center;
  position: relative;
  width:100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 70%;
  }

`;
const StyledInput = styled(Input)`
  width:100%;
  height: 40px;
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#FEEDC7'} ;
  border: 2px solid #A56A46;
  opacity: 1;
  border-radius: 25px;
  ::-webkit-input-placeholder{
    font-size: 12px;
    font-weight: 400;
    color: #A56A46;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 90%;
    ::-webkit-input-placeholder{
      font-size: 14px;
      font-weight: 400;
      color: #A56A46;
    }
  }
`;
const StyledSearchButton = styled(Button)`
  height: 32px;
  background: #A56A46;
  border-radius: 25px;
  height: 32px;
  font-size: 14px;
  font-family: Roboto;
  font-weight: bold;
  line-height: 8px;
  color: #FFF;
  position: absolute;
  right: 5px;
  top: 3px;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: 68px;
  }
`;
const StyledLockedButton = styled(Button)`
display:block;
width: 100%;
height: 40px;
background: #A56A46;
opacity: 1;
border-radius: 44px;
font-size: 16px;
font-family: Roboto;
font-weight: bold;
line-height: 40px;
margin:10px 0;
color: #FFF;
&:hover{
  color: #FFF;
}
${({ theme }) => theme.mediaQueries.sm} {
  width: 277px;
  margin:0;
}
`;
const TokenContent = styled.div`
  padding-top:33px;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 20px 37px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px 37px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap:10px 10px;
  }
  `;
const TokensCard = styled.div`
  width:100%;
  min-height: 390px;
  border-radius: 25px;
  padding:32px 20px 20px;
  background: ${({ theme }) => theme.isDark ? ' #2D2925' : 'linear-gradient(180deg, #FEF6E3 0%, #FFE063 100%)'} ;
  opacity: 1;
  border-radius: 25px;
  position:relative;
  margin-bottom:10px;
  display:block;
  ${({ theme }) => theme.mediaQueries.sm}{
  width: 380px;
  }
`;
const LockerBox = styled.div`
  padding:18px 0 10px;
  background:${({ theme }) => theme.isDark ? '#201F1E' : '#FFFBF1'};
  border-radius: 15px;
  &:not(:last-of-type){
    margin-bottom:10px;
  }
`;
const StyledLockImg = styled.img`
  width: 31px;
  height: 43px;
  object-fit: contain;
`;
const StyleSpinner = styled.div`
  width: 142px;
  margin: 40px auto;
`;
const MoonLock: React.FC = () => {
  const { path, url, isExact } = useRouteMatch()
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  const { active } = useQueryParams();
  const [activeIndex, setActiveIndex] = useState(active ? Number(active) : 0)
  const [lockedList, setLockedList] = useState([])
  const [loading, setLoading] = useState(false)
  const [keyWords, setKeywords] = useState("")

  const handleClick = (index) => {
    setActiveIndex(index)
  }

  const fetchLockedList = useCallback(async (keywords?: string) => {
    setLoading(true)
    const type = activeIndex ? 2 : 1;
    let fetchUrl = `/locked/list?limit=10000&type=${type}`;
    if (keywords) {
      fetchUrl = `${fetchUrl}&keywords=${keywords}`
    }
    const res: any = await httpGet(fetchUrl)
    if (res?.data?.list) {
      setLockedList(res?.data?.list)
      setLoading(false)
    }
  }, [activeIndex])

  useEffect(() => {
    fetchLockedList()
  }, [fetchLockedList])

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      setKeywords(e.currentTarget.value)
    }
  }
  const handleSearch = debounce(() => {
    fetchLockedList(keyWords)
  }, 800)
  const onSuccess = () => {
    fetchLockedList();
  }
  const renderCardContent = () => {
    return <>
      <ButTextBox justifyContent="space-between" style={{ display: isMobile && 'block' }}>
        <SearchBox>
          <StyledInput placeholder={TranslateString(1351, 'Search by token address, pair address, token name or symbol')} value={keyWords} onChange={(e) => handleInputChange(e)} />
          <StyledSearchButton onClick={handleSearch}>{TranslateString(744, 'Search')}</StyledSearchButton>
        </SearchBox>
        <StyledLockedButton as={RouteLink} to={`${url}/LockOrManageLiquidity`}>{TranslateString(1352, 'LOCK OR MANAGE')}</StyledLockedButton>
      </ButTextBox>
      {activeIndex ? (
        // TOKEN LOCKER
        <TokenContent>
          {
            lockedList.length ? lockedList.map(lock => <TokensCard as={RouteLink} to={`${url}/lockInfo/${lock?.userContractAddress}`}>
              <Text fontSize="22px" bold mb="10px">{lock?.token0}</Text>
              <LockerBox>
                <StyledLockImg src="/images/moonx/locked.png" />
                <Text fontSize="12px" bold color="#A56A46" mt="6px">{TranslateString(1350, 'Token Locker')}</Text>
                <Text fontSize={isMobile ? '18px' : '24px'} bold>
                  <CountTimeDown
                    endTime={lock.startUnlockTime}
                    endTimeUp={() => console.log('timeout')}
                  />
                </Text>
              </LockerBox>
              <LockerBox>

                <Text fontSize="12px" mb="6px">{lock?.token0} {TranslateString(1355, 'Locked')}</Text>
                <Text fontSize={isMobile ? '8px' : '12px'}>{lock?.actualLockNum}</Text>
              </LockerBox>
              <LockerBox>
                <Text fontSize="12px" mb="6px">{TranslateString(1356, 'Token Contract Address')}</Text>
                <Text fontSize={isMobile ? '8px' : '12px'}>{lock?.contractAddress}</Text>
              </LockerBox>
              {/* {lock?.projectUrl ? <LockerBox>
                <Text fontSize="12px" mb="6px">{TranslateString(1357, 'Project URL')}</Text>
                <Link href={lock?.projectUrl}>
                  <Text fontSize={isMobile ? '8px' : '14px'} color="#A56A46">{lock?.projectUrl}</Text>
                </Link>
              </LockerBox> : null} */}
            </TokensCard>) : null
          }
        </TokenContent>) : (
        //  LIQUIDITY LOCKER
        <TokenContent>
          {
            lockedList.length ? lockedList.map((lock) => <TokensCard key={lock.id} as={RouteLink} to={`${url}/lockInfo/${lock?.userContractAddress}`}>
              <Text fontSize="22px" bold mb="10px">{lock?.token0}/{lock?.token1}</Text>
              <LockerBox>
                <StyledLockImg src="/images/moonx/locked.png" />
                <Text fontSize="12px" bold color="#A56A46" mt="6px">{TranslateString(1349, 'Liquidity Locker')}</Text>
                <Text fontSize={isMobile ? '18px' : '24px'} bold>
                  <CountTimeDown
                    endTime={lock.startUnlockTime}
                    endTimeUp={() => console.log('timeout')}
                  />
                </Text>
              </LockerBox>
              <LockerBox>
                <Text fontSize="12px" mb="6px">{TranslateString(1353, 'LP Tokens Locked')}</Text>
                <Text fontSize={isMobile ? '8px' : '12px'}>{lock?.actualLockNum}</Text>
              </LockerBox>
              <LockerBox>
                <Text fontSize="12px" mb="6px">{TranslateString(1354, 'LP contract Address')}</Text>
                <Text fontSize={isMobile ? '8px' : '12px'}>{lock?.contractAddress}</Text>
              </LockerBox>
            </TokensCard>) : null
          }
        </TokenContent>)}
    </>
  }
  return (
    <Box>
      <PageHeader innerBackgroundImg='/images/moonx/lockBg.png'>
        <Flex justifyContent="space-between">
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Text fontSize={isMobile ? '40px' : '50px'} bold>
              {TranslateString(1348, 'MX LOCK')}
            </Text>
            <Text fontSize={isMobile ? '20px' : '24px'} bold>
              {TranslateString(1379, 'Use the MX Lock to lock your tokens or LP tokens, show your faith and earn trust within your communities.')}
            </Text>
          </Flex>
          <Flex>
            <StyledLink color="backgroundAlt" href="https://docs.moondoge.com/products/moonx/mx-lock" external>
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
      <PageBox isExact={isExact}>
        {
          isExact && <>
            <ButtonMenu
              activeIndex={activeIndex}
              onItemClick={handleClick}
              scale="md" variant="subtle">
              <ButtonMenuItem >
                {TranslateString(1349, 'LIQUIDITY LOCKER')}
              </ButtonMenuItem>
              <ButtonMenuItem >
                {TranslateString(1350, 'TOKENS LOCKER')}
              </ButtonMenuItem>
            </ButtonMenu>
            {loading && <StyleSpinner><Spinner /></StyleSpinner>}
            {!loading && renderCardContent()}
            {!loading && !lockedList.length && <Text textAlign="center" fontSize="36px" bold mt="20px">No data</Text>}
          </>
        }
        {/* info */}
        <Route path={`${path}/lockInfo/:id`}>
          <LockInfo path={path} />
        </Route>
        {/* LockOrManageLiquidity */}
        <Route path={`${path}/LockOrManageLiquidity`}>
          <LockOrManageLiquidity path={path} onSuccess={onSuccess} />
        </Route>
      </PageBox>
    </Box>
  )
}

export default MoonLock
