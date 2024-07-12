import React from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import { ThemeContextConsumer } from '../../ThemeContext'
import { InfoContainer, SellBackContainer, SellBackButton } from './styled'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { IQuote } from '../../../reducers/quotes'
import { actionDoSellback, actionRefreshTrades } from '../../../actions/trades'
import { formatCurrency } from '../../selectors/currency'
import { api } from '../../../core/createAPI'
import { IInstrument, IUserInfo, IWalletDetails } from '../../../core/API'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../../selectors/instruments'
import { calculatePnL } from '../../../sagas/tradingHelper'
import './ChartPostionInfo.scss'
import { Colors } from '../../../models/color'
import { TradeDirection } from '../../../models/instrument'
import { AvailableCurrencies } from '../../../models/registry'

interface IPositionInfoProps {
  trade: IOpenTrade
  quote: IQuote | {}
  timeleft: number
  x: number
  y: number
  userInfo: IUserInfo
  formatCurrency: (value: any) => string
  actionDoSellback: (trade: any, amount: number) => void
  onClose: () => void
  actionRefreshTrades: () => void
  colors: any
  currentInstrument: IInstrument
  currencies: AvailableCurrencies
  wallets: any
}

const PositionInfo = ({
  trade,
  quote,
  timeleft,
  x,
  y,
  userInfo,
  currentInstrument,
  formatCurrency,
  onClose,
  actionDoSellback,
  actionRefreshTrades,
  colors,
  currencies,
  wallets,
}: IPositionInfoProps) => {
  const { stake, leverage, direction, tradeID, swaps, walletID } = trade

  const currentPrice =
    direction === TradeDirection.up
      ? (quote as IQuote).bid
      : (quote as IQuote).ask

  const onCloseTrade = () => {
    return api.closeTrades([[+tradeID, +walletID]]).then(() => {
      onClose()
      actionRefreshTrades()
    })
  }

  if (timeleft <= 0) {
    onClose()
  }

  if ((trade as any).isClosed) {
    return null
  }

  const getCurrencySymbol = () => {
    if (!walletID) return
    const wallet = wallets.find((w: IWalletDetails) => w.walletID === walletID)
    return currencies[wallet.baseCurrency]?.currencySymbol || '$'
  }

  const pnl = calculatePnL(trade, currentPrice) - swaps

  return (
    <ThemeContextConsumer>
      {(colors: any) => (
        <InfoContainer colors={colors} x={x} y={y} direction={direction}>
          <div className="trade-attribute">
            <div
              style={{ color: colors.tradebox.oneClickTradeText }}
            >{t`Trade ID`}</div>
            <div>{tradeID}</div>
          </div>
          <div className="trade-attribute">
            <div style={{ color: colors.tradebox.oneClickTradeText }}>
              {t`Leverage`}
            </div>
            <div>{leverage}</div>
          </div>
          <div className="trade-attribute">
            <div style={{ color: colors.tradebox.oneClickTradeText }}>
              {t`Amount`}
            </div>
            <div>
              {getCurrencySymbol()} {stake.toFixed(2)}
            </div>
          </div>
          <div className="trade-attribute open-pnl">
            <div style={{ color: colors.tradebox.oneClickTradeText }}>
              {t`Open P&L`}
            </div>
            <div>
              {getCurrencySymbol()} {pnl.toFixed(2)}
            </div>
          </div>
          <SellBackContainer>
            <SellBackButton
              onClick={onCloseTrade}
              colors={colors}
              direction={direction}
            >
              {t`Close Trade`}
            </SellBackButton>
          </SellBackContainer>
        </InfoContainer>
      )}
    </ThemeContextConsumer>
  )
}

const mapStateToProps = (state: any) => ({
  formatCurrency: formatCurrency(state),
  userInfo: state.account.userInfo,
  quote: lastQuoteRiskForSelectedInstrument(state as never),
  colors: state.theme,
  currentInstrument: getInstrumentObject(state),
  wallets: state.wallets.wallets,
  currencies: state.registry.data.availableCurrencies,
})

export default connect(mapStateToProps, {
  actionDoSellback,
  actionRefreshTrades,
})(PositionInfo)
