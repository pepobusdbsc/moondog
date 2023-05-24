import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link as RouteLink, Redirect, useParams } from 'react-router-dom'
import { Flex, Text, useMatchBreakpoints, ArrowBackIcon, ButtonMenuItem, Button, Link, CloseIcon, Spinner, useModal, Modal, InjectedModalProps, Input, AutoRenewIcon, OpenNewIcon } from 'moondoge-uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { useRemoveYieldWhiteList, useRemoveTaxWhiteList } from 'hooks/useErc20Factory'
import CopyToClipboard from "components/CopyToClipboard";
import CardValue from 'views/Home/components/CardValue'
import Page from 'components/layout/Page'
import AddWhiteListModal from './AddWhiteListModal'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`
const Box = styled.div`
  max-width:1200px;
  margin:0 auto;
`;
const ContentBox = styled(Flex)`
  display:block;
  padding:0 10px;
  ${({ theme }) => theme.mediaQueries.sm}{
    display:flex;
    padding:0;
  }
`;
const HeaderWrapper = styled.div`
  padding:10px 2px;
  max-width:100%;
  min-height: 323px;
  background: ${({ theme }) => theme.isDark ? 'linear-gradient(180deg, #87734A 0%, #302306 100%)' : '#A56A46'} ;
  opacity: 1;
  margin:0 auto 40px;
  position: relative;
  z-index:15;
  ${({ theme }) => theme.mediaQueries.sm}{
  padding:33px 0 20px 20px;
  }
`;
const StyledBk = styled.img`
  width: 323px;
  height: 323px;
  position: absolute;
  right: 0;
  top: 0;
  z-index:-1;
`;
const Content = styled.div`
  width:95%;
  padding:15px 0 0 15px;
  ${({ theme }) => theme.mediaQueries.sm}{
    padding:35px 0 0 55px;
  }
`;
const IconBox = styled(Flex)`
  margin:10px 0 0 5px;
  ${({ theme }) => theme.mediaQueries.sm}{
    margin:0 0 0 40px
  }
`;
const StyledCopyBox = styled(Flex)`
  min-width: 60px;
  padding:6px;
  cursor: pointer;
  height: 24px;
  border: 1px solid #FFFFFF;
  border-radius: 14px;
`;
const CopyIcon = styled.img`
  width:12px;
`;
const LinksIcon = styled.img`
  width:12px;
  object-fit: cover;
