import React, { useState } from "react"
import { Link as RouteLink, useParams, useRouteMatch } from 'react-router-dom'
import styled from "styled-components"
import moment from "moment"
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { Text, Flex, Button, useMatchBreakpoints, Link, Spinner, AutoRenewIcon } from "moondoge-uikit"
// import history from 'routerHistory'
import useTheme from "hooks/useTheme"
import CopyToClipboard from "components/CopyToClipboard"

const StyledExportImg = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
  margin-left:15px;
  cursor: pointer;
  ${({ theme }) => theme.mediaQueries.sm}{
    margin-left:5px;

  }
`;
const LockersContent = styled(Flex)`
width: 100%;
min-height: 190px;
background: ${({ theme }) => theme.isDark ? '#2D2925' : '#fff'};
border: 1px solid ${({ theme }) => theme.isDark ? '#483F2B' : '#eee'};
border-radius: 10px;
padding:20px 10px;
margin-bottom:20px;
display:block;
${({ theme }) => theme.mediaQueries.sm}{
  display:flex;
}
`;
const Left = styled.div`
  width:100%;
  text-align:left;
  margin-bottom:10px;
  ${({ theme }) => theme.mediaQueries.sm}{
    width:70%;
    margin-bottom:0;
  }
`;
const Right = styled.div`
width:100%;
height: 165px;
background: ${({ theme }) => theme.isDark ? '#201F1E' : '#FBFAF6'} ;
border-radius: 10px;
padding-top:24px;
${({ theme }) => theme.mediaQueries.sm}{
  width:30%;
}
`;
const LockerTitleBox = styled(Flex)`
margin-bottom:10px;
`;
const StyleImgBox = styled.div`
  width:60px;
  position: relative;
  margin-right:17px;
`;
const StyledTokenImg = styled.img`
  width:36px;
  height:36px;
  &:last-of-type{
    position: absolute;
    // left: 25px;
    top: 0;
  }
`;
const TitleBox = styled.div`

