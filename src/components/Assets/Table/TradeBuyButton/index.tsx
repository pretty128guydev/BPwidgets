import React from 'react'
import { connect } from 'react-redux'
import './index.scss'
import { Colors } from '../../../../models/color'
import { IQuote } from '../../../../reducers/quotes'
import { IInstrument } from '../../../../core/API'
import { currencyToString } from '../../../../shares/functions'

interface ITradeSaleButtonProps {
  colors?: any
  quote: IQuote | {}
  onClick: () => void
  instruments: IInstrument[]
  instrumentID: number
}

const TradeBuyButton = (props: ITradeSaleButtonProps) => {
  const instrument = props.instruments.find(
    ({ instrumentID }) => instrumentID === props.instrumentID
  )
  if (!props.quote || !instrument || !instrument?.isOpen) return <></>
  const ask = (props.quote as IQuote).ask
  const { precision } = instrument

  const getColor = () => {
    return {
      backgroundColor: 'transparent',
      text: props.colors?.tradebox?.highActive,
      border: `1px solid ${props.colors?.tradebox?.highActive}`,
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
      className="asset-buy-btn trade-box-btn"
      style={{
        backgroundColor: btnColor.backgroundColor,
        color: btnColor.text,
        border: btnColor.border,
      }}
      onClick={props.onClick}
    >
      <div style={{ position: 'relative' }}>
        <span className="first-quote-btn">
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
  instruments: state.trading.instruments,
})

export default connect(mapStateToProps, {})(TradeBuyButton)
