import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
// import { ChevronDown, ChevronUp } from 'react-feather'
import { Flex, MetamaskIcon, ArrowDropDownIcon, ArrowDropUpIcon, Text } from 'moondoge-uikit'
import Balance from 'components/Balance'
import { CommunityTag, CoreTag, BinanceTag } from 'components/Tags'
import { useBlock } from 'state/hooks'
import { PoolCategory } from 'config/constants/types'
import { registerToken } from 'utils/wallet'
import { BASE_URL } from 'config'

const tags = {
  [PoolCategory.BINANCE]: BinanceTag,
  [PoolCategory.CORE]: CoreTag,
  [PoolCategory.COMMUNITY]: CommunityTag,
}

interface Props {
  projectLink: string
  decimals: number
  totalStaked: BigNumber
  tokenName: string
  tokenAddress: string
  tokenDecimals: number
  startBlock: number
  endBlock: number
  isFinished: boolean
  poolCategory: PoolCategory
  contractAddress: string
  projectSiteUrl?: string
}

const StyledFooter = styled.div<{ isFinished: boolean }>`
  // border-top: 1px solid ${({ theme }) => (theme.isDark ? '#524B63' : '#E9EAEB')};
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled2' : 'primary2']};
  // padding: 24px;
  padding:13px 0 0;
`

const StyledDetailsButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  height: 32px;
  justify-content: center;
  outline: 0;
  padding: 0;
  &:hover {
    opacity: 0.9;
  }

  & > svg {
    margin-left: 4px;
    fill:#A56A46
  }
`

const Details = styled.div`
  margin-top: 16px;
`

const Row = styled(Flex)`
  align-items: center;
`

const FlexFull = styled.div`
  flex: 1;
`
const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-top:4px;
`
const TokenLink = styled.a`
  font-size: 14px;
  text-decoration: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  font-weight: bold;
  // margin:8px 0;
  :hover{
    color:#A56A46;
    text-decoration: underline;
  }
`
const StyledViewIcon = styled.img`
  width: 14px;
  height: 14px;
  object-fit: cover;
  margin-left:5px;
`;
const StyledText = styled(Text)`
display:inline-block;
`;

const CardFooter: React.FC<Props> = ({
  projectLink,
  decimals,
  tokenAddress,
  totalStaked,
  tokenName,
  tokenDecimals,
  isFinished,
  startBlock,
  endBlock,
  poolCategory,
  contractAddress,
  projectSiteUrl
}) => {
  const { currentBlock } = useBlock()
  const [isOpen, setIsOpen] = useState(false)
  const TranslateString = useI18n()
  const Icon = isOpen ? ArrowDropUpIcon : ArrowDropDownIcon

  const handleClick = () => setIsOpen(!isOpen)
  const Tag = tags[poolCategory]

  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)

  const imageSrc = `${BASE_URL}/images/tokens/${tokenName.toLowerCase()}.png`

  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  return (
    <StyledFooter isFinished={isFinished}>
      <Row>
        <FlexFull>
          <Tag />
        </FlexFull>
        <StyledDetailsButton onClick={handleClick}>
          {isOpen ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')} <Icon />
        </StyledDetailsButton>
      </Row>
      {isOpen && (
        <Details>
          <Row mb="4px">
            <FlexFull>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/images/pools/yourStake.png" alt="" width={18} height={18} />
                {/* <span role="img" aria-label="syrup">
                  🥞{' '}
                </span> */}
                <StyledText fontSize="14px" bold ml="6px">{TranslateString(408, 'Total')}</StyledText>
              </div>
            </FlexFull>
            <Balance fontSize="14px" color="#EC915A" isDisabled={isFinished} value={getBalanceNumber(totalStaked, decimals)} />
          </Row>
          {endBlock && (
            <Row mb="4px">
              <FlexFull>
                <Flex mb="8px">
                  <Label style={{ marginTop: '6px' }}>{TranslateString(410, 'Ends in(Block Height)')}:</Label>
                  <StyledViewIcon style={{ marginTop: '6px' }} src="/images/pools/endTimeIcon.png" />
                </Flex>
              </FlexFull>
              <Balance fontSize="14px" color="#EC915A" isDisabled={isFinished} value={endBlock} decimals={0} />
            </Row>
          )}
          {/* {blocksUntilStart > 0 && (
            <Row mb="4px">
              <FlexFull>
                <Label>{TranslateString(1212, 'Start')}:</Label>
              </FlexFull>
              <Balance fontSize="14px" color="#EC915A" isDisabled={isFinished} value={blocksUntilStart} decimals={0} />
            </Row>
          )} */}
          {/* {blocksUntilStart === 0 && blocksRemaining > 0 && (
            <Row mb="4px">
              <FlexFull>
                <Label>{TranslateString(410, 'End')}:</Label>
              </FlexFull>
              <Balance fontSize="14px" color="#EC915A" isDisabled={isFinished} value={blocksRemaining} decimals={0} />
            </Row>
          )} */}
          {projectSiteUrl && contractAddress && <Flex alignItems="center" mb="8px"><TokenLink href={`${process.env.REACT_APP_BSCSCAN}/address/${contractAddress}`} target="_blank">
            {TranslateString(412, 'View Contract')}
          </TokenLink><StyledViewIcon src="/images/pools/viewLinksIcon.png" /></Flex>
          }
          {isMetaMaskInScope && tokenAddress && (
            <Flex mb="8px">
              <TokenLink onClick={() => registerToken(tokenAddress, tokenName, tokenDecimals, imageSrc)}>
                {TranslateString(1258, `Add ${tokenName} to MetaMask`, {
                  tokenName,
                })}
              </TokenLink>
              <MetamaskIcon height={15} width={15} ml="4px" />
            </Flex>
          )}
          <Flex alignItems="center">
            <TokenLink href={projectSiteUrl || projectLink} target="_blank">
              {TranslateString(412, 'View project site')}
            </TokenLink>
            <StyledViewIcon src="/images/pools/viewLinksIcon.png" />
          </Flex>
        </Details>
      )}
    </StyledFooter>
  )
}

export default React.memo(CardFooter)
