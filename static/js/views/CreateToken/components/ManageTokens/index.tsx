import React, { useState, useEffect } from "react"
import { Flex, Button, Text, Link, Spinner } from 'moondoge-uikit'
import styled from "styled-components"
import { useWeb3React } from '@web3-react/core'
import { Link as RouteLink } from 'react-router-dom'
// import CopyToClipboard from 'react-copy-to-clipboard';
import useI18n from 'hooks/useI18n'
import CopyToClipboard from "components/CopyToClipboard";
import CardValue from "views/Home/components/CardValue";


const Wrapper = styled.div``;
const TokensCard = styled.div`
  width: auto;
  border: 1px solid ${({ theme }) => theme.isDark ? '#1A191B' : '#FFC7A5'};
  background: ${({ theme }) => theme.isDark ? ' #2D2925' : 'linear-gradient(180deg, #FFFFFF 0%, #FEF6E3 100%)'} ;
  opacity: 1;
  border-radius: 25px;
  position:relative;
  padding-bottom:14px;
  margin-bottom:10px;
  ${({ theme }) => theme.mediaQueries.sm}{
  width: 350px;
  }
`;
const Label = styled.img`
  width:108px;
  height:88px;
  position:absolute;
  right:0;
  top:0;
`;
const StyledPhoto = styled.img`
  width:80px;
  height:80px;
  margin:27px auto 6px;
`;
const InfoBox = styled.div`
  padding:27px 10px;
  margin:10px 10px 0;
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#fff'};
  border-radius: 25px;
`;
const StyledCopyBox = styled(Flex)`
  padding:8px 6px;
  border: 1px solid #FFCE69;
  border-radius: 14px;
  cursor: pointer;
`;
const CopyIcon = styled.img`
  width:12px;
  height:12px;
`;
const StyledImgBox = styled.div`
width:25px;
height:24px;
box-sizing:border-box;
border-radius:50%;
margin-left:6px;
&:hover{
  border:1px solid #A56A46;
}
`;
const CopyViewIcon = styled.img`
width:28px;
object-fit: cover;
height:28px;
border-radius:50%;
box-sizing:border-box;
border:1px solid #FFF2DD;
margin-left:6px;
&:hover{
  border:1px solid #A56A46;
}
`;
const StyledButton = styled(Button)`
  flex:1;
  height: 44px;
  background: linear-gradient(180deg, #FEF6E3 0%, #FEC23D 100%);;
  border-radius: 25px;
  box-shadow:none;
  color:#A56A46;
  &:not(:last-of-type){
    margin-right:4px;
  }
`;

const StyledLockButton = styled(Button)`
  width: 49%;
  height: 44px;
  border: 1px solid #A56A46;
  background: ${({ theme }) => theme.isDark ? '#201F1E' : 'linear-gradient(180deg, #FFFFFF 0%, #FEF6E3 100%)'} ;
  box-shadow:none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  color: #A56A46;
  line-height:40px;
  margin-left:6px;
  `;

const TokenContent = styled.div`
  // display: grid;
  // grid-template-columns: repeat(4, 1fr);
  // grid-template-rows: repeat(4, auto);
  // margin-bottom: 20px;
  padding-top:33px;
  // margin: 27px 20px 20px;
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
    grid-gap:20px 35px;
  }
  `;
const StyleSpinner = styled.div`
  width: 142px;
  margin: 40px auto;
`;
const ManageTokens = () => {
  const TranslateString = useI18n();
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(false)
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchCoinList = async () => {
      setLoading(true)
      const apiUrl = process.env.REACT_APP_IDO_API
      const res = await fetch(`${apiUrl}/api/coin/list?limit=10000&address=${account}`);
      const data = await res.json()
      if (data?.data?.list) {
        setTokens(data?.data?.list)
        setLoading(false)
      }
    }
    try {
      fetchCoinList();
    } catch (error) {
      setLoading(false)
    }
  }, [account])
  return <Wrapper>
    {loading && <StyleSpinner><Spinner /></StyleSpinner>}
    {
      !loading && <TokenContent>
        {
          tokens.length ? tokens.map(token => <TokensCard key={token.id}>
            <Label src={token.type ? "/images/moonx/automatic.png" : "/images/moonx/standard.png"} />
            <StyledPhoto src="/images/moonx/tokensPhoto.png" />
            <Text fontSize="22px" bold style={{ wordBreak: 'break-all', width: '100%' }}>{token?.symbol}</Text>
            <Text fontSize="24px" bold style={{ wordBreak: 'break-all', width: '100%' }}>
              <CardValue fontSize='24px' bold value={token?.totalNum} />
            </Text>
            <Text fontSize="12px" color="#A56A46">{TranslateString(1302, 'Total Supply')}</Text>
            <InfoBox>
              <Flex alignItems="center" justifyContent="space-between" mb="20px">
                <Text fontSize="14px" bold>{TranslateString(1319, 'Contract')} : {' '}
                  {token?.contractAddress.substring(0, 6)}...{token?.contractAddress.substring(token?.contractAddress.length - 4)}
                </Text>
                <Flex alignItems="center">
                  <CopyToClipboard toCopy={token?.contractAddress}><CopyViewIcon src="/images/moonx/tokensCopy.png" /></CopyToClipboard>
                  <Link external href={`${process.env.REACT_APP_BSCSCAN}/address/${token?.contractAddress}`} color="#A56A46">
                    <CopyViewIcon src="/images/moonx/links.png" />
                  </Link>
                </Flex>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mb="42px">
                <Text fontSize="14px" bold>{TranslateString(1320, 'Balance')} :</Text>
                <Text fontSize="14px" bold>{token?.balance}</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mb="16px">
                <StyledButton>
                  <Link external href={`https://exchange.moondoge.com/#/add/BNB/${token?.contractAddress}`} color="#A56A46">
                    {TranslateString(1347, 'Add liquidity')}
                  </Link>
                </StyledButton>
                {token.type ? <StyledLockButton as={RouteLink} to={`/whiteList/${token?.contractAddress}`}>
                  {TranslateString(1343, 'Whitelist')}
                </StyledLockButton> : null}
              </Flex>
              {/* <Flex alignItems="center" justifyContent="space-between">
            <StyledLockButton>Lock</StyledLockButton>
            <StyledLockButton>Crowdfunding</StyledLockButton>
          </Flex> */}
            </InfoBox>
          </TokensCard>) : null
        }
      </TokenContent>
    }
    {!loading && !tokens.length && <Text textAlign="center" fontSize="36px" bold mt="20px">No tokens</Text>}
  </Wrapper>
}
export default ManageTokens
