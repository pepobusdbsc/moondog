import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Toggle, Text, Flex } from 'moondoge-uikit'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'

const StyleFlex = styled(Flex)`
   max-width: 1200px;
   margin:20px auto 30px;
   padding:10px;
   ${({ theme }) => theme.mediaQueries.sm} {
     padding:0
  }
`;
const PoolTabButtons = ({ stakedOnly, setStakedOnly }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()
  return (
    <StyleFlex>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`} >
          {TranslateString(1198, 'Live')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {TranslateString(388, 'Finished')}
        </ButtonMenuItem>
      </ButtonMenu>
      <Flex ml="24px" justifyContent="center" alignItems="center">
        <Text mr="9px" color={`${stakedOnly ? 'primary' : 'textDisabled'}`} fontSize="14px" bold>
          {TranslateString(1116, 'Staked only')}
        </Text>
        <Toggle scale="sm" checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />

      </Flex>
    </StyleFlex>
  )
}

export default PoolTabButtons
