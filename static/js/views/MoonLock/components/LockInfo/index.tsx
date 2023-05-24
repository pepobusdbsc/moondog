import React, { useState, useMemo, useEffect, useCallback } from "react"
import { Link as RouteLink, useParams, useRouteMatch } from 'react-router-dom'
import styled from "styled-components"
import moment from "moment"
import useI18n from 'hooks/useI18n'
import { httpGet } from "utils/httpFetch"
import { Card, Text, ArrowBackIcon, Flex, ButtonMenuItem, Input, Button, useModal, useMatchBreakpoints, useTooltip, HelpIcon, Link, Spinner } from "moondoge-uikit"
import history from 'routerHistory'
import useTheme from "hooks/useTheme"
import CopyToClipboard from "components/CopyToClipboard"
import CountTimeDown from "../CountTimeDown"

const CardBox = styled(Card)`
  margin:0 auto;
  width: 100%;
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#fff'};
  box-shadow: 0px 4px 12px rgba(59, 41, 9, 0.16);
  opacity: 1;
  border-radius: 25px;
  ${({ theme }) => theme.mediaQueries.sm}{
  width: 60%;
  }
`;
const CardTitle = styled(Flex)`
  height:67px;
  border-bottom: 1px solid ${({ theme }) => theme.isDark ? '#A56A46' : '#f0f0f0'};
  box-sizing: border-box;
  align-items: center;
  padding-left: 15px;
`;
const StyledShare = styled.img`
  width:24px;
  height:24px;
  cursor: pointer;
`;
const ContentBox = styled.div`
padding-top:20px;
`;
const TimeBox = styled.div`
padding:28px 20px 13px;
background: ${({ theme }) => theme.isDark ? '#2D2925' : '#FFFBF1'};
border-radius: 15px;
margin:0 30px 20px;
`;
const StyledLockImg = styled.img`
  width: 41px;
  height: 53px;
  object-fit: contain;
`;
const StyleSpinner = styled.div`
  width: 142px;
  margin: 40px auto;
`;
const LockContract = styled(Flex)`
  width:75%;
  word-break: break-all;
  margin-right:10px;
  margin: 0 auto;
`;
const StyledExportImg = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
  margin-left:5px;
  cursor: pointer;