`;
const ViewContent = styled(Flex)`
min-width:66px;
padding:0 8px;
height: 26px;
border: 1px solid #bbb;
border-radius: 14px;
align-item:center;
cursor: pointer;
&:hover{
border: 1px solid #A56A46;
svg{
  fill:#A56A46;
}
a{
  color:#A56A46 !important;
}
}
`;
const StyledButton = styled(Button)`
width: 80%;
height: 36px;
background: linear-gradient(180deg, #DFBC70 0%, #B88513 100%);
opacity: 1;
border-radius: 25px;
margin:10px auto 0;
box-shadow:none;
font-size:12px;
font-weight:bold;
`
interface IProps {
  lockersList: any[];
  handleWithdraw: (type: number, contractAddress: string) => void
}

const ManageLockers: React.FC<IProps> = ({ lockersList, handleWithdraw }) => {
  const TranslateString = useI18n()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  // const [loading, setLoading] = useState(false)
  const { isDark } = useTheme()
  const [pendingTx, setPendingTx] = useState("")

  const handleClick = async (lock) => {
    setPendingTx(lock.id)
    await handleWithdraw(lock?.type, lock?.userContractAddress)
    setPendingTx("")
  }

  return <>
    {/* {loading && <StyleSpinner><Spinner /></StyleSpinner>} */}
    {
      lockersList?.length ? lockersList.map(lock => <LockersContent key={lock.id}>
        <Left>
          <LockerTitleBox>
            <StyleImgBox>
              <StyledTokenImg src="/images/moonx/token0.png" />
              {lock?.type === 1 && <StyledTokenImg src="/images/moonx/token1.png" style={{ left: '25px' }} />}
            </StyleImgBox>
            <TitleBox>
              <Flex alignItems="center">
                <Text fontSize={isMobile ? '10px' : '16px'} bold mr="10px">{lock?.token0}
                  {lock?.type === 1 && lock?.token1 ? `-${lock?.token1}` : ''}</Text>
                <ViewContent>
                  {/* <VisibilityOn color="#bbb" width="16px" /> */}
                  <Text fontSize="12px" ml="4px" lineHeight="2" color="#bbb" as={RouteLink} to={`/moonLock/lockInfo/${lock?.userContractAddress}`}>{TranslateString(1042, 'View more')}</Text>
                </ViewContent>
              </Flex>
              {/* {lock?.userContractAddress && <Flex justifyContent="space-between">
                <Text fontSize={isMobile ? '8px' : '12px'} bold style={{ width: '100%', wordBreak: 'break-all' }} mr="10px" color={isDark ? '#777' : '#272318'}>
                  {isMobile ? `${lock?.userContractAddress.substring(0, 6)}...${lock?.userContractAddress.substring(lock?.userContractAddress.length - 4)}` : lock?.userContractAddress}
                </Text>
                <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${lock?.userContractAddress}`} color="#A56A46">
                  <StyledExportImg src="/images/moonx/lockerExport.png" />
                </Link>
                <CopyToClipboard toCopy={lock?.userContractAddress}><StyledExportImg src="/images/moonx/lockerCopy.png" /></CopyToClipboard>
              </Flex>} */}
            </TitleBox>
          </LockerTitleBox>
          {lock?.userContractAddress && <Flex alignItems="center" mb="10px" pt="10px">
            <Text fontSize={isMobile ? '8px' : '12px'} style={{ width: isMobile ? '38%' : '35%', wordBreak: 'break-word' }}>{TranslateString(1381, 'Lock Contract')}:</Text>
            <Flex justifyContent="space-between" >
              <Text fontSize={isMobile ? '8px' : '12px'} textAlign="right" style={{ width: '100%', wordBreak: 'break-all' }} mr="10px">
                {isMobile ? `${lock?.userContractAddress.substring(0, 6)}...${lock?.userContractAddress.substring(lock?.userContractAddress.length - 4)}` : lock?.userContractAddress}
              </Text>
              <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${lock?.userContractAddress}`} color="#A56A46">
                <StyledExportImg src="/images/moonx/lockerExport.png" />
              </Link>
              <CopyToClipboard toCopy={lock?.userContractAddress}><StyledExportImg src="/images/moonx/lockerCopy.png" /></CopyToClipboard>
            </Flex>
          </Flex>}
          <Flex alignItems="center" mb="10px">
            <Text fontSize={isMobile ? '8px' : '12px'} style={{ width: isMobile ? '38%' : '35%', wordBreak: 'break-word' }}>{TranslateString(1373, 'LP/token Contract')}:</Text>
            <Flex justifyContent="space-between">
              <Text fontSize={isMobile ? '8px' : '12px'} textAlign="right" style={{ width: '100%', wordBreak: 'break-all' }} mr="10px" color={isDark ? '#777' : '#272318'}>
                {isMobile ? `${lock?.contractAddress.substring(0, 6)}...${lock?.contractAddress.substring(lock?.contractAddress.length - 4)}` : lock?.contractAddress}
              </Text>
              <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${lock?.contractAddress}`} color="#A56A46">
                <StyledExportImg src="/images/moonx/lockerExport.png" />
              </Link>
              <CopyToClipboard toCopy={lock?.contractAddress}><StyledExportImg src="/images/moonx/lockerCopy.png" /></CopyToClipboard>
            </Flex>
          </Flex>
          {lock?.releaseAddress && <Flex alignItems="center">
            <Text fontSize="12px" style={{ width: isMobile ? '38%' : '35%', wordBreak: 'break-word' }}>{TranslateString(1383, 'Release To')}:</Text>
            <Flex justifyContent="space-between">
              <Text fontSize={isMobile ? '8px' : '12px'} textAlign="right" style={{ width: '100%', wordBreak: 'break-all' }} mr="10px" color={isDark ? '#777' : '#272318'}>
                {isMobile ? `${lock?.releaseAddress.substring(0, 6)}...${lock?.releaseAddress.substring(lock?.releaseAddress.length - 4)}` : lock?.releaseAddress}
              </Text>
              <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${lock?.releaseAddress}`} color="#A56A46">
                <StyledExportImg src="/images/moonx/lockerExport.png" />
              </Link>
              <CopyToClipboard toCopy={lock?.releaseAddress}><StyledExportImg src="/images/moonx/lockerCopy.png" /></CopyToClipboard>
            </Flex>
          </Flex>}
          <Flex alignItems="center" mt="10px">
            <Text fontSize="12px" style={{ width: isMobile ? '38%' : '36%', wordBreak: 'break-word' }}>{TranslateString(1368, '100% Unlock time', { time: '100%' })}:</Text>
            <Text fontSize={isMobile ? '8px' : '12px'} textAlign="center" style={{ wordBreak: 'break-word' }}>{moment(lock?.startUnlockTime).format("YYYY-MM-DD HH:mm:ss")}</Text>
          </Flex>
        </Left>
        <Right>
          <Text fontSize="14px" bold style={{ wordBreak: 'break-all' }}>{lock?.actualLockNum}</Text>
          <Text fontSize="12px">{TranslateString(1369, 'Lock Amount')}</Text>
          <StyledButton
            disabled={!Number(lock?.canReceiveReward)}
            isLoading={pendingTx === lock?.id}
            endIcon={pendingTx === lock?.id ? <AutoRenewIcon color="currentColor" spin /> : null}
            onClick={() => handleClick(lock)}
          > {TranslateString(1376, 'Withdraw')}</StyledButton>
          <Flex pt="10px" ml="10px" mr="10px" alignItems="flex-end" justifyContent="center">
            <Text fontSize="10px" color="#A56A46" mt="6px">{TranslateString(1374, 'Available')}:</Text>
            <Text fontSize="12px" color="#A56A46" style={{ wordBreak: 'break-all' }}>{lock?.canReceiveReward ? lock?.canReceiveReward : 0}</Text>
          </Flex>
        </Right>
      </LockersContent>) : null
    }
  </>
}
export default ManageLockers
