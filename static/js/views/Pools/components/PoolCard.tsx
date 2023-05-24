import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, IconButton, useModal, AddIcon, Text } from 'moondoge-uikit'
import { useWeb3React } from '@web3-react/core'
// import { fetchPoolsAccountAllowance } from 'state/pools/fetchPoolsUser'
import UnlockButton from 'components/UnlockButton'
import Label from 'components/Label'
import { useERC20 } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useSousStake } from 'hooks/useStake'
import { useSousUnstake } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolApr } from 'utils/apr'
import { getAddress } from 'utils/addressHelpers'
import { useSousHarvest } from 'hooks/useHarvest'
import Balance from 'components/Balance'
import { PoolCategory } from 'config/constants/types'
import tokens from 'config/constants/tokens'
import { Pool } from 'state/types'
import { useGetApiPrice, useBlock, useValuePriceBusd } from 'state/hooks'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CompoundModal from './CompoundModal'
import CardTitle from './CardTitle'
import Card from './Card'
import OldSyrupTitle from './OldSyrupTitle'
import HarvestButton from './HarvestButton'
import CardFooter from './CardFooter'

interface HarvestProps {
  pool: Pool
}

const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    harvest,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    stakingLimit,
    contractAddress,
    projectSiteUrl = "",
    hasCoolingOff
  } = pool

  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const { currentBlock } = useBlock()
  const valuePrice = useValuePriceBusd()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { account } = useWeb3React()
  const poolContractAddress = getAddress(pool.contractAddress);
  const contractOption = {
    options: {
      address: poolContractAddress
    }
  }
  const { onApprove } = useSousApprove(stakingTokenContract, sousId, contractOption)
  const { onStake } = useSousStake(sousId, isBnbPool)
  const { onUnstake } = useSousUnstake(sousId)
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  // APR
  const rewardTokenPrice = useGetApiPrice(earningToken.address ? getAddress(earningToken.address) : '')
  const stakingTokenPrice = useGetApiPrice(stakingToken.address ? getAddress(stakingToken.address) : '')
  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)
  const apr = getPoolApr(
    stakingTokenPrice,
    sousId === 7 ? valuePrice.toNumber() : rewardTokenPrice,
    getBalanceNumber(pool.totalStaked, stakingToken.decimals),
    parseFloat(pool.tokenPerBlock),
    pool.sousId
  )

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const userAllowance = new BigNumber(userData?.allowance || 0).toNumber()
  // const [allowance, setAllowance] = useState<any>(0)

  // useEffect(() => {
  //   async function getAllow() {
  //     const allowanceSous = await fetchPoolsAccountAllowance(account, sousId)
  //     setAllowance(allowanceSous)
  //   }
  //   if (!userAllowance) {
  //     getAllow()
  //   }
  // }, [account, sousId, requestedApproval, userAllowance])
  // const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)
  const isOldSyrup = stakingToken.symbol === tokens.syrup.symbol
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  // const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  // const needsApproval = !accountHasStakedBalance && (userAllowance ? !userAllowance : !allowance) && !isBnbPool
  const needsApproval = !accountHasStakedBalance && !userAllowance && !isBnbPool
  const isCardActive = isFinished && accountHasStakedBalance

  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(earningToken.decimals))
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingToken.symbol} (${stakingLimit} max)` : stakingToken.symbol}
      stakingTokenDecimals={stakingToken.decimals}
    />,
  )

  const [onPresentCompound] = useModal(
    <CompoundModal earnings={earnings} onConfirm={onStake} tokenName={stakingToken.symbol} />,
  )
  // const poolImage = `${pool.earningToken.symbol}-${pool.stakingToken.symbol}.svg`.toLocaleLowerCase()
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={stakingToken.symbol}
      stakingTokenDecimals={stakingToken.decimals}
    />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  const tokenSymbolImg = {
    'MODO': '/images/pools/bigDoge-doge.png',
    'VALUE': '/images/pools/value.png'
  }

  return (
    <CardBox isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      <CardLabel>{hasCoolingOff ? 'Fixed' : 'Flexible'}</CardLabel>
      {/* <PoolFinishedSash onClick={
        // onPresentDeposit
        // onPresentCompound
        // onPresentWithdraw
      }>Finished</PoolFinishedSash> */}
      {isFinished && sousId !== 0 && <PoolFinishedSash>Finished</PoolFinishedSash>}
      <div>
        <div style={{ width: '80px', margin: '0 auto', flex: 1, position: 'relative' }}>
          <StyledImageBox src={tokenSymbolImg[earningToken.symbol]} />
          <StyledSmallImg src="/images/pools/smallDoge-doge.png" />
          {/* <Image src={`/images/pools/${poolImage}`} alt={earningToken.symbol} width={80} height={80} /> */}
        </div>
        <CardTitle isFinished={isFinished && sousId !== 0}>
          {isOldSyrup && '[OLD]'} Stake {stakingToken.symbol},Earn {earningToken.symbol}
          {/* {isOldSyrup && '[OLD]'} {earningToken.symbol} {TranslateString(348, 'Pool')} */}
        </CardTitle>
        <Balance value={getBalanceNumber(earnings, earningToken.decimals)} isDisabled={isFinished} fontSize="32px" />
        {/* <Label isFinished={isFinished && sousId !== 0} text={TranslateString(330, `${earningToken.symbol} earned`, {
          asset: earningToken.symbol
        })} /> */}
      </div>
      <StyledContentBox>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: '1', alignItems: 'center', marginRight: '20px' }}>
            {account && harvest && !isOldSyrup && (
              <HarvestButton
                disabled={!earnings.toNumber() || pendingTx}
                text={`${pendingTx ? TranslateString(999, 'Collecting') : TranslateString(562, 'Claim')} ${earningToken.symbol}`}
                onClick={async () => {
                  setPendingTx(true)
                  await onReward()
                  setPendingTx(false)
                }}
              />
            )}
          </div>
          {!isOldSyrup && (sousId === 0 && account && harvest) && <BalanceAndCompound>  <HarvestButton
            disabled={!earnings.toNumber() || pendingTx}
            text={TranslateString(704, 'Compound')}
            onClick={onPresentCompound}
          /></BalanceAndCompound>

          }
          {/* {!isOldSyrup ? (
            <BalanceAndCompound>
              {sousId === 0 && account && harvest && (
                <HarvestButton
                  disabled={!earnings.toNumber() || pendingTx}
                  text={TranslateString(704, 'Compound')}
                  onClick={onPresentCompound}
                />
              )}
            </BalanceAndCompound>
          ) : (
            <OldSyrupTitle hasBalance={accountHasStakedBalance} />
          )} */}
        </div>

        <StyledCardActions>
          {!account && <UnlockButton noIcon />}
          {account &&
            (needsApproval && !isOldSyrup ? (
              <div style={{ flex: 1 }}>
                <Button disabled={isFinished || requestedApproval} onClick={handleApprove} width="100%" variant="defaultIcon">
                  {`Approve ${stakingToken.symbol}`}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                  onClick={
                    isOldSyrup
                      ? async () => {
                        setPendingTx(true)
                        await onUnstake('0', stakingToken.decimals)
                        setPendingTx(false)
                      }
                      : onPresentWithdraw
                  }
                >
                  <Text color="#201F1E" bold>
                    {TranslateString(1259, `Unstake ${stakingToken.symbol}`, {
                      token: stakingToken.symbol,
                    })}
                  </Text>
                </Button>
                <StyledActionSpacer />
                {!isOldSyrup && (
                  <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                    <AddIcon color="primary" />
                  </IconButton>
                )}
              </>
            ))}
        </StyledCardActions>
        <StyledDetails>
          <Text fontSize="14px" bold mb="8px">{TranslateString(736, 'APR')}:</Text>
          {/* eslint-disable-next-line no-nested-ternary */}
          {isFinished || isOldSyrup || !apr ? (
            <Text fontSize="14px" bold>1???%</Text>
          ) : (
            // eslint-disable-next-line no-nested-ternary
            sousId === 0 ? <Balance fontSize="14px" isDisabled={isFinished} value={apr} decimals={2} unit="%" /> : (blocksUntilStart <= 0 && blocksRemaining > 0 ? <Balance fontSize="14px" isDisabled={isFinished} value={apr} decimals={2} unit="%" /> : <Text fontSize="14px" bold>0%</Text>)
          )}
        </StyledDetails>
        <StyledDetails>
          <Text fontSize="14px" bold>{TranslateString(384, 'Your Stake')}:</Text>
          <Balance
            fontSize="14px"
            isDisabled={isFinished}
            value={getBalanceNumber(stakedBalance, stakingToken.decimals)}
          />
        </StyledDetails>
        <CardFooter
          projectSiteUrl={projectSiteUrl}
          projectLink={earningToken.projectLink}
          decimals={stakingToken.decimals}
          totalStaked={totalStaked}
          startBlock={startBlock}
          endBlock={endBlock}
          isFinished={isFinished}
          poolCategory={poolCategory}
          tokenName={earningToken.symbol}
          tokenAddress={earningToken.address ? getAddress(earningToken.address) : ''}
          tokenDecimals={earningToken.decimals}
          contractAddress={getAddress(contractAddress)}
        />
      </StyledContentBox>
    </CardBox>
  )
}

const PoolFinishedSash = styled.div`
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#FCE1BF'};
  border-radius: 50px 0px 0px 50px;
  // background-image: url('/images/pool-finished-sash.svg');
  // background-position: top right;
  // background-repeat: not-repeat;
  height: 28px;
  position: absolute;
  right: 0;
  op: 44px;
  width: 74px;
  line-height:28px;
  font-size: 14px;
  font-weight: bold;
  color: #A56A46;
  text-align:center;

