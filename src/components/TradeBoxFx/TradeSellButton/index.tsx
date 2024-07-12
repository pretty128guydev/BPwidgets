import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import Images from '../../../assets/images'
import { IInstrument } from '../../../core/API'
import { Colors } from '../../../models/color'
import { TradeDirection } from '../../../models/instrument'
import { IQuote } from '../../../reducers/quotes'
import { currencyToString } from '../../../shares/functions'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../../selectors/instruments'
import './index.scss'
import { convertHexToRGBA, isMobileLandscape } from '../../../core/utils'

interface ITradeSaleButtonProps {
  onClick: () => void
  colors?: any
  currentInstrument: IInstrument
  selectedDirection: TradeDirection
  errors: Object
  quote: IQuote | {}
  isMobile?: boolean
  disabled?: boolean
}

const TradeSellButton = (props: ITradeSaleButtonProps) => {
  const bid = (props.quote as IQuote).bid
  const { precision } = props.currentInstrument
  const isSlected = props.selectedDirection === TradeDirection.down

  const getColor = () => {
    if (props.disabled) {
      return {
        backgroundColor: 'transparent',
        text: props.colors.greyOut,
        border: `2px solid ${props.colors.greyOut}`,
      }
    }
    if (isSlected) {
      return {
        backgroundColor: convertHexToRGBA(props.colors.primaryHue1, 0.5),
        text: props.colors.secondaryText,
        border: `2px solid ${props.colors.primaryHue1}`,
      }
    }
    return {
      backgroundColor: 'transparent',
      text: props.colors?.tradebox.lowActive,
      border: `1px solid ${props.colors?.tradebox.lowActive}`,
    }
  }

  const btnColor = getColor()

  const lastString = currencyToString(bid, precision)
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
      className="trade-box-sell-btn trade-box-btn"
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
          <Images.ArrowDownLeft
            fill={btnColor.text}
            width={props.isMobile ? 14 : 9}
            height={props.isMobile ? 14 : 9}
          />
          <span
            className={`trade-box-btn-title ${
              props.isMobile ? 'title-mobile' : ''
            }`}
            style={{ color: btnColor.text }}
          >{t`Sell`}</span>
        </div>
      )}
      {props.isMobile && !isMobileLandscape(props.isMobile) && (
        <>
          <Images.ArrowDownLeft
            fill={btnColor.text}
            width={props.isMobile ? 14 : 9}
            height={props.isMobile ? 14 : 9}
          />
          <span
            className={`trade-box-btn-title ${
              props.isMobile ? 'title-mobile' : ''
            }`}
            style={{ color: btnColor.text }}
          >{t`Sell`}</span>
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

export default connect(mapStateToProps, {})(TradeSellButton)