`;
interface IProps {
  path: string;
}

const LockInfo: React.FC<IProps> = ({ path }) => {
  const { id: idStr }: { id: string } = useParams()
  const id = idStr
  const { isDark } = useTheme()
  const TranslateString = useI18n()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  const [info, setInfo] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true)
      const res: any = await httpGet(`/locked/get?userContractAddress=${id}`)
      setInfo(res?.data)
      setLoading(false)
    }
    try {
      fetchInfo()
    } catch {
      setLoading(false)
    }
  }, [id])
  const per = ' (100%) ';
  return <>
    {loading && <StyleSpinner><Spinner /></StyleSpinner>}
    {!loading && info?.id &&
      <CardBox>
        <CardTitle>
          <ArrowBackIcon color="#A56A46" width="24px" onClick={() => history.go(-1)} />
          <Text color="#A56A46" fontSize={isMobile ? '18px' : '24px'} bold style={{ width: '95%', textAlign: 'center' }}>
            {info?.token0}{info?.type === 1 && info?.token1 ? `-${info?.token1}` : ''}
          </Text>
          {/* <StyledShare src="/images/moonx/share.png" /> */}
        </CardTitle>
        <ContentBox>
          <Text color={isDark ? '#777' : '#1A191B'} fontSize="14px" mb="10px">{info?.type === 1 ? TranslateString(1349, 'Liquidity Locker') : TranslateString(1359, 'Lock Tokens')}</Text>
          <TimeBox>
            <StyledLockImg src="/images/moonx/locked.png" />
            <Text fontSize={isMobile ? '18px' : '24px'} bold>
              <CountTimeDown
                endTime={info?.startUnlockTime}
              />
            </Text>
            <Text color={isDark ? '#777' : '#1A191B'} fontSize={isMobile ? '8px' : '14px'}>
              {TranslateString(1368, `Unlock ${info?.type === 2 ? per : ''} Time`, { time: info?.type === 2 ? per : '' })}
              :{moment(info?.startUnlockTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </TimeBox>
          <TimeBox>
            <Flex alignItems="center" justifyContent="space-between" mb="20px">
              <Text fontSize={isMobile ? '8px' : '14px'}>{TranslateString(1381, 'Lock Contract')}</Text>
              <Flex justifyContent="space-between" style={{ width: '70%' }}>
                <Text fontSize={isMobile ? '10px' : '14px'} textAlign="right" style={{ width: '100%', wordBreak: 'break-all' }}>{info?.userContractAddress}</Text>
                <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${info?.userContractAddress}`} color="#A56A46">
                  <StyledExportImg src="/images/moonx/lockerExport.png" />
                </Link>
                <CopyToClipboard toCopy={info?.userContractAddress}><StyledExportImg src="/images/moonx/lockerCopy.png" /></CopyToClipboard>
              </Flex>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between" mb="20px">
              <Text fontSize={isMobile ? '8px' : '14px'}>{TranslateString(1369, 'Amount Locked')}</Text>
              <Text fontSize={isMobile ? '10px' : '14px'} >{info?.actualLockNum}</Text>
            </Flex>
            <Flex alignItems="baseline" justifyContent="space-between" mb="20px">
              <Text fontSize={isMobile ? '8px' : '14px'} textAlign="left">{TranslateString(1383, 'Release To')}</Text>
              <Flex justifyContent="space-between" style={{ width: '70%' }}>
                <Text fontSize={isMobile ? '10px' : '14px'} textAlign="right" style={{ width: '100%', wordBreak: 'break-all' }}>{info?.releaseAddress}</Text>
                <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${info?.releaseAddress}`} color="#A56A46">
                  <StyledExportImg src="/images/moonx/lockerExport.png" />
                </Link>
                <CopyToClipboard toCopy={info?.releaseAddress}><StyledExportImg src="/images/moonx/lockerCopy.png" /></CopyToClipboard>
              </Flex>

            </Flex>
            {
              info?.type === 2 ? <>
                {info?.ascriptionStartTime && <Flex alignItems="center" justifyContent="space-between" mb="20px">
                  <Text fontSize={isMobile ? '8px' : '14px'}>{TranslateString(1377, 'Vesting Start Time')}</Text>
                  <Text fontSize={isMobile ? '10px' : '14px'}>{moment(info?.ascriptionStartTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                </Flex>}
                <Flex alignItems="baseline" justifyContent="space-between" mb="20px">
                  <Text fontSize={isMobile ? '8px' : '14px'} textAlign="left">{TranslateString(1356, 'Token Contract Address')}</Text>
                  <Flex justifyContent="space-between" style={{ width: '70%' }}>
                    <Text fontSize={isMobile ? '10px' : '14px'} textAlign="right" style={{ width: '100%', wordBreak: 'break-all' }}>{info?.contractAddress}</Text>
                    <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${info?.contractAddress}`} color="#A56A46">
                      <StyledExportImg src="/images/moonx/lockerExport.png" />
                    </Link>
                    <CopyToClipboard toCopy={info?.contractAddress}><StyledExportImg src="/images/moonx/lockerCopy.png" /></CopyToClipboard>
                  </Flex>
                </Flex>
                {
                  info?.projectUrl && <Flex alignItems="baseline" justifyContent="space-between" mb="20px">
                    <Text fontSize={isMobile ? '8px' : '14px'} textAlign="left">{TranslateString(1357, 'Project URL')}</Text>
                    <Link href={info?.projectUrl} external>
                      <Text fontSize={isMobile ? '10px' : '14px'} textAlign="right" style={{ wordBreak: 'break-all' }} color="#A56A46">{info?.projectUrl}</Text>
                    </Link>
                  </Flex>
                }
              </> : <Flex alignItems="baseline" justifyContent="space-between" mb="20px">
                <Text fontSize={isMobile ? '8px' : '14px'} textAlign="left">{TranslateString(1362, 'LP Contract Address')}</Text>
                <Flex justifyContent="space-between" style={{ width: '70%' }}>
                  <Text fontSize={isMobile ? '10px' : '14px'} textAlign="right" style={{ width: '100%', wordBreak: 'break-all' }}>{info?.contractAddress}</Text>
                  <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${info?.contractAddress}`} color="#A56A46" >
                    <StyledExportImg src="/images/moonx/lockerExport.png" />
                  </Link>
                  <CopyToClipboard toCopy={info?.contractAddress}><StyledExportImg src="/images/moonx/lockerCopy.png" /></CopyToClipboard>
                </Flex>
              </Flex>
            }
          </TimeBox>
        </ContentBox>
      </CardBox >}
  </>

}
export default LockInfo
