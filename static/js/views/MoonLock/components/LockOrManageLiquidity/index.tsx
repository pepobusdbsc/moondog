import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Link as RouteLink } from 'react-router-dom'
import styled from "styled-components"
import moment from "moment"
import 'antd/dist/antd.css'
import { DatePicker } from 'antd'
import BigNumber from "bignumber.js"
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
// import { DatePicker as MobileDatePicker } from 'antd-mobile'
import 'antd-mobile/dist/antd-mobile.css';
import { Card, Text, ArrowBackIcon, Flex, ButtonMenuItem, Input, Button, useMatchBreakpoints, ButtonMenu, AutoRenewIcon, ToastContainer, Link, Spinner } from "moondoge-uikit"
import history from 'routerHistory'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import useWeb3 from 'hooks/useWeb3'
import { getLpContract } from "utils/contractHelpers"
import { httpGet, httpPost } from "utils/httpFetch"
import { useCreateTimeLock, useApproveLock, useLockCreateFee, useCreateTokenTimeLock, useWithdraw } from "hooks/useLockFactory"
import UnlockButton from 'components/UnlockButton'
import CopyToClipboard from "components/CopyToClipboard"
import { isUrl } from "utils"
import { getLockFactoryAddress } from "utils/addressHelpers"
import ManageLockers from "./ManageLockers"

const CardBox = styled(Card)`
  margin:0 auto;
  width: 100%;
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#fff'};
  box-shadow: 0px 4px 12px rgba(59, 41, 9, 0.16);
  opacity: 1;
  border-radius: 25px;
  ${({ theme }) => theme.mediaQueries.sm}{
    width: 75%;
    }
`;
const ManageBox = styled.div`
  margin:20px auto 0;
  width: 100%;
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#fff'};
  box-shadow: 0px 4px 12px rgba(59, 41, 9, 0.16);
  opacity: 1;
  border-radius: 25px;
  padding:28px 30px;
  ${({ theme }) => theme.mediaQueries.sm}{
    width: 75%;
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

const StyledButtonMenu = styled.div`
  width:90%;
`;
const StyledTimeBox = styled(Flex)`
flex-wrap: wrap;

`;
const StyledTimeItem = styled.div<{ active: boolean }>`
width: 120px;
height: 60px;
background:  ${({ active }) => active ? '#A56A46' : '#FBFAF6'};
border-radius: 10px;
font-size: 18px;
font-family: Roboto;
font-weight: 400;
color: ${({ active }) => active ? '#fff' : '#1A191B'};
text-align:center;
line-height:60px;
cursor: pointer;
margin-bottom:6px;
  &:not(:last-of-type){
    margin-right:10px;
  }
`;
const StyledCustomTime = styled.div`
position: relative;
`;
const StyledCustomDay = styled(Text)`
  font-size: 18px;
  font-family: Roboto;
  font-weight: 400;
  position: absolute;
  right: 10px;
  top: 16px;
`;
const StyledInputTime = styled.div`
position: relative;
.ant-picker{
  position: absolute;
  right: 10px;
  top: 14px;
  width:44px;
}
.ant-picker{
  input{
    opacity:0;
  }
  span{
    margin-left:0;
  }
}
.ant-picker:hover, .ant-picker-focused {
  border-color: #A56A46;
  border-right-width: 1px !important;
}
.ant-picker-focused{
  box-shadow:none
}
`;
const StyleSpinner = styled.div`
  width: 142px;
  margin: 40px auto;