`;
const StyledButton = styled(Button)`
  min-width:123px;
  height: 44px;
  background: linear-gradient(180deg, #FEF6E3 0%, #FEC23D 100%);;
  border-radius: 25px;
  box-shadow:none;
  color:#A56A46;
`;
const CardWrapper = styled.div`
  padding:32px 20px 40px;
  background: ${({ theme }) => theme.isDark ? '#201F1E' : 'linear-gradient(180deg, #FFFFFF 0%, #FEF6E3 100%)'};
  border-radius: 25px;
  width:100%;
  margin-right:0;
  text-align:center;
  min-height:400px;
  margin-bottom:10px;
  border:1px solid ${({ theme }) => theme.isDark ? '#272318' : '#FFC7A5'};
  text-align:left;
  ${({ theme }) => theme.mediaQueries.sm}{
    width:50%;
    min-height:400px;
    &:not(:last-of-type){
      margin-right:17px;
    }
  }
`;
const StyledAccountList = styled.div`
  min-height:200px;
  padding-top:20px;
`;
const StyledListItem = styled(Flex)`
  padding:10px;
  background: ${({ theme }) => theme.isDark ? '#2D2925' : '#fff'};
  border-radius: 10px;
  &:not(:last-of-type){
    margin-bottom:10px;
  }
  &:hover{
    div{
      color:#A56A46;
    }
    svg{
      path{
        fill:#A56A46;
      }
    }
  }
  svg{
    cursor: pointer;
    &:hover{
      path{
        fill:#A56A46
      }
    }
  }
  ${({ theme }) => theme.mediaQueries.sm}{
    padding:10px;
  }
`
const StyledAdd = styled(Button)`
  width: 294px;
  height: 60px;
  background: linear-gradient(180deg, #DFBC70 0%, #B88513 100%);
  box-shadow: 0px 3px 6px rgba(86, 58, 9, 0.31);
  border-radius: 44px;
  margin-top:40px;
`;

const WhiteListManagement = () => {
  const { id: idStr }: { id: string } = useParams()
  const id = idStr
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  const [isView, setView] = useState(false)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<any>({})
  const [yieldList, setYieldList] = useState([])
  const [taxList, setTaxList] = useState([])

  const apiUrl = process.env.REACT_APP_IDO_API;

  let removeAddress = "";
  let whiteType = 1;

  const fetchWhiteList = useCallback(async () => {
    const res = await fetch(`${apiUrl}/api/coin/whiteList?coinAddress=${token?.contractAddress}`);
    const data = await res.json()
    if (data?.data?.feeNotBonus) {
      setYieldList(data?.data?.feeNotBonus)
    }
    if (data?.data?.notChargeFee) {
      setTaxList(data?.data?.notChargeFee)
    }
  }, [token, apiUrl])

  const handleSuccess = useCallback(() => {
    fetchWhiteList();
  }, [fetchWhiteList])

  const [onAddModal] = useModal(<AddWhiteListModal tokenParameters={{
    coinAddress: token?.contractAddress,
    type: 1,
  }} onSuccess={handleSuccess} />)

  const [onTaxAddModal] = useModal(<AddWhiteListModal tokenParameters={{
    coinAddress: token?.contractAddress,
    type: 2,
  }} onSuccess={handleSuccess} />)


  const { onRemoveYield } = useRemoveYieldWhiteList(token?.contractAddress)
  const { onRemoveTax } = useRemoveTaxWhiteList(token?.contractAddress)

  const RemoveModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
    const [isConfirmingRemove, setIsConfirmingRemove] = useState(false)
    const handleConfirmRemove = async () => {
      setIsConfirmingRemove(true)
      try {
        let txh: any = {}
        if (whiteType === 1) {
          txh = await onRemoveYield(removeAddress);
        } else if (whiteType === 2) {
          txh = await onRemoveTax(removeAddress);
        }
        if (txh) {
          const response = await fetch(`${apiUrl}/api/coin/deleteWhiteList?coinAddress=${token?.contractAddress}&userAddress=${removeAddress}&type=${whiteType}`, {
            method: 'POST',
          })
          const responseData = await response.json();
          if (responseData.code === 0) {
            setIsConfirmingRemove(false);
            onDismiss()
            fetchWhiteList();
          }
          removeAddress = "";
          whiteType = 1;
        }
      } catch (err) {
        console.log(err)
        setIsConfirmingRemove(false)
      }
    }
    return (
      <Modal title={`${TranslateString(1344, 'Remove')}${TranslateString(1343, 'Whitelist')}`} onDismiss={onDismiss}>
        <Input readOnly value={removeAddress} style={{ width: !isMobile && '420px' }} />
        <Button width="100%" onClick={handleConfirmRemove}
          disabled={!account || !removeAddress}
          isLoading={isConfirmingRemove}
          endIcon={isConfirmingRemove ? <AutoRenewIcon color="currentColor" spin /> : null}
          style={{
            background: 'linear-gradient(180deg, #DFBC70 0%, #B88513 100%)',
            boxShadow: 'none',
            margin: '0 auto',
            width: '100%',
            marginTop: '10px'
          }}>
          {TranslateString(1324, 'CONFIRM')}
        </Button>
      </Modal>
    );
  };

  const [handleRemoveModal] = useModal(<RemoveModal />)

  const handleAdd = (type) => {
    if (type === 1) {
      onAddModal();
    }
    if (type === 2) {
      onTaxAddModal();
    }
  }
  // 移除白名单
  const handleRemove = debounce((type, address) => {
    removeAddress = address;
    whiteType = type;
    handleRemoveModal()
    // try {
    //   let txh: any = {}
    //   if (type === 1) {
    //     txh = await onRemoveYield(address);
    //   } else if (type === 2) {
    //     txh = await onRemoveTax(address);
    //   }
    //   if (txh) {
    //     const response = await fetch(`${process.env.REACT_APP_FETCH_API}/api/coin/deleteWhiteList?coinAddress=${token?.contractAddress}&userAddress=${address}&type=${type}`, {
    //       method: 'POST',
    //     })
    //     const responseData = await response.json();
    //     if (responseData.code === 0) {
    //       handleSuccess()
    //     }
    //   }

    // } catch (err) {
    //   console.log(err)
    // }
  }, 200)

  useEffect(() => {
    const fetchCoinList = async () => {
      const res = await fetch(`${apiUrl}/api/coin/get?contractAddress=${id}`);
      const data = await res.json();
      if (data?.data) {
        setToken(data?.data)
        setLoading(false)
      }
    }
    try {
      setLoading(true)
      fetchCoinList();
    } catch (error) {
      setLoading(false)
    }
  }, [account, id, apiUrl])

  useEffect(() => {
    // 获取白名单列表
    if (token?.contractAddress) {
      fetchWhiteList()
    }
  }, [token, fetchWhiteList])

  const accountEllipsis = token?.contractAddress
    ? `${token?.contractAddress.substring(0, 6)}.....${token?.contractAddress.substring(token?.contractAddress.length - 4)}`
    : null
  if (!id) {
    return <Redirect to="/404" />
  }

  return (
    <>
      {loading && <Wrapper>
        <Spinner />
      </Wrapper>}
      {!loading ?
        <Box>
          <HeaderWrapper>
            {!isMobile && <StyledBk src="/images/moonx/whiteBk.png" />}
            <Flex alignItems="center">
              <ButtonMenuItem as={RouteLink} to="/createToken?active=1">
                <ArrowBackIcon color="#fff" width="24px" />
              </ButtonMenuItem>
              <Text color="#fff" fontSize={isMobile ? '18px' : '24px'} bold style={{ width: '95%', textAlign: 'left' }}>
                {TranslateString(1333, 'Back')}</Text>
            </Flex>
            <Content>
              <Flex alignItems="center" mb="15px">
                <Text fontSize="16px" color="#fff" style={{ width: '20%' }}>{TranslateString(1297, 'Token Symbol')}:</Text>
                <Text fontSize="16px" color="#fff">{token?.symbol}</Text>
              </Flex>
              <Flex alignItems={isMobile ? 'baseline' : 'center'} mb="15px" flexWrap="wrap">
                <Text fontSize="16px" color="#fff" style={{ width: '20%' }}>{TranslateString(1299, 'Token Contract')}:</Text>
                <Text fontSize="16px" color="#fff" style={{ width: isMobile ? '76%' : '36%', wordBreak: 'break-all' }}>
                  {isView ? token?.contractAddress : accountEllipsis}</Text>
                <IconBox>
                  <StyledCopyBox alignItems="center" justifyContent="space-between" mr="20px">
                    <CopyIcon src="/images/moonx/whiteCopy.png" />
                    <CopyToClipboard toCopy={token?.contractAddress}><Text fontSize="12px" ml="2px" color="#fff" lineHeight="1">{TranslateString(1334, 'Copy')}</Text></CopyToClipboard>
                  </StyledCopyBox>
                  <StyledCopyBox alignItems="center" justifyContent="space-between" mr="20px">
                    <CopyIcon src="/images/moonx/whiteView.png" />
                    <Text fontSize="12px" ml="2px" color="#fff" lineHeight="1" onClick={() => { setView(!isView) }}>{isView ? TranslateString(1066, 'Hide') : TranslateString(1335, 'View')}</Text>
                  </StyledCopyBox>
                  <StyledCopyBox alignItems="center" justifyContent="space-between">
                    <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${token?.contractAddress}`}>
                      <OpenNewIcon width="12px" color="#fff" />
                      {/* <LinksIcon src="/images/moonx/whiteLink.png" /> */}
                      <Text fontSize="12px" ml="2px" color="#fff" lineHeight="1">{TranslateString(356, 'View On BscScan')}</Text>
                    </Link>
                  </StyledCopyBox>
                </IconBox>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="16px" color="#fff" style={{ width: '20%' }}>{TranslateString(1302, 'Total Supply')}:</Text>
                <CardValue fontSize='16px' bold color="#fff" value={token?.totalNum} />
              </Flex>
            </Content>
            <Flex alignItems="center" justifyContent="space-between" ml={isMobile ? '15px' : ' 50px'} mt="20px">
              <StyledButton>
                <Link external href={`https://exchange.moondoge.com/#/add/BNB/${token?.contractAddress}`} color="#A56A46">
                  {TranslateString(1347, 'Add liquidity')}
                </Link>
              </StyledButton>
            </Flex>
          </HeaderWrapper>
          <ContentBox>
            <CardWrapper>
              <Text fontSize={isMobile ? ' 18px' : ' 24px'} bold>{TranslateString(1338, 'Yield Whitelist')}</Text>
              <Text fontSize={isMobile ? ' 8px' : ' 14px'}>{TranslateString(1339, 'Whitelisted addresses will not receive yield redistribution')}</Text>
              <StyledAccountList>
                {
                  yieldList.length ? yieldList.map(yieldItem => <StyledListItem key={yieldItem.id} alignItems="center" justifyContent="space-between">
                    <Text fontSize={isMobile ? ' 12px' : ' 18px'}>{yieldItem.userAddress}</Text>
                    <CloseIcon color="#c7c7c7" onClick={() => handleRemove(1, yieldItem.userAddress)} />
                  </StyledListItem>) : <Text textAlign="center" fontSize="24px" color="#A56A46" mt="10px">No Data</Text>
                }
              </StyledAccountList>
              <Flex alignItems="center" justifyContent="space-around">
                <StyledAdd onClick={() => handleAdd(1)}>
                  {TranslateString(1273, 'ADD')}
                </StyledAdd>
              </Flex>
            </CardWrapper>
            <CardWrapper>
              <Text fontSize={isMobile ? ' 18px' : ' 24px'} bold>{TranslateString(1340, 'Transaction Tax Whitelist')}</Text>
              <Text fontSize={isMobile ? ' 8px' : ' 14px'}>{TranslateString(1341, 'Whitelisted addresses are tax-exempt')}</Text>
              <StyledAccountList>
                {
                  taxList.length ? taxList.map(taxItem => <StyledListItem key={taxItem.id} alignItems="center" justifyContent="space-between">
                    <Text fontSize={isMobile ? ' 12px' : ' 18px'}>{taxItem.userAddress}</Text>
                    <CloseIcon color="#c7c7c7" onClick={() => handleRemove(2, taxItem.userAddress)} />
                  </StyledListItem>) : <Text textAlign="center" fontSize="24px" color="#A56A46" mt="10px">No Data</Text>
                }
              </StyledAccountList>
              <Flex alignItems="center" justifyContent="space-around">
                <StyledAdd onClick={() => handleAdd(2)}>
                  {TranslateString(1273, 'ADD')}
                </StyledAdd>
              </Flex>
            </CardWrapper>
          </ContentBox>
        </Box> : null}
    </>

  )
}

export default WhiteListManagement
