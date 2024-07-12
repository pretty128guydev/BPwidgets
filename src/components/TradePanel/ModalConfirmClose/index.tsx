import styled from 'styled-components'
import React, { useCallback } from 'react'
import { Overlay } from 'react-md'
import { Colors } from '../../../models/color'
import './index.scss'
import { t } from 'ttag'
import { connect } from 'react-redux'
import { AvailableCurrencies } from '../../../models/registry'
import { currencyToString } from '../../../shares/functions'
import { IWalletDetails } from '../../../core/API'
import { calculatePnL } from '../../../sagas/tradingHelper'
import { IQuote } from '../../../reducers/quotes'
import { TradeDirection } from '../../../models/instrument'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { openPnlCal } from '../../../core/utils'

const Modal = styled.div<any>`
  position: absolute;
  top: calc(50% - 200px);
  left: calc(50% - 145px);
  width: 290px;
  display: block;
  z-index: 41;
  background-color: ${(props) => props.colors.modalBackground};
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  padding: 21px 30px;

  .confirm-close-wrapper {
    color: ${(props) => props.colors.secondaryText};
  }
`

interface IModalConfirmCloseProps {
  actionCloseModal: () => void
  actionSubmit: (trade: IOpenTrade) => void
  colors: any
  trading: any
  instruments: any
  wallets: any
  currencies: AvailableCurrencies
  quotes: IQuote[]
}

const ModalConfirmClose = (props: IModalConfirmCloseProps) => {
  const instrument = props.instruments[props.trading.instrumentID]
  const { instrumentID } = instrument

  const wallet = props.wallets.find(
    (w: IWalletDetails) => w.walletID === props.trading.walletID
  )

  const currency = props.currencies[wallet.baseCurrency]

  const getCurrentPrice = useCallback(() => {
    const quote = props.quotes[props.trading.instrumentID]
    if (!quote) return 0
    const { direction, deltaSpread, fxRiskFactor } = props.trading
    const ask = quote.ask + (deltaSpread * fxRiskFactor || 0) / 2
    const bid = quote.bid - (deltaSpread * fxRiskFactor || 0) / 2
    const currentPrice = direction === TradeDirection.up ? ask : bid
    return currentPrice
  }, [props.quotes, props.trading])

  const pnl = () => {
    const quote = props.quotes[props.trading.instrumentID]
    return openPnlCal(props.trading, quote).toFixed(2)
    // const currentPrice = getCurrentPrice()
    // return parseFloat(
    //   (calculatePnL(props.trading, currentPrice) - props.trading.swaps).toFixed(
    //     2
    //   )
    // )
  }

  const spotPrice = () => {
    const currentPrice = getCurrentPrice()
    const { precision } = instrument
    return currencyToString(currentPrice, precision)
  }

  return (
    <>
      <Modal colors={props.colors}>
        <div
          className="header-modal-confirm-close"
          style={{ color: props.colors.secondaryText }}
        >{t`Close trade confirmation`}</div>
        <div className="trade-confirm-summary">
          <div className="confirm-close-wrapper">
            <div className="title">{t`Trade ID`}:</div>
            <div className="value">{props.trading.tradeID}</div>
          </div>
          <div className="confirm-close-wrapper">
            <div className="title">{t`Direction`}:</div>
            <div
              className="value high-color"
              style={{
                color:
                  props.trading.direction === 1
                    ? props.colors.accentDefault
                    : props.colors.secondary,
              }}
            >
              <span
                className={
                  props.trading.direction === 1 ? 'buy-icon' : 'sell-icon'
                }
              >
                ▾
              </span>{' '}
              {props.trading.direction === 1 ? t`Buy` : t`Sell`}
            </div>
          </div>
          <div className="confirm-close-wrapper">
            <div className="title">{t`Symbol`}:</div>
            <div className="value">
              <img
                className="img-asset"
                src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrumentID}.svg`}
                alt={`Instrument ${instrumentID}`}
              />{' '}
              {props.trading.instrumentName}
            </div>
          </div>
          <div className="confirm-close-wrapper">
            <div className="title">{t`Spot Price`}:</div>
            <div className="value">{spotPrice()}</div>
          </div>
          {!props.trading.orderTriggerPrice && (
            <div className="confirm-close-wrapper">
              <div className="title">{t`Open P&L`}:</div>
              <div className="value">
                {`${currency.currencySymbol}${pnl()}`}
              </div>
            </div>
          )}
        </div>
        <div className="button-group">
          <div
            style={{
              color: props.colors.secondaryText,
              borderColor: props.colors.accentDefault,
            }}
            className="button button-cancel"
            onClick={props.actionCloseModal}
          >
            <span style={{ textTransform: 'uppercase' }}>{t`Cancel`}</span>
          </div>
          <div
            style={{
              color: props.colors.secondaryText,
              borderColor: props.colors.accentDefault,
              backgroundColor: props.colors.accentDefault,
            }}
            className="button button-submit"
            onClick={() => props.actionSubmit(props.trading)}
          >
            <span style={{ textTransform: 'uppercase' }}>{t`Close Now`}</span>
          </div>
        </div>
      </Modal>
      <Overlay
        id="modal-overlay"
        visible={true}
        onRequestClose={() => {}}
        style={{ zIndex: 40 }}
      />
    </>
  )
}

const mapStateToProps = (state: any) => ({
  instruments: state.instruments,
  colors: state.theme,
  wallets: state.wallets.wallets,
  currencies: state.registry.data.availableCurrencies,
  quotes: state.quotes,
})

export default connect(mapStateToProps, {})(ModalConfirmClose)