`;

interface IProps {
  path: string;
  onSuccess?: () => void
}

const AutomaticTokens: React.FC<IProps> = ({ path, onSuccess }) => {
  const { account } = useWeb3React()
  const { isDark } = useTheme()
  const web3 = useWeb3()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  const TranslateString = useI18n()
  const [activeIndex, setActiveIndex] = useState(0)
  const { expectPayBnb, valueBnb } = useLockCreateFee()
  const [lockToken, setLockToken] = useState("")
  const [lockAmount, setLockAmount] = useState("")
  const [error, setError] = useState(null)
  const [activePeriod, setActivePeriod] = useState<string | number>(1)
  const [days, setDays] = useState("")
  const [startTime, setStartTime] = useState("")
  const [projectUrl, setProjectUrl] = useState("")
  const [beneficiary, setBeneficiary] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)
  const [toasts, setToasts] = useState([]);
  const [lockersList, setLockersList] = useState([])
  const [loading, setLoading] = useState(false)
  // const [visibleDatePicker, setVisibleDatePicker] = useState(true)

  const [allowance, setAllowance] = useState(new BigNumber(0))
  // lock 授权
  const { onApprove } = useApproveLock()

  const handleRemove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id));
  };

  const handleClick = (index) => {
    setActivePeriod(1)
    setDays("")
    setLockToken("")
    setLockAmount("")
    setAllowance(new BigNumber(0))
    setStartTime("")
    setProjectUrl("")
    setActiveIndex(index)
  }

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>, type: number) => {
    if (e.currentTarget.validity.valid) {
      switch (type) {
        case 1:
          setLockToken(e.currentTarget.value);
          break;
        case 2:
          setActivePeriod("")
          setDays(e.currentTarget.value);
          break;
        case 3:
          setLockAmount(e.currentTarget.value);
          break;
        case 4:
          setStartTime(e.currentTarget.value);
          break;
        case 5:
          setProjectUrl(e.currentTarget.value);
          break;
        case 6:
          setBeneficiary(e.currentTarget.value);
          break;
        default:
          return null
      }
    }
    return null
  }

  const handleSuccess = useCallback((address) => {
    window.location.href = `${window.location.origin}/#/moonLock/lockInfo/${address}`
    // history.go(-1)
    // onSuccess()
  }, [])

  const btnDisabled = useMemo(() => {
    let disabled = true;
    if (!activeIndex) {
      if (lockAmount && lockToken && (activePeriod || days) && beneficiary) {
        disabled = false;
      }
    }
    if (activeIndex) {
      if (lockAmount && lockToken && (activePeriod || days) && startTime && beneficiary) {
        disabled = false;
      }
    }
    return disabled

  }, [lockAmount, lockToken, activePeriod, days, activeIndex, startTime, beneficiary])

  const stopScrollFun = (evt: any) => {
    evt.target.blur();
  }

  const { onCreate } = useCreateTimeLock()

  const { onCreateTokenLock } = useCreateTokenTimeLock()

  const { onWithdraw } = useWithdraw()

  const getAllowance = useCallback(async () => {
    const LpContract = getLpContract(lockToken, web3)
    const res = await LpContract.methods.allowance(account, getLockFactoryAddress()).call()
    setAllowance(new BigNumber(res))
  }, [lockToken, web3, account])

  useEffect(() => {
    if (lockToken) {
      const isValidAddress = Web3.utils.isAddress(lockToken);
      if (!isValidAddress) {
        setAllowance(new BigNumber(0))
        return;
      }
      setError(null)
      getAllowance()
    }
  }, [lockToken, account, web3, getAllowance])

  const fetchMyLockers = useCallback(async () => {
    setLoading(true)
    // const type = activeIndex ? 2 : 1;
    const res: any = await httpGet(`/locked/list?limit=10000&userAddress=${account}`)
    if (res?.data?.list) {
      setLockersList(res?.data?.list)
    }
    setLoading(false)
  }, [account])

  useEffect(() => {
    fetchMyLockers()
  }, [fetchMyLockers])
  const isApproved = useMemo(() => {
    return account && allowance && allowance.isGreaterThan(0)
  }, [account, allowance])

  const handleApprove = async () => {
    if (lockToken) {
      const isValidAddress = Web3.utils.isAddress(lockToken);
      if (!isValidAddress) {
        setError('Please enter a valid contract address')
        return;
      }
    }
    setError(null)
    setIsConfirming(true)
    const LpContract = getLpContract(lockToken, web3)
    const approveTxh = await onApprove(LpContract)
    if (approveTxh) {
      getAllowance();
    }
    setIsConfirming(false)
  }
  // const isAddress = (address) => {
  //   // check if it has the basic requirements of an address
  //   if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
  //     return false
  //     // If it's ALL lowercase or ALL upppercase
  //   } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
  //     return true;
  //     // Otherwise check each case
  //   }
  // };
  const durationPeriod = useMemo(() => {
    let seconds = 0;
    if (activePeriod === 1) {
      seconds = 3 * 2626560 // 7879680
      return seconds
    }
    if (activePeriod === 2) {
      seconds = 6 * 2626560 // 15759360
      return seconds
    }
    if (activePeriod === 3) {
      seconds = 31536000 // 31536000
      return seconds
    }
    if (days) {
      seconds = 86400 * Number(days)
      return seconds
    }
    return seconds
  }, [activePeriod, days])
  const handleSubmit = async () => {
    if (lockToken) {
      const isValidAddress = Web3.utils.isAddress(lockToken);
      if (!isValidAddress) {
        setError(TranslateString(999, 'Please enter a valid contract address'))
        return;
      }
    }
    if (!days && !activePeriod) {
      setError(TranslateString(999, 'Please select or enter a lock period'))
      return;
    }
    if (beneficiary) {
      const isValidBeneficiary = Web3.utils.isAddress(beneficiary);
      if (!isValidBeneficiary) {
        setError(TranslateString(999, 'Please enter a valid release address'))
        return;
      }
    }
    if (activeIndex && !startTime) {
      setError(TranslateString(999, 'Please select start time'))
      return;
    }
    if (projectUrl) {
      const validUrl = isUrl(projectUrl)
      if (!validUrl) {
        setError(TranslateString(999, 'Please enter a valid projectUrl'))
        return;
      }
    }
    setError(null)
    const momentDays = activeIndex && startTime ? moment(startTime) : moment();
    const lockTime = moment(unlockTime).diff(momentDays.format("YYYY-MM-DD HH:mm:ss"), 'days')

    try {
      setIsConfirming(true)
      const LpContract = getLpContract(lockToken, web3)
      // 先授权 approve
      // const approveTxh = await onApprove(LpContract)
      // 获取左右币
      let token0Symbol = '';
      let token1Symbol = '';
      let tokenDecimals = 0;
      // 获取token0地址/symbol
      try {
        const token0Address = (await LpContract.methods.token0().call()).toLowerCase()
        const token0Contract = getLpContract(token0Address, web3)
        const symbol0 = await token0Contract.methods.symbol().call()
        token0Symbol = symbol0;
      } catch (e) {
        const symbol0 = await LpContract.methods.symbol().call()
        token0Symbol = symbol0;
      }
      // 获取token1地址/symbol
      try {
        const token1Address = (await LpContract.methods.token1().call()).toLowerCase()
        const token1Contract = getLpContract(token1Address, web3)
        const symbol1 = await token1Contract.methods.symbol().call()
        token1Symbol = symbol1;
      } catch (e) {
        const symbol1 = await LpContract.methods.symbol().call()
        token1Symbol = symbol1;
      }
      // 获取lp精度
      try {
        const lpDecimals = await LpContract.methods.decimals().call()
        tokenDecimals = lpDecimals;
      } catch (e) {
        console.log(e, 'lp decimal error')
      }
      let params: any = {}
      const lockAmountDecimal = new BigNumber(lockAmount).times(new BigNumber(10).pow(tokenDecimals)).toString();
      if (!activeIndex) {
        // lp lock
        params = {
          bnb: Number(valueBnb),
          lockToken,
          lockAmount: lockAmountDecimal,
          beneficiary: account,
          releaseTime: moment(unlockTime).unix()
        }
      } else {
        // token lock
        // const duration = moment(unlockTime).diff(moment(startTime).format("YYYY-MM-DD HH:mm:ss"), 'seconds')
        params = {
          bnb: Number(valueBnb),
          lockToken,
          lockAmount: lockAmountDecimal,
          beneficiary: account,
          start: moment(startTime).unix(),
          cliffDuration: 0,
          duration: durationPeriod,
          revocable: false
        }
      }
      // 执行lock合约
      let txh;
      if (activeIndex) {
        txh = await onCreateTokenLock(params)
      } else {
        txh = await onCreate(params);
      }
      if (!txh) {
        setIsConfirming(false)
        return
      }
      const { events = {} } = txh;
      let userContractAddress = "";
      if (events?.NewLock?.returnValues?.locker) {
        userContractAddress = events?.NewLock?.returnValues?.locker;
      }
      // const startUnlockTime = activeIndex ? params.start : params.releaseTime
      // const startUnlockTime = activeIndex ? moment(startTime).valueOf() : moment(unlockTime).valueOf();
      const startUnlockTime = moment(unlockTime).valueOf();
      const ascriptionStartTime = moment(startTime).valueOf();
      const response: any = await httpPost('/locked/create', {
        userAddress: account,
        lockTime,
        type: activeIndex ? 2 : 1,
        lockNum: Number(lockAmount),
        contractAddress: lockToken,
        token0: token0Symbol,
        token1: token1Symbol,
        startUnlockTime,
        userContractAddress, // 锁仓合约地址
        releaseAddress: beneficiary, // 释放地址
        projectUrl,
        ascriptionStartTime: activeIndex && ascriptionStartTime,
      })
      if (response?.code === 0) {
        setIsConfirming(false)
        handleSuccess(userContractAddress)
      }
      if (response?.code === -1) {
        setIsConfirming(false)
        const now = Date.now();
        const randomToast = {
          id: `id-${now}`,
          title: `Error`,
          description: response?.msg,
          type: "danger",
        };
        setToasts((prevToasts) => [randomToast, ...prevToasts]);
      }
    } catch (err) {
      console.log(err)
      setIsConfirming(false)
    }
  }
  const unlockTime = useMemo(() => {
    let time = "";
    if (!startTime) {
      time = moment().format("YYYY-MM-DD HH:mm:ss");
    } else {
      time = moment(startTime).format("YYYY-MM-DD HH:mm:ss")
    }
    let date = moment(time).format("YYYY-MM-DD HH:mm:ss")
    if (!activePeriod && days) {
      date = moment(time).add(days, 'days').format("YYYY-MM-DD HH:mm:ss");
    }
    if (activePeriod === 1) {
      date = moment(time).add(3, 'months').format("YYYY-MM-DD HH:mm:ss");
    }
    if (activePeriod === 2) {
      date = moment(time).add(6, 'months').format("YYYY-MM-DD HH:mm:ss");
    }
    if (activePeriod === 3) {
      date = moment(time).add(1, 'years').format("YYYY-MM-DD HH:mm:ss");
    }
    // const date = moment().add(2, 'minutes').format("YYYY-MM-DD HH:mm:ss")
    return date

  }, [activePeriod, days, startTime])
  const handleWithdraw = async (type: number, contractAddress: string) => {
    const txh = await onWithdraw(type, contractAddress)
    if (txh) {
      fetchMyLockers();
    }
    return txh
  }
  const renderApprovalOrLockButton = () => {
    return <StyledButton
      onClick={isApproved ? handleSubmit : handleApprove}
      disabled={isApproved ? btnDisabled : !lockToken}
      isLoading={isConfirming}
      endIcon={isConfirming ? <AutoRenewIcon color="currentColor" spin /> : null}
      style={{ width: isMobile && '100%' }}
    >
      {isApproved ? TranslateString(1370, 'LOCK') : TranslateString(758, 'Approve Contract')}
    </StyledButton>
  }
  const handleClickMonths = (type: number) => {
    setDays("")
    setActivePeriod(type)
  }
  const renderLockLp = () => {
    return (
      <Content>
        <Text fontSize="14px" mb="15px">{TranslateString(1360, 'Release when the lock period is due')}</Text>
        <Text fontSize="20px" bold>{TranslateString(1361, 'Pair Parameters')}</Text>
        <StyledInputWrapper>
          <Text fontSize="14px" bold mb="10px">{TranslateString(1362, 'LP Contract')}</Text>
          <StyledInput onChange={(e) => handleInputChange(e, 1)} placeholder={TranslateString(1363, 'Enter LP contract address')} value={lockToken} />
          <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1364, 'Duration')}</Text>
          <StyledTimeBox>
            <StyledTimeItem onClick={() => handleClickMonths(1)} active={activePeriod === 1}>3 {TranslateString(1365, 'months')}</StyledTimeItem>
            <StyledTimeItem onClick={() => handleClickMonths(2)} active={activePeriod === 2}>6 {TranslateString(1365, 'months')}</StyledTimeItem>
            <StyledTimeItem onClick={() => handleClickMonths(3)} active={activePeriod === 3}>1 {TranslateString(1366, 'year')}</StyledTimeItem>
            <StyledCustomTime>
              <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} max="2000" onFocus={() => setActivePeriod(null)} onChange={(e) => handleInputChange(e, 2)} placeholder={TranslateString(1269, 'Custom')} value={days} />
              <StyledCustomDay>{TranslateString(1367, 'days')}</StyledCustomDay>
            </StyledCustomTime>
          </StyledTimeBox>
          <Text fontSize="14px" bold color="#A56A46" mt="10px">{TranslateString(1385, 'All unlock time', { time: '' })}: {unlockTime}</Text>
          <Text fontSize="14px" bold mb="10px" mt="10px">{TranslateString(1369, 'Lock Amount')}</Text>
          <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} min="1" max="1000000000000000000" onChange={(e) => handleInputChange(e, 3)} placeholder="1-999,999,999,999,999,999" value={lockAmount} />
          <Text fontSize="14px" bold mb="10px" mt="10px">{TranslateString(1383, 'Release To')}</Text>
          <StyledInput onChange={(e) => handleInputChange(e, 6)} placeholder={TranslateString(1384, 'Enter your address')} value={beneficiary} />
        </StyledInputWrapper>
        {error && (
          <Text color="failure" mt="6px" fontSize="14px">
            {error}
          </Text>
        )}
        {!account ? <UnlockButton mt="8px" width="100%" noIcon /> :
          renderApprovalOrLockButton()
        }
        <Text color="#A56A46" fontSize="14px" textAlign="center" mt="20px">
          {TranslateString(1371, `Estimated fee: ${expectPayBnb} BNB`, { bnb: expectPayBnb })}
        </Text>
      </Content>
    )
  }
  const renderLockTokens = () => {
    return (
      <Content>
        <Text fontSize="14px" mb="15px">{TranslateString(1380, 'Vesting, release gradually over the period')}</Text>
        <Text fontSize="20px" bold>{TranslateString(1296, 'Token Parameters')}</Text>
        <StyledInputWrapper>
          <Text fontSize="14px" bold mb="10px">{TranslateString(1356, 'Token Contract Address')}</Text>
          <StyledInput onChange={(e) => handleInputChange(e, 1)} placeholder="Enter token address" value={lockToken} />
          <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1377, 'Vesting Start Time')}</Text>
          <StyledInputTime>
            <DatePicker showTime onChange={(date: any) => {
              if (!date) {
                setStartTime("")
              } else {
                setStartTime(moment(date).format('YYYY-MM-DD HH:mm:ss'))
              }
            }} />
            <StyledInput readOnly onChange={(e) => handleInputChange(e, 4)} placeholder="" value={startTime} />
          </StyledInputTime>
          <Text fontSize="14px" bold mb="10px" mt="20px">{TranslateString(1364, 'Duration')}</Text>
          <StyledTimeBox>
            <StyledTimeItem onClick={() => setActivePeriod(1)} active={activePeriod === 1}>3 {TranslateString(1365, 'months')}</StyledTimeItem>
            <StyledTimeItem onClick={() => setActivePeriod(2)} active={activePeriod === 2}>6 {TranslateString(1365, 'months')}</StyledTimeItem>
            <StyledTimeItem onClick={() => setActivePeriod(3)} active={activePeriod === 3}>1 {TranslateString(1366, 'year')}</StyledTimeItem>
            <StyledCustomTime>
              <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} onFocus={() => setActivePeriod(null)} onChange={(e) => handleInputChange(e, 2)} placeholder={TranslateString(1269, 'Custom')} value={days} />
              <StyledCustomDay>{TranslateString(1367, 'days')}</StyledCustomDay>
            </StyledCustomTime>
          </StyledTimeBox>
          {startTime && <Text fontSize="14px" bold color="#A56A46" mt="10px">{TranslateString(1385, 'All unlock time', { time: '' })}: {unlockTime}</Text>}
          <Text fontSize="14px" bold mb="10px" mt="10px">{TranslateString(1369, 'Token Amount')}</Text>
          <StyledInput type="number" inputMode="numeric" onWheel={stopScrollFun} min="1" max="1000000000000000000" onChange={(e) => handleInputChange(e, 3)} placeholder="1-999,999,999,999,999,999" value={lockAmount} />
          <Text fontSize="14px" bold mb="10px" mt="10px">{TranslateString(1383, 'Release To')}</Text>
          <StyledInput onChange={(e) => handleInputChange(e, 6)} placeholder={TranslateString(1384, 'Enter the release to')} value={beneficiary} />
          <Text fontSize="14px" bold mb="10px" mt="10px">{TranslateString(1357, 'Project URL')} {TranslateString(1310, '(Optional)')}</Text>
          <StyledInput onChange={(e) => handleInputChange(e, 5)} placeholder="" value={projectUrl} />
        </StyledInputWrapper>
        {error && (
          <Text color="failure" mt="6px" fontSize="14px">
            {error}
          </Text>
        )}
        {!account ? <UnlockButton mt="8px" width="100%" noIcon /> : renderApprovalOrLockButton()}
        <Text color="#A56A46" fontSize="14px" textAlign="center" mt="20px">{TranslateString(1371, `Estimated fee: ${expectPayBnb} BNB`, { bnb: expectPayBnb })}</Text>
      </Content>
    )
  }
  return <><CardBox>
    <CardTitle>
      <ButtonMenuItem as={RouteLink} to={`${path}`}>
        <ArrowBackIcon color="#A56A46" width="24px" />
      </ButtonMenuItem>
      <StyledButtonMenu>
        <ButtonMenu
          activeIndex={activeIndex}
          onItemClick={handleClick}
          scale="md" variant="subtle">
          <ButtonMenuItem >
            {TranslateString(1358, 'Lock LP')}
          </ButtonMenuItem>
          <ButtonMenuItem >
            {TranslateString(1359, ' Lock Tokens')}
          </ButtonMenuItem>
        </ButtonMenu>
      </StyledButtonMenu>
    </CardTitle>
    {activeIndex ? renderLockTokens() : renderLockLp()}
    <ToastContainer toasts={toasts} onRemove={handleRemove} />
  </CardBox>
    <ManageBox>
      <Text fontSize="20px" bold textAlign="left" mb="20px">{TranslateString(1372, 'Manage My Lockers')}</Text>
      {loading && <StyleSpinner><Spinner /></StyleSpinner>}
      {!loading && (lockersList.length ? <ManageLockers lockersList={lockersList} handleWithdraw={handleWithdraw} /> : <Text textAlign="center" fontSize="36px" bold mt="20px">No locker</Text>)}
    </ManageBox>
  </>
}
export default AutomaticTokens
