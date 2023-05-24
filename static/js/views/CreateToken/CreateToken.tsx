import React, { useMemo, useState } from 'react'
import { Route, Link as RouteLink, useRouteMatch, useParams, } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Flex, Button, Text, HelpIcon, useMatchBreakpoints, Link, ButtonMenu, ButtonMenuItem } from 'moondoge-uikit'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import Page from 'components/layout/Page'
import useQueryParams from 'hooks/useQueryParams'
import PageHeader from 'components/PageHeader'
import TabButtons from './components/TabButtons'
import StandardTokens from "./components/StandardTokens"
import AutomaticTokens from "./components/AutomaticTokens"
import ManageTokens from './components/ManageTokens'

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
    background: ${({ theme }) => theme.isDark ? '#201F1E' : 'linear-gradient(180deg, #FFFBF2 0%, #FFE991 100%)'};
    box-shadow: 0px 4px 12px rgba(59, 41, 9, 0.08);
    border-radius: 25px;
    `}
`

const CreateTokens: React.FC = () => {
  const { path, url, isExact } = useRouteMatch()
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  const { active } = useQueryParams();
  const [activeIndex, setActiveIndex] = useState(active ? Number(active) : 0)

  const handleClick = (index) => {
    setActiveIndex(index)
  }

  return (
    <Box>
      <PageHeader innerBackgroundImg={isDark ? '/images/lottary/lottaryDark.png' : '/images/lottary/lottaryLight.png'}>
        <Flex justifyContent="space-between">
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Text color="#1A191B" fontSize={isMobile ? '40px' : '50px'} bold>
              {TranslateString(1281, 'MX Mint ')}
            </Text>
            <Text color="1A191B" fontSize={isMobile ? '20px' : '24px'} bold>
              {TranslateString(1282, 'Create and Manage Tokens')}
            </Text>
          </Flex>
          <Flex>
            <StyledLink color="backgroundAlt" href="https://docs.moondoge.com/products/moonx/mx-mint" external>
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
                {TranslateString(1317, 'Create Tokens')}
              </ButtonMenuItem>
              <ButtonMenuItem >
                {TranslateString(1318, 'Manage Tokens')}
              </ButtonMenuItem>
            </ButtonMenu>
            {!activeIndex && <TabButtons />}
          </>
        }
        {
          activeIndex ? <ManageTokens /> : <>
            <Route path={`${path}/standardToken`}>
              <StandardTokens path={path} onSuccess={() => setActiveIndex(1)} />
            </Route>
            <Route path={`${path}/automaticToken`}>
              <AutomaticTokens path={path} onSuccess={() => setActiveIndex(1)} />
            </Route>
          </>
        }
      </PageBox>
    </Box>
  )
}

export default CreateTokens
