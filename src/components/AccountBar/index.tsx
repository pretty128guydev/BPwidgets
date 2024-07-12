/**
 * Implements a bar under the header with user data:
 * connected status, practice-real switch, balance, invested, equity, p&l, available, profit bonus
 * AccountBar > TextGroup > Caption ^ Value
 */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { formatCurrency } from '../selectors/currency'
import {
  actionSetOpenStakePerInstrument,
  actionSetEquity,
  actionSetMarginUsed,
  actionSetOpenPnL,
} from '../../actions/wallets'
import { AccountBarContainer, TextGroup, Value, Caption } from './styled'
import { ThemeContextConsumer } from '../ThemeContext'
import WalletSelector from '../WalletSellector/WalletSelector'
import { IClosedTrade, IOpenTrade } from '../../core/interfaces/trades'
import { filter, groupBy, sumBy } from 'lodash'
import { IInstrument, IWalletDetails } from '../../core/API'
import { calculateEquity } from '../../shares/functions'
import { openPnlCal } from '../../core/utils'
import { QuotesMap } from '../../reducers/quotes'
import { getCurrencyPrecision } from '../selectors/currency'

export const BONUS_NAMES: any = {
  'bonus-name-Balance Bonus': t`Balance Bonus`,
  'bonus-name-Smart Bonus': t`Smart Bonus`,
  'bonus-name-Pending Bonus': t`Pending Bonus`,
  'bonus-name-Profit Bonus': t`Profit Bonus`,
  'bonus-name-Sticky Bonus': t`Sticky Bonus`,
  'bonus-name-No Deposit Bonus': t`No Deposit Bonus`,
}

interface IAccountBarProps {
  bonusWallet: any
  hideBonusWallet: boolean
  formatCurrency: (input: number) => string
  openTrades: IOpenTrade[]
  closedTrades: IClosedTrade[]
  activeWallet: IWalletDetails
  instruments: IInstrument[]
  quotes: QuotesMap
  precision: number
  actionSetEquity: (value: number) => void
  actionSetOpenPnL: (value: number) => void
  actionSetOpenStakePerInstrument: (value: any) => void
  actionSetMarginUsed: (value: any) => void
  instrument: number
}

const AccountBar = (props: IAccountBarProps) => {
  const {
    activeWallet,
    openTrades,
    instruments,
    quotes,
    formatCurrency,
    hideBonusWallet,
    actionSetEquity,
    actionSetMarginUsed,
    actionSetOpenPnL,
    actionSetOpenStakePerInstrument,
    instrument,
  } = props

  const { availableCash, availableBonus } = activeWallet

  const openTradesPerWallet = filter(openTrades, {
    walletID: activeWallet.walletID,
  })

  const openTradesPerInstrument = groupBy(openTradesPerWallet, 'instrumentID')

  if (!Object.keys(openTradesPerInstrument).includes(`${instrument}`))
    openTradesPerInstrument[instrument] = []

  const openStakePerInstrument = Object.keys(openTradesPerInstrument).map(
    (key) => {
      const sumBuy =
        sumBy(openTradesPerInstrument[key], (item) => {
          const { stake, direction, instrumentID } = item
          const instrument = instruments[instrumentID]
          if (!instrument) return 0
          return direction === 1 ? stake : 0
        }) || 0
      const sumSell =
        sumBy(openTradesPerInstrument[key], (item) => {
          const { stake, direction, instrumentID } = item
          const instrument = instruments[instrumentID]
          if (!instrument) return 0
          return direction === -1 ? stake : 0
        }) || 0

      return { instrumentID: key, buy: sumBuy, sell: sumSell }
    }
  )

  const openStake =
    sumBy(openStakePerInstrument, (item) => {
      const { buy, sell } = item
      return buy > sell ? buy : sell
    }) || 0

  const openPnL =
    sumBy(openTradesPerWallet, (item) => {
      const instrument = instruments[item.instrumentID]
      if (!instrument) return 0
      const quote = quotes[item.instrumentID]
      return openPnlCal(item, quote)
    }) || 0

  // const closedTradesPerWallet = filter(closedTrades, {
  //   walletID: activeWallet.walletID,
  // })
  // const closedPnL = sumBy(closedTradesPerWallet, 'pnl') || 0

  const marginUsed = openStake // + openPnL
  const equity = calculateEquity(activeWallet, openPnL)
  const marginLevel =
    marginUsed === 0 ? 0 : ((equity / marginUsed) * 100).toFixed(2)

  useEffect(() => {
    actionSetOpenStakePerInstrument(openStakePerInstrument)
  }, [actionSetOpenStakePerInstrument, openStakePerInstrument])

  useEffect(() => {
    actionSetEquity(equity)
  }, [actionSetEquity, equity])

  useEffect(() => {
    actionSetMarginUsed(marginUsed)
  }, [actionSetMarginUsed, marginUsed])

  useEffect(() => {
    actionSetOpenPnL(openPnL)
  }, [actionSetOpenPnL, openPnL])

  return (
    <ThemeContextConsumer>
      {(colors: any) => (
        <AccountBarContainer id="account-bar" colors={colors}>
          <div className="information-group">
            <TextGroup>
              <Caption colors={colors}>{t`Balance`}</Caption>
              <Value color={colors.primaryText}>
                {formatCurrency(availableCash)}
              </Value>
            </TextGroup>
            <TextGroup>
              <Caption colors={colors}>{t`Equity`}</Caption>
              <Value color={colors.secondaryText}>
                {formatCurrency(equity)}
              </Value>
            </TextGroup>
            <TextGroup>
              <Caption colors={colors}>{t`Margin Used`}</Caption>
              <Value color={colors.primaryText}>{`${formatCurrency(
                marginUsed
              )}${marginLevel === 0 ? '' : ` (${marginLevel}%)`}`}</Value>
            </TextGroup>
            <TextGroup>
              <Caption colors={colors}>{t`Free Margin`}</Caption>
              <Value color={colors.secondaryText}>
                {formatCurrency(equity - marginUsed)}
              </Value>
            </TextGroup>
            <TextGroup>
              <Caption colors={colors}>{t`Open P&L`}</Caption>
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
                <Caption colors={colors}>{t`Available bonus`}</Caption>
                <Value color={colors.secondaryText}>
                  {formatCurrency(availableBonus)}
                </Value>
              </TextGroup>
            )}
          </div>
          <WalletSelector />
        </AccountBarContainer>
      )}
    </ThemeContextConsumer>
  )
}

const mapStateToProps = (state: any) => ({
  bonusWallet: state.trading.bonusWallet,
  hideBonusWallet: state.registry.data.partnerConfig.hideBonusWallet,
  formatCurrency: formatCurrency(state),
  openTrades: state.trades.open,
  closedTrades: state.trades.closed,
  activeWallet: state.wallets.activeWallet,
  instruments: state.instruments,
  quotes: state.quotes,
  precision: getCurrencyPrecision(state),
  instrument: state.trading.selected,
})

export default connect(mapStateToProps, {
  actionSetOpenStakePerInstrument,
  actionSetEquity,
  actionSetMarginUsed,
  actionSetOpenPnL,
})(AccountBar)
