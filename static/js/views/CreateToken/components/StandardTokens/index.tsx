import React, { useState, useMemo, useEffect, useCallback } from "react"
import { Link as RouteLink, useRouteMatch } from 'react-router-dom'
import styled from "styled-components"
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { Card, Text, ArrowBackIcon, Flex, ButtonMenuItem, Input, Button, useModal, useMatchBreakpoints, useTooltip, HelpIcon } from "moondoge-uikit"
import history from 'routerHistory'
import UnlockButton from "components/UnlockButton"
import ConfirmCreateTokenModal from "./ConfirmCreateTokenModal"

const CardBox = styled(Card)`
  margin:0 auto;
  width: 100%;
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#fff'};
  box-shadow: 0px 4px 12px rgba(59, 41, 9, 0.16);
  opacity: 1;
  border-radius: 25px;
  ${({ theme }) => theme.mediaQueries.sm}{
  width: 50%;
  }
`;
const CardTitle = styled(Flex)`
  height:67px;
  border-bottom: 1px solid ${({ theme }) => theme.isDark ? '#A56A46' : '#f0f0f0'};
  box-sizing: border-box;
  align-items: center;
  padding-left: 15px;
`;
const Content = styled.div`
  padding: 20px 30px;
  text-align:left;
`;
const StyledInputWrapper = styled.div`
  padding-top: 12px;
`;
const StyledInput = styled(Input)`
  height: 60px;
  background: ${({ theme }) => theme.isDark ? '#2d2a25' : '#FBFAF6'};
  opacity: 1;
  border-radius: 10px;
`;
const StyledButton = styled(Button)`
  width: 294px;
  height: 60px;
  display: block;
  background: linear-gradient(180deg, #DFBC70 0%, #B88513 100%);
  box-shadow: 0px 3px 6px rgba(86, 58, 9, 0.31);
  border-radius: 44px;
  margin: 20px auto 0;
`;
interface IProps {
  path: string;
  onSuccess?: () => void
}

const StandardTokens: React.FC<IProps> = ({ path, onSuccess }) => {
  const { account } = useWeb3React()
  const { url } = useRouteMatch()
  const TranslateString = useI18n()
  const [symbol, setSymbol] = useState("")
  const [name, setName] = useState("")
  const [decimals, setDecimal] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [cap, setCap] = useState("")
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  const TotalSupplyTooltip = () => {
    const { targetRef, tooltip, tooltipVisible } = useTooltip(TranslateString(1345, 'The total amount of tokens minted at start'), 'top-start')
    return <>
      {tooltipVisible && tooltip}
      <div ref={targetRef}>
        <HelpIcon color="#A56A46" />
      </div></>
  }
  const MaxSupplyTooltip = () => {
    const { targetRef, tooltip, tooltipVisible } = useTooltip(TranslateString(1346, 'The max amount of tokens that will ever exist'), 'top-start')
    return <>
      {tooltipVisible && tooltip}
      <div ref={targetRef}>
        <HelpIcon color="#A56A46" />
      </div></>
  }
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>, type: number) => {
    if (e.currentTarget.validity.valid) {
      switch (type) {
        case 1:
          setSymbol(e.currentTarget.value);
          break;
        case 2:
          setName(e.currentTarget.value);
          break;
        case 3:
          setDecimal(e.currentTarget.value);
          break;
        case 4:
          setTotalSupply(e.currentTarget.value);
          break;
        case 5:
          setCap(e.currentTarget.value);
          break;
        default:
          return null
      }
    }
    return null
  }
  const handleSuccess = useCallback(() => {
    history.go(-1)
    onSuccess()
  }, [onSuccess])

  const [onConfirmCreateTokenModal] = useModal(<ConfirmCreateTokenModal tokenParameters={{
    symbol,
    name,
    decimals,
    totalSupply,
    cap
  }} onSuccess={handleSuccess} />)

  const buttonDisabled = useMemo(() => {
    let disabled = true
    if (symbol && name && decimals && totalSupply && cap) {
      const isCapLimit = Number(cap) >= Number(totalSupply) && Number(cap) <= 99999999999999999;
      if (isCapLimit) {
        disabled = false
      }
    }
    return disabled

  }, [symbol, name, decimals, totalSupply, cap])
  const stopScrollFun = (evt: any) => {
    evt.target.blur();
  }

  return <CardBox>
    <CardTitle>
      <ButtonMenuItem as={RouteLink} to={`${path}`}>
        <ArrowBackIcon color="#A56A46" width="24px" />
      </ButtonMenuItem>
      <Text color="#A56A46" fontSize={isMobile ? '18px' : '24px'} bold style={{ width: '95%', textAlign: 'center' }}>
        {TranslateString(1295, 'Create standard tokens')}</Text>
    </CardTitle>
    <Content>
      <Text fontSize="20px" bold>{TranslateString(1296, 'Token Parameters')}</Text>
      <StyledInputWrapper>
        <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1299, 'Token Name')}</Text>
        <StyledInput maxLength={32} onChange={(e) => handleInputChange(e, 2)} placeholder={TranslateString(1300, '1-32 characters')} value={name} />
        <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1297, 'Token Symbol')}</Text>
        <StyledInput maxLength={32} onChange={(e) => handleInputChange(e, 1)} placeholder={TranslateString(1298, '1-32 characters')} value={symbol} />
        <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1301, 'Token Decimal')}</Text>
        <StyledInput type="number" inputMode="numeric" min="1" max="18" onWheel={stopScrollFun} onChange={(e) => handleInputChange(e, 3)} placeholder="1-18" value={decimals} />
        <Flex alignItems="center" mt="20px" mb="10px">
          <Text fontSize="14px" bold mr="10px">{TranslateString(1302, 'Total Supply')}</Text>
          {TotalSupplyTooltip()}
        </Flex>
        <StyledInput type="number" inputMode="numeric" min="1" max="99999999999999999" onWheel={stopScrollFun} onChange={(e) => handleInputChange(e, 4)} placeholder="1-999,999,999,999,999,999" value={totalSupply} />
        <Flex alignItems="center" mt="20px" mb="10px">
          <Text fontSize="14px" bold mr="10px">{TranslateString(1332, 'Max Supply')}</Text>
          {MaxSupplyTooltip()}
        </Flex>
        <StyledInput type="number" min="1" max="99999999999999999" onWheel={stopScrollFun} disabled={!totalSupply} onChange={(e) => handleInputChange(e, 5)} placeholder="1-999,999,999,999,999,999" value={cap} />
      </StyledInputWrapper>
      {!account ? <UnlockButton mt="8px" width="100%" noIcon /> :
        <StyledButton onClick={onConfirmCreateTokenModal} disabled={buttonDisabled}>
          {TranslateString(1303, 'SUBMIT')}
        </StyledButton>}
    </Content>
  </CardBox>

}
export default StandardTokens
