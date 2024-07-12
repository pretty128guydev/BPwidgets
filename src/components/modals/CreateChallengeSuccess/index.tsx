import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  Modal,
  Content,
  SubmitButton,
  Caption,
  SubCaption,
  Buttons,
} from './styled'
import { actionCloseModal, actionShowModal } from '../../../actions/modal'
import { Overlay } from '@react-md/overlay'
import { getWalletCurrencySymbol } from '../../selectors/currency'

interface ICreateChallengeSuccessProps {
  colors: any
  actionCloseModal: () => void
  currencySymbol: string
  challenge: any
  isMobile: boolean
}

const CreateChallengeSuccess = (props: ICreateChallengeSuccessProps) => {
  const { challenge, colors, currencySymbol, actionCloseModal, isMobile } =
    props
  const { walletID, initialBalance, maxTotalLossPct, profitGoalPct } = challenge

  return (
    <>
      <Modal isMobile={isMobile} backgroundColor={colors.modalBackground}>
        <Caption colors={colors}>{t`Congratulations`}</Caption>
        <div style={{ flex: 1 }}>
          <SubCaption
            colors={colors}
          >{t`You have successfully created a new challenge`}</SubCaption>
          <Content colors={colors}>{`${t`Challenge`} #${walletID}`}</Content>
          <Content
            colors={colors}
          >{`${t`Balance`} ${currencySymbol}${parseFloat(
            initialBalance || '0'
          ).toFixed()}`}</Content>
          <Content colors={colors}>{`${t`Target`} ${currencySymbol}${(
            (parseFloat(initialBalance || '0') *
              parseFloat(profitGoalPct || '0')) /
            100
          ).toFixed()}`}</Content>
          <Content colors={colors}>{`${t`Drowdown limit`} ${parseFloat(
            maxTotalLossPct || '0'
          ).toFixed()}%`}</Content>
        </div>
        <Buttons>
          <SubmitButton width={100} onClick={actionCloseModal} colors={colors}>
            {t`Start`}
          </SubmitButton>
        </Buttons>
      </Modal>
      <Overlay
        id="modal-overlay"
        visible={true}
        style={{ zIndex: 40 }}
        onRequestClose={() => {}}
      />
    </>
  )
}
const mapStateToProps = (state: any) => ({
  colors: state.theme,
  currencySymbol: getWalletCurrencySymbol(state),
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionCloseModal,
  actionShowModal,
})(CreateChallengeSuccess)
