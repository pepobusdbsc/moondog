import React from 'react'
import { Button, useWalletModal } from 'moondoge-uikit'
import useAuth from 'hooks/useAuth'
import useI18n from 'hooks/useI18n'

const UnlockButton = (props) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)
  const { noIcon = false } = props
  const { width } = props
  const { margin } = props
  return (
    <>
      {
        noIcon ? <Button variant="square" scale="md" style={{ width: width || '294px', background: 'linear-gradient(180deg, #FEF6E3 0%, #FEC23D 100%)', margin, borderRadius: '25px', color: '#A56A46' }} onClick={onPresentConnectModal} {...props}>
          <span />
          {TranslateString(292, 'Connect Wallet')}
        </Button> :
          <Button variant="defaultIcon" scale="md" style={{ width: width || '294px' }} onClick={onPresentConnectModal} {...props}>
            <span />
            {TranslateString(292, 'Connect Wallet')}
          </Button>}
    </>
  )
}

export default UnlockButton
