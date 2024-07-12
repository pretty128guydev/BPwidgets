import React from 'react'
import { connect } from 'react-redux'
import {
  actionSetProfitCoe,
  actionSetStopLossCoe,
} from '../../../actions/trading'
import { IInstrument, IWalletDetails } from '../../../core/API'
import { IQuote } from '../../../reducers/quotes'
import {
  calculateStopLoss,
  calculateTakeProfit,
  calculateTakeProfitPayout,
} from '../../../sagas/tradingHelper'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../../selectors/instruments'
import { IChallengeDashboardData } from '../../Dashboard/interfaces'

interface ITradeBoxCalculateProps {
  colors: any
  quote: IQuote
  stake: number
  selectedDirection: number
  stopLoss: number
  leverage: number
  pendingOrder: number
  currentInstrument: IInstrument
  profit: number
  currencySymbol: string
  profitPercent: number
  stopLossPercent: number
  actionSetStopLossCoe: (value: number) => void
  actionSetProfitCoe: (value: number) => void
  activeWallet: IWalletDetails
  challengeDashboard: IChallengeDashboardData
}

const TradeBoxCalculate = (props: ITradeBoxCalculateProps) => {
  const {
    stake,
    selectedDirection,
    stopLoss,
    leverage,
    pendingOrder,
    profit,
    actionSetStopLossCoe,
    actionSetProfitCoe,
    activeWallet,
    challengeDashboard,
    currentInstrument,
  } = props

  const { tradingConfig } = currentInstrument
  let currentLeverage = leverage

  if (activeWallet.challengeID) {
    const { state } = challengeDashboard
    if (
      state.leverageCap &&
      Number(state.leverageCap) < tradingConfig.defaultLeverage
    ) {
      currentLeverage = Number(state.leverageCap)
    }
  }

  const { bid, ask } = props.quote

  const stopLossCoe = calculateStopLoss({
    ask,
    bid,
    stake,
    pendingOrder,
    stopLossAmount: stopLoss,
    direction: selectedDirection,
    currentLeverage,
  })

  const profitCoe = calculateTakeProfit({
    ask,
    bid,
    stake,
    pendingOrder,
    takeProfitPayout: calculateTakeProfitPayout(profit, stake),
    direction: selectedDirection,
    currentLeverage,
  })

  actionSetStopLossCoe(parseFloat(Number(stopLossCoe).toFixed(5)) || 0)
  actionSetProfitCoe(parseFloat(Number(profitCoe).toFixed(5)) || 0)

  return <></>
}

const mapStateToProps = (state: any) => ({
  currentInstrument: getInstrumentObject(state),
  leverage: state.trading.currentLeverage,
  colors: state.theme,
  selectedDirection: state.trading.selectedDirection,
  stake: state.trading.stake,
  stopLoss: state.trading.stopLoss,
  pendingOrder: state.trading.pendingOrder,
  quote: lastQuoteRiskForSelectedInstrument(state as never) as IQuote,
  profit: state.trading.profit,
  currencySymbol: getWalletCurrencySymbol(state),
  profitPercent: state.trading.profitPercent,
  stopLossPercent: state.trading.stopLossPercent,
  activeWallet: state.wallets.activeWallet,
  challengeDashboard: state.wallets.challengeDashboard,
})

export default connect(mapStateToProps, {
  actionSetStopLossCoe,
  actionSetProfitCoe,
})(TradeBoxCalculate)
