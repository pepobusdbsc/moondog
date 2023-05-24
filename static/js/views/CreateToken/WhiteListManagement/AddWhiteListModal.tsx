import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { PromiEvent } from 'web3-core'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { useWeb3React } from '@web3-react/core'
import { Button, InjectedModalProps, Modal, Text, Flex, AutoRenewIcon, Input } from 'moondoge-uikit'
import useI18n from 'hooks/useI18n'
import { useAddTaxWhiteList, useAddYieldWhiteList } from 'hooks/useErc20Factory'

interface Info {
  coinAddress: string,
  type: string | number,
}
interface ModalProps extends InjectedModalProps {
  onSuccess?: () => void
  onClaim?: () => PromiEvent<Contract>
  tokenParameters: Info
}

const ModalContent = styled.div`
  margin-bottom: 16px;
`
const StyledInput = styled(Input)`
  height: 60px;
  background: ${({ theme }) => theme.isDark ? '#2d2a25' : '#FBFAF6'};
  opacity: 1;
  border-radius: 10px;
  width:420px;

`;
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
const AddWhiteListModal: React.FC<ModalProps> = ({ onDismiss, tokenParameters, onSuccess }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const [address, setAddress] = useState("")
  const [error, setError] = useState(null)
  const { type, coinAddress } = tokenParameters

  const params = {
    contract: coinAddress,
    address,
  }

  const { onAdd } = useAddYieldWhiteList(params)
  const { onTaxAdd } = useAddTaxWhiteList(params)

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      setAddress(e.currentTarget.value);
    }
    return null
  }
  const handleConfirm = async () => {
    if (address) {
      const isValidAddress = Web3.utils.isAddress(address);
      if (!isValidAddress) {
        setError(TranslateString(999, 'Please enter a valid team address'))
        return false;
      }
    }
    setError("")
    try {
      setIsConfirming(true)
      let txh: any = {}
      if (type === 1) {
        txh = await onAdd();
      } else {
        txh = await onTaxAdd();
      }
      if (txh) {
        const apiUrl = process.env.REACT_APP_IDO_API;
        const response = await fetch(`${apiUrl}/api/coin/addWhiteList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coinAddress,
            type,
            userAddress: address,
          })
        })
        const responseData = await response.json();
        if (responseData.code === 0) {
          setIsConfirming(false)
          onDismiss();
          onSuccess()
        }
      }
    } catch (err) {
      console.log(err)
      setIsConfirming(false)
    }
    return 111
  }

  return (
    <Modal title={`${TranslateString(1273, 'Add')}${TranslateString(1343, 'Whitelist')}`} onDismiss={onDismiss}>
      <ModalContent>
        <StyledInput type="text" onChange={handleInputChange} placeholder="Enter address" value={address} />
      </ModalContent>
      <Actions>
        {error && (
          <Text color="failure" mt="6px" fontSize="14px">
            {error}
          </Text>
        )}
        <Button width="100%" onClick={handleConfirm}
          disabled={!account || !address}
          isLoading={isConfirming}
          endIcon={isConfirming ? <AutoRenewIcon color="currentColor" spin /> : null}
          style={{
            background: 'linear-gradient(180deg, #DFBC70 0%, #B88513 100%)',
            boxShadow: 'none',
            margin: '0 auto',
            width: '100%',
          }}>
          {TranslateString(1324, 'CONFIRM')}
        </Button>
      </Actions>
    </Modal>
  )
}

export default AddWhiteListModal
