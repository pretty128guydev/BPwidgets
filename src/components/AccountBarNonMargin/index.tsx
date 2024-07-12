/* eslint-disable react-hooks/rules-of-hooks */
/**
 * Implements a bar under the header with user data:
 * connected status, practice-real switch, balance, invested, equity, p&l, available, profit bonus
 * AccountBar > TextGroup > Caption ^ Value
 */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { formatCurrency } from '../selectors/currency'
import { actionPracticeMode } from '../../actions/account'
import { actionSelectBonusWalletRemote } from '../../actions/trading'
import { AccountBarContainer, TextGroup, Value, Caption } from './styled'
import { ThemeContextConsumer } from '../ThemeContext'
import WalletSelector from '../WalletSellector/WalletSelector'
import { IOpenTrade } from '../../core/interfaces/trades'
import { filter, sumBy } from 'lodash'
import { IWalletDetails } from '../../core/API'
import { actionSetEquity, actionSetOpenPnL } from '../../actions/wallets'
import { QuotesMap } from '../../reducers/quotes'
import { openPnlCal } from '../../core/utils'

export const BONUS_NAMES: any = {
  'bonus-name-Balance Bonus': t`Balance Bonus`,
  'bonus-name-Smart Bonus': t`Smart Bonus`,
  'bonus-name-Pending Bonus': t`Pending Bonus`,
  'bonus-name-Profit Bonus': t`Profit Bonus`,
  'bonus-name-Sticky Bonus': t`Sticky Bonus`,
  'bonus-name-No Deposit Bonus': t`No Deposit Bonus`,
}

interface IAccountBarProps {
  wallets: null | any
  bonusWallet: any
  practiceMode: boolean
  hidePracticeButton: boolean
  hideBonusWallet: boolean
  allowPracticeModeChange: boolean
  formatCurrency: (input: number) => string
  actionSelectBonusWalletRemote: (wallet: any) => void
  actionPracticeMode: (mode: boolean) => void
  openTrades: IOpenTrade[]
  activeWallet: IWalletDetails
  actionSetEquity: (value: number) => void
  actionSetOpenPnL: (value: number) => void
  quotes: QuotesMap
}

const AccountBar = (props: IAccountBarProps) => {
  const {
    formatCurrency,
    hideBonusWallet,
    activeWallet,
    openTrades,
    wallets,
    actionSetEquity,
    actionSetOpenPnL,
    quotes,
  } = props

  if (!wallets) {
    return null
  }

  const { availableCash, availableBonus, reserved } = activeWallet

  const tradesPerWallet = filter(openTrades, {
    walletID: activeWallet.walletID,
  })
  const openPnL =
    sumBy(tradesPerWallet, (item) =>
      openPnlCal(item, quotes[item.instrumentID])
    ) || 0

  const equity = openPnL + reserved + availableCash

  useEffect(() => {
    actionSetEquity(equity)
  }, [actionSetEquity, equity])

  useEffect(() => {
    actionSetOpenPnL(openPnL)
  }, [actionSetOpenPnL, openPnL])

  return (
    <ThemeContextConsumer>
      {(colors: any) => (
        <AccountBarContainer id="account-bar" colors={colors}>
          <div className="information-group">
            <TextGroup>
              <Caption colors={colors}>{t`Balance`}:</Caption>
              <Value color={colors.primaryText}>
                {formatCurrency(availableCash)}
              </Value>
            </TextGroup>
            <TextGroup>
              <Caption colors={colors}>{t`Equity`}:</Caption>
              <Value color={colors.secondaryText}>
                {formatCurrency(equity)}
              </Value>
            </TextGroup>
            <TextGroup>
              <Caption colors={colors}>{t`Invested`}:</Caption>
              <Value color={colors.primaryText}>
                {formatCurrency(reserved)}
              </Value>
            </TextGroup>
            <TextGroup>
              <Caption colors={colors}>{t`Open P&L`}:</Caption>
              <Value
                color={
                  openPnL < 0
                    ? colors.tradebox.lowText
                    : colors.tradebox.highText
                }
              >
                {formatCurrency(openPnL)}
              </Value>
            </TextGroup>
            {!hideBonusWallet && (
              <TextGroup>
                <Caption colors={colors}>{t`Available bonus`}:</Caption>
                <Value color={colors.secondaryText}>
                  {formatCurrency(availableBonus)}
                </Value>
              </TextGroup>
            )}
          </div>
          <div style={{ minWidth: 260 }}>
            <WalletSelector></WalletSelector>
          </div>
        </AccountBarContainer>
      )}
    </ThemeContextConsumer>
  )
}

const mapStateToProps = (state: any) => ({
  wallets: state.wallets,
  bonusWallet: state.trading.bonusWallet,
  practiceMode: state.account.userInfo?.practiceMode,
  hidePracticeButton: state.registry.data.partnerConfig.hidePracticeButton,
  hideBonusWallet: state.registry.data.partnerConfig.hideBonusWallet,
  allowPracticeModeChange: state.account.userInfo?.allowPracticeModeChange,
  formatCurrency: formatCurrency(state),
  openTrades: state.trades.open,
  activeWallet: state.wallets.activeWallet,
  instruments: state.instruments,
  quotes: state.quotes,
})

export default connect(mapStateToProps, {
  actionPracticeMode,
  actionSelectBonusWalletRemote,
  actionSetEquity,
  actionSetOpenPnL,
})(AccountBar)
