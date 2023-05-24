import React from 'react'
import { useRouteMatch, Link as RouteLink } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { ButtonMenu, ButtonMenuItem, Text, Flex, Button, Link, useMatchBreakpoints } from 'moondoge-uikit'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import UnlockButton from 'components/UnlockButton'

const ButTextBox = styled.div`
  text-align:center;
  margin-bottom:20px;
`;
const TokenCard = styled.div`
  padding:10px 0 20px;
  background: ${({ theme }) => theme.isDark ? '#2D2925' : '#fff'};
  border-radius: 25px;
  width:100%;
  margin-right:0;
  text-align:center;
  height:500px;
  margin-bottom:10px;
  ${({ theme }) => theme.mediaQueries.sm}{
    width:50%;
    margin-right:17px;
  height:500px;
  }
  &:nth-child(1){
    div:not(:first-of-type){
      width:60%;
      margin:0 auto;
      text-align:left;
    }
  }
  div:not(:first-of-type){
    width:80%;
    margin:0 auto;
    text-align:left;
  }
`;
const StyledTokenImg = styled.img`
  width:174px;
  height:174px;
`;

const StyledButton = styled(Button)`
  width: 294px;
  background: linear-gradient(180deg, #DFBC70 0%, #B88513 100%);
  box-shadow: 0px 3px 6px rgba(86, 58, 9, 0.31);
  border-radius: 44px;
  margin-top:30px;
  `;

const TabButtons = () => {
  const { url } = useRouteMatch()
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  return (
    <>
      <ButTextBox>
        <Text fontSize="16px" bold mt="4px">
          {TranslateString(1283, 'Create and manage your tokens without the need of coding skills')}
        </Text>
      </ButTextBox>
      <Flex style={{ display: isMobile ? 'block ' : 'flex' }}>
        <TokenCard>
          <StyledTokenImg src="/images/moonx/standedToken.png" />
          <Text fontSize="16px" bold mb="16px" mt="9px">
            {TranslateString(1284, 'Standard Token')}
          </Text>
          <Text fontSize="14px" lineHeight="2">{TranslateString(1285, '- Basic BEP-20 tokens with standard features')}</Text>
          <Text fontSize="14px" lineHeight="2">{TranslateString(1286, '- Ideal for utility-based projects')}</Text>
          <Text fontSize="14px" lineHeight="2">{TranslateString(1287, '- Similar types of projects:  MODO, CAKE')}</Text>
          {!account ? <UnlockButton mt="8px" width="294px" noIcon margin="65px 0 0" /> :
            <ButtonMenuItem as={RouteLink} to={`${url}/standardToken`}>
              <StyledButton style={{ marginTop: '140px' }}>
                {TranslateString(1294, 'CREATE NOW')}
              </StyledButton>
            </ButtonMenuItem>}
        </TokenCard>
        <TokenCard>
          <StyledTokenImg src="/images/moonx/automaticToken.png" />
          <Text fontSize="16px" bold mb="16px" mt="9px">{TranslateString(1288, 'Reflection Token')}</Text>
          <Text fontSize="14px" textAlign="center" lineHeight="2">{TranslateString(1289, '- Transaction tax imposed to redistribute yield and generate liquidity')}</Text>
          <Text fontSize="14px" textAlign="center" lineHeight="2">{TranslateString(1290, '- Customize fees taken to reward holders')}</Text>
          <Text fontSize="14px" textAlign="center" lineHeight="2">{TranslateString(1291, '- Customize fees allocated to liquidity pool')}</Text>
          <Text fontSize="14px" textAlign="center" lineHeight="2">{TranslateString(1292, '- Whitelist feature')}</Text>
          <Text fontSize="14px" textAlign="center" lineHeight="2">{TranslateString(1293, '- Similar types of projects: SAFEMOON, BABYDOGE')}</Text>
          {!account ? <UnlockButton mt="8px" width="294px" noIcon /> : <ButtonMenuItem as={RouteLink} to={`${url}/automaticToken`}>
            <StyledButton >
              {TranslateString(1294, 'CREATE NOW')}
            </StyledButton>
          </ButtonMenuItem>}
        </TokenCard>
      </Flex>
    </>
  )
}

export default TabButtons
