import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  Modal,
  SubmitButton,
  Caption,
  Buttons,
  PaymentContainer,
  PaymentContent,
} from './styled'
import { actionCloseModal } from '../../../actions/modal'
import { Overlay } from '@react-md/overlay'
import { CallPayCreditCardIcon } from './callPayCreditCardIcon'
import { CryptoIcon } from './cryptoIcon'
import UserStorage from '../../../core/UserStorage'
import { api } from '../../../core/createAPI'
import GlobalLoader from '../../ui/GlobalLoader'
import CloseBtnRound from '../../SidebarNew/CloseBtnRound'
import { actionSetWallets } from '../../../actions/wallets'
import { IWalletDetails } from '../../../core/API'

interface IPaymentLinkModalProps {
  colors: any
  price: number
  packageConfigID: string
  actionCloseModal: () => void
  isMobile: boolean
  actionSetWallets: (
    wallets: IWalletDetails[],
    setActiveWallet?: number
  ) => void
}

const PaymentLinkModal = (props: IPaymentLinkModalProps) => {
  const {
    colors,
    actionSetWallets,
    actionCloseModal,
    isMobile,
    price,
    packageConfigID,
  } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [selected, setSelected] = useState<number>(1)

  const onClickBuy = () => {
    setLoading(true)

    api.addChallengeToUser(packageConfigID).then((data) => {
      const { success, challenge } = data

      if (success) {
        const { state } = challenge
        const { packageID } = state

        api.fetchWalletDetails().then((wls: IWalletDetails[]) => {
          const wallets = wls.reverse()
          const walletsFilter = wallets.filter(
            (wallet) =>
              !wallet.challengeID ||
              (wallet.challengeID &&
                ![5, 6].includes(wallet.challengeStatus || 0))
          )

          const walletIndex = walletsFilter.findIndex(
            ({ walletID }) => walletID === state.walletID
          )

          actionSetWallets(walletsFilter, walletIndex)

          if (selected === 1) {
            api
              .getChallengePaymentLink(packageID, price, state.walletID)
              .then((data) => {
                setLoading(false)
                const { success, link } = data
                if (success && link) {
                  UserStorage.setChallengeWallet(JSON.stringify(state))
                  window.open(link, '_blank')
                }
                actionCloseModal()
              })
          } else {
            api
              .getChallengeCryptoPaymentLink(packageID, price, state.walletID)
              .then((data) => {
                setLoading(false)
                const { success, link } = data
                if (success && link) {
                  UserStorage.setChallengeWallet(JSON.stringify(state))
                  window.open(link, '_blank')
                }
                actionCloseModal()
              })
          }
        })
      }
    })
  }

  return (
    <>
      <Modal isMobile={isMobile} backgroundColor={colors.modalBackground}>
        {loading && <GlobalLoader />}
        <Caption colors={colors}>{t`Pay for challenge`}</Caption>
        <CloseBtnRound colors={colors} onClick={actionCloseModal} />
        <PaymentContainer>
          <PaymentContent
            colors={colors}
            isActive={selected === 1}
            onClick={() => selected !== 1 && setSelected(1)}
            style={{ borderColor: selected === 1 ? colors.primary : '#8491A3' }}
          >
            <CallPayCreditCardIcon
              width="55"
              height="35"
              color={selected === 1 ? colors.primary : '#8491A3'}
            />
            <span
              style={{ color: selected === 1 ? colors.primary : '#8491A3' }}
            >{t`CallPay Credit Card`}</span>
          </PaymentContent>
          <PaymentContent
            colors={colors}
            isActive={selected === 2}
            onClick={() => selected !== 2 && setSelected(2)}
            style={{ borderColor: selected === 2 ? colors.primary : '#8491A3' }}
          >
            <CryptoIcon
              width="35"
              height="35"
              color={selected === 2 ? colors.primary : '#8491A3'}
            />
            <span
              style={{ color: selected === 2 ? colors.primary : '#8491A3' }}
            >{t`Crypto`}</span>
          </PaymentContent>
        </PaymentContainer>
        <Buttons>
          <SubmitButton width={100} onClick={onClickBuy} colors={colors}>
            {t`Buy`}
          </SubmitButton>
        </Buttons>
      </Modal>
      <Overlay
        id="modal-overlay"
        visible={true}
        style={{ zIndex: 99 }}
        onRequestClose={actionCloseModal}
      />
    </>
  )
}
const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionCloseModal,
  actionSetWallets,
})(PaymentLinkModal)
