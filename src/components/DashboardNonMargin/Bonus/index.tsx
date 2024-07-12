import React from 'react'
import { connect } from 'react-redux'
import {
  DashboardCardName,
  DashboardCardValue,
  DashboardCardWrapper,
} from '../styled'
import { t } from 'ttag'
import { DashboardBonusSpace } from './styled'
import { formatCurrency } from '../../selectors/currency'
import { IWalletDetails } from '../../../core/API'
import { FakeData } from '../../../shares/fakeData'

interface IDashboardBonusProps {
  colors: any
  wallet: any
  isMobile: boolean
  formatCurrency: (input: number) => string
  equity: number
  marginUsed: number
  openPnL: number
  activeWallet: IWalletDetails
}

const DashboardBonus = ({
  colors,
  isMobile,
  wallet,
  formatCurrency,
  equity,
  marginUsed,
  openPnL,
  activeWallet,
}: IDashboardBonusProps) => {
  // const colors = FakeData.theme

  return (
    <DashboardBonusSpace isMobile={isMobile}>
      <DashboardCardWrapper colors={colors}>
        <DashboardCardName colors={colors}>{t`Free Margin`}</DashboardCardName>
        <DashboardCardValue color={colors.primaryText}>
          {formatCurrency(equity - marginUsed)}
        </DashboardCardValue>
      </DashboardCardWrapper>

      <DashboardCardWrapper colors={colors}>
        <DashboardCardName colors={colors}>{t`Open P&L`}</DashboardCardName>
        <DashboardCardValue
          color={colors.primaryText}
          colors={colors}
          className={openPnL >= 0 ? 'high-color' : 'low-color'}
        >
          {formatCurrency(openPnL)}
        </DashboardCardValue>
      </DashboardCardWrapper>

      <DashboardCardWrapper colors={colors}>
        <DashboardCardName
          colors={colors}
        >{t`Available Bonus`}</DashboardCardName>
        <DashboardCardValue color={colors.secondaryText}>
          {formatCurrency(activeWallet.availableBonus)}
        </DashboardCardValue>
      </DashboardCardWrapper>
    </DashboardBonusSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  wallet: state.wallets.activeWallet,
  bonusWallet: state.trading.bonusWallet,
  formatCurrency: formatCurrency(state),
  isMobile: state.registry.isMobile,
  equity: state.wallets.equity,
  marginUsed: state.wallets.marginUsed,
  openPnL: state.wallets.openPnL,
  activeWallet: state.wallets.activeWallet,
})

export default connect(mapStateToProps)(DashboardBonus)