`

const StyledCardActions = styled.div`
  display: flex;
  // justify-content: center;
  justify-content: space-between;
  margin: 0 0 16px;
  width: 100%;
  box-sizing: border-box;
`
const StyledContentBox = styled.div`
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#fff'};
  border-radius: 25px;
  padding:13px 20px;
  margin-top:11px;
`

const BalanceAndCompound = styled.div`
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  // flex-direction: row;
  text-align:center;
  flex:1
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`
const CardBox = styled(Card) <{ isFinished: boolean }>`
  border: 1px solid ${({ theme }) => theme.isDark ? '#1A191B' : '#FFE7D8'} ;
  background: ${({ theme }) => theme.isDark ? '#2D2925' : 'linear-gradient(180deg, #FFFFFF 0%, #FEF6E3 100%)'};
  border-radius: 25px;
  padding:20px 10px 10px;
  opacity:${({ isFinished }) => isFinished ? '0.5' : '1'};
  position:relative;
  min-width:calc(100% - 20px);
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 280px;
  }
`
const StyledImageBox = styled.img`
  width:80px;
  height:80px;
  object-fit:cover
`;
const StyledSmallImg = styled.img`
  width:24px;
  height:24px;
  object-fit:cover;
  position: absolute;
  bottom: 0;
  right: 0;
`;
const CardLabel = styled.div`
  width: 74px;
  height: 28px;
  background: #FCE1BF;
  opacity: 1;
  border-radius: 50px 0px 0px 50px;
  font-size: 14px;
  font-weight: bold;
  color: #A56A46;
  line-height: 28px;
  text-align: center;
  position: absolute;
  right: 0;
  top:44px;
`;
export default PoolCard
