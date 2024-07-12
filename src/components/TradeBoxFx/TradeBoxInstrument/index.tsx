import React from 'react'
import { connect } from 'react-redux'
import { actionSetPendingOrder } from '../../../actions/trading'
import { IInstrument } from '../../../core/API'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../../selectors/instruments'
import './index.scss'
import { toString } from 'lodash'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../../ChartContainer/InstrumentsBar/asset-placeholder.svg'
import InstrumentDailyChange from '../../ChartContainer/Instruments/instrumentDailyChange'

interface ITradeSaleButtonProps {
  //   onClick: () => void
  colors: any
  currentInstrument?: IInstrument
  lastQuote: any
  isMobile?: boolean
}

const TradeBoxInstrument = (props: ITradeSaleButtonProps) => {
  const { open, last } = props.lastQuote
  const isUp = last >= open
  const lastString = toString(last)
  const firstQuote = lastString.substring(0, lastString.length - 2)
  const endQuote = lastString.substring(
    lastString.length - 2,
    lastString.length - 1
  )
  const endQuoteSup = lastString.substring(
    lastString.length - 1,
    lastString.length
  )
  return (
    <div className="trade-instrument">
      <ImageWrapper
        alt={`instrument ${props.currentInstrument?.instrumentID}`}
        placeholderSrc={AssetPlaceholder}
        src={`${process.env.PUBLIC_URL}/static/icons/instruments/${props.currentInstrument?.instrumentID}.svg`}
      ></ImageWrapper>
      <div className="trade-instrument-detail">
        <div
          className="trade-instrument-name"
          style={{ color: props.colors.tradebox.oneClickTradeText }}
        >
          {props.currentInstrument?.name}
        </div>
        <div
          className="trade-instrument-price"
          style={{
            color: isUp
              ? props.colors.tradebox.highText
              : props.colors.tradebox.lowText,
          }}
        >
          {!!last && !!open && (
            <div className="trade-instrument-current-price">
              <span className="first-quote">
                {firstQuote}
                <span className="end-quote">
                  {endQuote}
                  <sup className="end-quote-sup">{endQuoteSup}</sup>
                </span>
              </span>
            </div>
          )}
          <InstrumentDailyChange
            withArrow={true}
            withSign={true}
            fontSize={14}
            instrumentID={props.currentInstrument?.instrumentID as number}
            colors={props.colors}
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  currentInstrument: getInstrumentObject(state),
  colors: state.theme,
  pendingOrder: state.trading.pendingOrder,
  lastQuote: lastQuoteRiskForSelectedInstrument(state),
})

export default connect(mapStateToProps, {
  actionSetPendingOrder,
})(TradeBoxInstrument)
