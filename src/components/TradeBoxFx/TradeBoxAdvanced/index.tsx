import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../../selectors/instruments'
import './index.scss'
import { Colors } from '../../../models/color'
import { actionSetTradingError } from '../../../actions/trading'
import { IQuote } from '../../../reducers/quotes'
import { IInstrument } from '../../../core/API'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import Images from '../../../assets/images'

interface ITradeBoxAdvancedProps {
  colors: any
  quote: IQuote
  stake: number
  selectedDirection: number
  stopLoss: number
  pendingOrder: number
  currentInstrument: IInstrument
  leverage: number
  profit: number
  currencySymbol: string
}

const TradeBoxAdvanced = (props: ITradeBoxAdvancedProps) => {
  return (
    <>
      <div className="advanced-header" onClick={() => {}}>
        <span className="advanced-title">{t`Advanced`}</span>
        <span className="arrow-order">
          <Images.ArrowDown width={18} height={18} stroke="#ffffff" />
        </span>
      </div>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  currentInstrument: getInstrumentObject(state),
  colors: state.theme,
  selectedDirection: state.trading.selectedDirection,
  stake: state.trading.stake,
  stopLoss: state.trading.stopLoss,
  pendingOrder: state.trading.pendingOrder,
  quote: lastQuoteRiskForSelectedInstrument(state as never) as IQuote,
  leverage: state.leverage,
  profit: state.trading.profit,
  currencySymbol: getWalletCurrencySymbol(state),
})

export default connect(mapStateToProps, {
  actionSetTradingError,
})(TradeBoxAdvanced)
