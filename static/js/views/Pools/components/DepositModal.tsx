import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal } from 'moondoge-uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string, decimals: number) => void
  onDismiss?: () => void
  tokenName?: string
  stakingTokenDecimals?: number
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = '',
  stakingTokenDecimals = 18,
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    const balance = getFullDisplayBalance(max, stakingTokenDecimals)
    return new BigNumber(balance).toFixed(2).toString()
  }, [max, stakingTokenDecimals])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={`${TranslateString(316, 'Stake')} ${tokenName} Tokens`} onDismiss={onDismiss}>
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button width="100%" variant="secondary" onClick={onDismiss} style={{ background: 'linear-gradient(180deg, #FEF6E3 0%, #FEC23D 100%)', border: 'none' }}>
          {TranslateString(462, 'Cancel')}
        </Button>
        <Button
          width="100%"
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val, stakingTokenDecimals)
            setPendingTx(false)
            onDismiss()
          }}
          variant="defaultIcon"
        >
          {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default DepositModal
