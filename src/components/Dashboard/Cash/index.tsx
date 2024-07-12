import React from 'react'
import { connect } from 'react-redux'
import {
  DashboardCardName,
  DashboardCardValue,
  DashboardCardWrapper,
} from '../styled'
import { t } from 'ttag'
import { DashboardCashSpace } from './styled'
import { formatCurrency } from '../../selectors/currency'
import { IWalletDetails } from '../../../core/API'
import { FakeData } from '../../../shares/fakeData'

interface IDashboardCashProps {
  colors: any
  activeWallet: IWalletDetails
  isMobile: boolean
  formatCurrency: (input: number) => string
  equity: number
  marginUsed: number
}

const Index = ({
  colors,
  activeWallet,
  formatCurrency,
  isMobile,
  equity,
  marginUsed,
}: IDashboardCashProps) => {
  // const colors = FakeData.theme

  return (
    <DashboardCashSpace isMobile={isMobile}>
      <DashboardCardWrapper colors={colors}>
        <DashboardCardName colors={colors}>{t`Balance`}</DashboardCardName>
        <DashboardCardValue color={colors.accentDefault}>
          {formatCurrency(activeWallet.availableCash)}
        </DashboardCardValue>
      </DashboardCardWrapper>

      <DashboardCardWrapper colors={colors}>
        <DashboardCardName colors={colors}>{t`Equity`}</DashboardCardName>
        <DashboardCardValue color={colors.secondaryText}>
          {formatCurrency(equity)}
        </DashboardCardValue>
      </DashboardCardWrapper>

      <DashboardCardWrapper colors={colors}>
        <DashboardCardName colors={colors}>{t`Margin Used`}</DashboardCardName>
        <DashboardCardValue color={colors.secondaryText}>
          {formatCurrency(marginUsed)}
        </DashboardCardValue>
      </DashboardCardWrapper>
    </DashboardCashSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  wallets: state.wallets,
  formatCurrency: formatCurrency(state),
  isMobile: state.registry.isMobile,
  activeWallet: state.wallets.activeWallet,
  equity: state.wallets.equity,
  marginUsed: state.wallets.marginUsed,
})

export default connect(mapStateToProps)(Index)
