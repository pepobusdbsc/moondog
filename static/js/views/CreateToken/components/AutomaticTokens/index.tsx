import React, { useState, useMemo, useCallback } from "react"
import { Link as RouteLink, useRouteMatch } from 'react-router-dom'
import styled from "styled-components"
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { Card, Text, ArrowBackIcon, Flex, ButtonMenuItem, Input, Button, useModal, useTooltip, HelpIcon, useMatchBreakpoints } from "moondoge-uikit"
import history from 'routerHistory'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
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
  padding: 0 15px;
`;
const Content = styled.div`
  padding: 20px 30px;
  text-align:left;
`;
const StyledInputWrapper = styled.div`
  padding-top: 12px;
`;
const StyledInputBox = styled.div`
position: relative;
&:after{
  content:"%";
  font-size:18px;
  color:#A56A46;
  position: absolute;
  right:20px;
  top:20px;
}
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

const Divider = styled.div`
  width:100%;
  height: 0px;
  border: 1px dashed #A56A46;
  margin:35px 0;
`;

interface IProps {
  path: string;
  onSuccess?: () => void
}

const AutomaticTokens: React.FC<IProps> = ({ path, onSuccess }) => {
  const { account } = useWeb3React()
  const { url } = useRouteMatch()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  const TranslateString = useI18n()
  const [symbol, setSymbol] = useState("")
  const [name, setName] = useState("")
  const [decimals, setDecimals] = useState("")
  const [totalSupply, setTotalSupply] = useState("")
  const [txFee, setTxFee] = useState("")
  const [lpFee, setLpFee] = useState("")
  const [mFee, setMFee] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [marketingAddress, setMarketingAddress] = useState("")
  const [error, setError] = useState(null)

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
          setDecimals(e.currentTarget.value);
          break;
        case 4:
          setTotalSupply(e.currentTarget.value);
          break;
        case 5:
          setTxFee(e.currentTarget.value);
          break;
        case 6:
          setLpFee(e.currentTarget.value);
          break;
        case 7:
          setMaxAmount(e.currentTarget.value);
          break;
        case 8:
          setMFee(e.currentTarget.value);
          break;
        case 9:
          setMarketingAddress(e.currentTarget.value);
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
    txFee, lpFee, maxAmount, mFee, marketingAddress
  }} onSuccess={handleSuccess} />)

  const HoldersTooltip = () => {
    const { targetRef, tooltip, tooltipVisible } = useTooltip(TranslateString(1313, 'A portion of each transaction volume used to be redistributed to all token holders according to their balances.'), 'top-start')
    return <>
      {tooltipVisible && tooltip}
      <div ref={targetRef}>
        <HelpIcon color="#A56A46" />
      </div></>
  }
  const PoolTooltip = () => {
    const { targetRef, tooltip, tooltipVisible } = useTooltip(TranslateString(1314, 'A portion of each transaction volume used to be added to liquidity pool.'), 'top-start')
    return <>
      {tooltipVisible && tooltip}
      <div ref={targetRef}>
        <HelpIcon color="#A56A46" />
      </div></>
  }

  const AntiTooltip = () => {
    const { targetRef, tooltip, tooltipVisible } = useTooltip(TranslateString(1315, 'Max token amounts for each transaction allowed.'), 'top-start')
    return <>
      {tooltipVisible && tooltip}
      <div ref={targetRef}>
        <HelpIcon color="#A56A46" />
      </div></>
  }

  const TeamTooltip = () => {
    const { targetRef, tooltip, tooltipVisible } = useTooltip(TranslateString(1316, 'A portion of each transaction volume goes to team wallet.'), 'top-start')
    return <>
      {tooltipVisible && tooltip}
      <div ref={targetRef}>
        <HelpIcon color="#A56A46" />
      </div></>
  }
  const btnDisabled = useMemo(() => {
    let disabled = true;
    let finishStandard = false;
    if (symbol && name && decimals && totalSupply && txFee && lpFee && maxAmount) {
      disabled = false;
      finishStandard = true;
    }
    if (finishStandard && ((mFee && !marketingAddress) || (!mFee && marketingAddress))) {
      disabled = true;
    }
    return disabled

  }, [symbol, name, decimals, totalSupply, txFee, lpFee, maxAmount, mFee, marketingAddress])

  // Anti-whale limit：只能输入小于等于总供应量的整数
  const amountMaxLimit = useMemo(() => {
    if (totalSupply) {
      return Number(totalSupply).toFixed(0)
    }
    return 0
  }, [totalSupply])

  const handleSubmit = () => {
    if (marketingAddress) {
      const isValidAddress = Web3.utils.isAddress(marketingAddress);
      if (!isValidAddress) {
        setError(TranslateString(999, 'Please enter a valid team address'))
        return;
      }
    }
    const TransactionFee = Number(txFee) + Number(lpFee);
    const AllFee = Number(txFee) + Number(lpFee) + Number(mFee);
    // 手续费超过100%，请重新设置
    if (TransactionFee > 100 || AllFee > 100) {
      setError(TranslateString(999, 'Service charge exceeds 100%, please reset'))
      return;
    }
    // anti-whale小于总供应量的50%，否则提示：anti-whale过高，建议按照总供应量的0.1%。
    const isWhaleLimit = (Number(totalSupply) / 2) < Number(maxAmount)
    if (isWhaleLimit) {
      setError(TranslateString(999, 'Anti whale is too high. It is recommended to use 0.1% of the total supply'))
      return;
    }
    setError(null)
    onConfirmCreateTokenModal();
  }
  const stopScrollFun = (evt: any) => {
    evt.target.blur();
  }
  return <CardBox>
    <CardTitle>
      <ButtonMenuItem as={RouteLink} to={`${path}`}>
        <ArrowBackIcon color="#A56A46" width="24px" />
      </ButtonMenuItem>
      <Text color="#A56A46" fontSize={isMobile ? '18px' : '24px'} bold style={{ width: '90%', textAlign: 'center' }}>{TranslateString(1331, 'Create Reflection Tokens')}</Text>
    </CardTitle>
    <Content>
      <Text fontSize="20px" bold>{TranslateString(1296, 'Token Parameters')}</Text>
      <StyledInputWrapper>
        <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1299, 'Token Name')}</Text>
        <StyledInput maxLength={32} onChange={(e) => handleInputChange(e, 2)} placeholder="1-32 characters" value={name} />
        <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1297, 'Token Symbol')}</Text>
        <StyledInput maxLength={32} onChange={(e) => handleInputChange(e, 1)} placeholder="1-32 characters" value={symbol} />
        <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1301, 'Token Decimal')}</Text>
        <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} min="1" max="18" onChange={(e) => handleInputChange(e, 3)} placeholder="1-18" value={decimals} />
        <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1302, 'Total Supply')}</Text>
        <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} min="1" max="1000000000000000000" onChange={(e) => handleInputChange(e, 4)} placeholder="1-999,999,999,999,999,999" value={totalSupply} />
        <Divider />
      </StyledInputWrapper>

      <Text fontSize="20px" bold>{TranslateString(1305, 'Transaction Tax Setting')}</Text>
      <StyledInputWrapper>
        <Flex alignItems="center" mt="20px" mb="10px">
          <Text fontSize="14px" bold mr="10px">{TranslateString(1306, ' Transaction fee in % to reward holders')}</Text>
          {HoldersTooltip()}
        </Flex>
        <StyledInputBox>
          <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} min="0" max="100" onChange={(e) => handleInputChange(e, 5)} placeholder="0" value={txFee} />
        </StyledInputBox>
        <Flex alignItems="center" mt="20px" mb="10px">
          <Text fontSize="14px" bold mr="10px">{TranslateString(1307, 'Transaction fee in % to liquidity pool')}</Text>
          {PoolTooltip()}
        </Flex>
        <StyledInputBox>
          <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} min="0" max="100" onChange={(e) => handleInputChange(e, 6)} placeholder="0" value={lpFee} />
        </StyledInputBox>
        <Flex alignItems="center" mt="20px" mb="10px">
          <Text fontSize="14px" bold mr="10px">{TranslateString(1308, 'Anti-whale limit')}</Text>
          {AntiTooltip()}
        </Flex>
        <StyledInput type="number" disabled={!totalSupply} inputMode="numeric" onWheel={stopScrollFun} min="0" max={amountMaxLimit} onChange={(e) => handleInputChange(e, 7)} placeholder="0" value={maxAmount} />
        <Flex alignItems="center" mt="20px" mb="10px">
          <Text fontSize="14px" bold mr="10px">{TranslateString(1309, 'Transaction fee in % to team')} {TranslateString(1310, '(Optional)')}</Text>
          {TeamTooltip()}
        </Flex>
        <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} min="0" max="100" onChange={(e) => handleInputChange(e, 8)} placeholder={`${TranslateString(1311, 'Enter the % to team')}`} value={mFee} />
        <StyledInput type="text" onChange={(e) => handleInputChange(e, 9)} placeholder={`${TranslateString(1312, 'Enter team address')}`} value={marketingAddress} style={{ marginTop: '10px' }} />
      </StyledInputWrapper>
      {error && (
        <Text color="failure" mt="6px" fontSize="14px">
          {error}
        </Text>
      )}
      {!account ? <UnlockButton mt="8px" width="100%" noIcon /> : <StyledButton onClick={handleSubmit} disabled={btnDisabled}>
        {TranslateString(1303, 'SUBMIT')}
      </StyledButton>}
    </Content>
  </CardBox>

}
export default AutomaticTokens
