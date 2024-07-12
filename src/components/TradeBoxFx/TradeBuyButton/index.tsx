import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  actionSubmitTrade,
  actionSetCurrentDirection,
} from '../../../actions/trading'
import Images from '../../../assets/images'
import { IInstrument } from '../../../core/API'
import { convertHexToRGBA, isMobileLandscape } from '../../../core/utils'
import { Colors } from '../../../models/color'
import { TradeDirection } from '../../../models/instrument'
import { IQuote } from '../../../reducers/quotes'
import { currencyToString } from '../../../shares/functions'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../../selectors/instruments'
import './index.scss'

interface ITradeSaleButtonProps {
  onClick: () => void
  colors?: any
  currentInstrument: IInstrument
  selectedDirection: TradeDirection
  errors: Object
  quote: IQuote | {}
  actionSetCurrentDirection: (value: number | null) => void
  actionSubmitTrade: (value: any) => void
  isMobile?: boolean
  disabled?: boolean
}

const TradeBuyButton = (props: ITradeSaleButtonProps) => {
  const ask = (props.quote as IQuote).ask
  const { precision } = props.currentInstrument
  const isSlected = props.selectedDirection === TradeDirection.up

  const getColor = () => {
    if (props.disabled) {
      return {
        backgroundColor: 'transparent',
        text: props.colors?.greyOut,
        border: `2px solid ${props.colors?.greyOut}`,
      }
    }
    if (isSlected) {
      return {
        backgroundColor: convertHexToRGBA(props.colors?.primaryDefault, 0.5),
        text: props.colors?.secondaryText,
        border: `2px solid ${props.colors?.primaryDefault}`,
      }
    }

    return {
      backgroundColor: 'transparent',
      text: props.colors?.primaryDefault,
      border: `1px solid ${props.colors?.primaryDefault}`,
    }
  }

  const btnColor = getColor()

  const lastString = currencyToString(ask, precision)
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
    <div
      className="trade-box-buy-btn trade-box-btn"
      style={{
        backgroundColor: btnColor.backgroundColor,
        color: btnColor.text,
        border: btnColor.border,
        flexDirection:
          props.isMobile && !isMobileLandscape(props.isMobile)
            ? 'row'
            : 'column',
      }}
      onClick={() => props.onClick && props.onClick()}
    >
      {(!props.isMobile || isMobileLandscape(props.isMobile)) && (
        <div>
          <Images.ArrowUpRight
            fill={btnColor.text}
            width={props.isMobile ? 14 : 9}
            height={props.isMobile ? 14 : 9}
          />
          <span
            style={{ color: btnColor.text }}
            className={`trade-box-btn-title ${
              props.isMobile ? 'title-mobile' : ''
            }`}
          >{t`Buy`}</span>
        </div>
      )}
      {props.isMobile && !isMobileLandscape(props.isMobile) && (
        <>
          <Images.ArrowUpRight
            fill={btnColor.text}
            width={props.isMobile ? 14 : 9}
            height={props.isMobile ? 14 : 9}
          />
          <span
            style={{ color: btnColor.text }}
            className={`trade-box-btn-title ${
              props.isMobile ? 'title-mobile' : ''
            }`}
          >{t`Buy`}</span>
        </>
      )}
      <div style={{ position: 'relative' }}>
        <span
          className={`first-quote-btn ${
            props.isMobile && !isMobileLandscape(props.isMobile)
              ? 'quote-mobile'
              : ''
          }`}
        >
          {firstQuote}
          <span className="end-quote-btn">
            {endQuote}
            <sup className="end-quote-sup-btn">{endQuoteSup}</sup>
          </span>
        </span>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  selectedDirection: state.trading.selectedDirection,
  currentInstrument: getInstrumentObject(state),
  errors: {},
  quote: lastQuoteRiskForSelectedInstrument(state as never),
})

export default connect(mapStateToProps, {
  actionSetCurrentDirection,
  actionSubmitTrade,
})(TradeBuyButton)
