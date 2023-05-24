import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { PromiEvent } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { useWeb3React } from '@web3-react/core'
import { Button, InjectedModalProps, Modal, Text, Flex, AutoRenewIcon, ToastContainer } from 'moondoge-uikit'
import useI18n from 'hooks/useI18n'
import { useCreateFee, useCreateMintableERC20 } from 'hooks/useErc20Factory'

interface Info {
  symbol: string | number,
  name: string | number,
  decimals: string | number,
  totalSupply: string | number,
  cap: string | number,
}
interface ClaimNftModalProps extends InjectedModalProps {
  onSuccess?: () => void
  onClaim?: () => PromiEvent<Contract>
  tokenParameters: Info
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 8px;
`
const StyledImg = styled.img`
  width:12px;
  height:12px;
  margin-left:10px;
`;
const Content = styled.div`
  padding:20px 25px 20px 10px;
  border-radius: 10px;
  background:${({ theme }) => theme.isDark ? '#2D2925' : '#FFF4EE'};
`;
const ExpectWrapper = styled.div`
  height: 50px;
  background: #2D2925;
  background:${({ theme }) => theme.isDark ? '#2D2925' : '#FFF4EE'};
  border-radius: 10px;
  text-align:center;
  line-height:50px;
  margin-bottom:17px;
`;
const ConfirmCreateTokenModal: React.FC<ClaimNftModalProps> = ({ onDismiss, tokenParameters, onSuccess }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { expectPayBnb, valueBnb } = useCreateFee()
  const [toasts, setToasts] = useState([]);

  const handleRemove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id));
  };
  const accountEllipsis = account
    ? `${account.substring(0, 13)}.....${account.substring(account.length - 9)}`
    : null
  const { totalSupply, cap, name, symbol, decimals } = tokenParameters;
  const params = {
    bnb: Number(valueBnb),
    totalSupply: Number(totalSupply),
    cap: Number(cap),
    name,
    symbol,
    decimals: Number(decimals)
  }

  const { onCreate } = useCreateMintableERC20(params)

  const handleConfirm = async () => {
    try {
      setIsConfirming(true)
      const txh = await onCreate();
      const { events = {} } = txh;
      let contractAddress = "";
      let type = 0;
      if (events?.NewERC20?.returnValues) {
        contractAddress = events?.NewERC20?.returnValues?.erc20;
        type = events?.NewERC20?.returnValues?.erc20Type;
      }
      const apiUrl = process.env.REACT_APP_IDO_API
      const response = await fetch(`${apiUrl}/api/coin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coinName: name,
          symbol,
          decimals: Number(decimals),
          totalNum: Number(totalSupply),
          contractAddress,
          type,
          ownerAddress: account,
        })
      })
      const responseData = await response.json()
      if (responseData.code === 0) {
        setIsConfirming(false)
        onDismiss();
        onSuccess()
      }
      if (responseData.code === -1) {
        setIsConfirming(false)
        const now = Date.now();
        const randomToast = {
          id: `id-${now}`,
          title: `Error`,
          description: responseData?.msg,
          type: "danger",
        };
        setToasts((prevToasts) => [randomToast, ...prevToasts]);
      }
    } catch (error) {
      console.log(error)
      setIsConfirming(false)
    }
  }

  return (
    <Modal title={TranslateString(1324, 'Confirmation')} onDismiss={onDismiss}>
      <ModalContent>
        <ExpectWrapper>
          <Text fontSize="20px" bold lineHeight="50px">Expect to pay {expectPayBnb} BNB</Text>
        </ExpectWrapper>
        <Flex alignItems="center" mb="16px" justifyContent="space-between">
          <Text fontSize="14px" fontWeight="500" mr="80px">{TranslateString(1325, 'Owner Address')}:</Text>
          <Text fontWeight="500" fontSize="12px" color="#A56A46">{accountEllipsis}</Text>
          {/* <StyledImg src="/images/moonx/export.png" /> */}
        </Flex>
        <Content>
          <Flex alignItems="center" mb="15px" justifyContent="space-between">
            <Text fontSize="14px" fontWeight="500">{TranslateString(1299, 'Token Name')}</Text>
            <Text fontWeight="500" fontSize="14px">{name}</Text>
          </Flex>
          <Flex alignItems="center" mb="15px" justifyContent="space-between">
            <Text fontSize="14px" fontWeight="500">{TranslateString(1297, 'Token Symbol')}</Text>
            <Text fontWeight="500" fontSize="14px">{symbol}</Text>
          </Flex>
          <Flex alignItems="center" mb="15px" justifyContent="space-between">
            <Text fontSize="14px" fontWeight="500">{TranslateString(1301, 'Token Decimal')}</Text>
            <Text fontWeight="500" fontSize="14px">{decimals}</Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mb="15px" >
            <Text fontSize="14px" fontWeight="500">{TranslateString(1302, 'Total Supply')}</Text>
            <Text fontWeight="500" fontSize="14px">{totalSupply}</Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="14px" fontWeight="500">{TranslateString(1332, 'Max Supply')}</Text>
            <Text fontWeight="500" fontSize="14px">{cap}</Text>
          </Flex>
        </Content>
      </ModalContent>
      <Actions>
        <Button width="100%" onClick={handleConfirm}
          disabled={!account}
          isLoading={isConfirming}
          endIcon={isConfirming ? <AutoRenewIcon color="currentColor" spin /> : null}
          style={{
            background: 'linear-gradient(180deg, #DFBC70 0%, #B88513 100%)',
            boxShadow: 'none',
            margin: '0 auto',
            width: '80%',
          }}>
          {TranslateString(1324, 'CONFIRM')}
        </Button>
      </Actions>
      <ToastContainer toasts={toasts} onRemove={handleRemove} />
    </Modal>
  )
}

export default ConfirmCreateTokenModal
