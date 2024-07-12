// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { Overlay } from 'react-md'
import './index.scss'
import { t } from 'ttag'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { connect } from 'react-redux'
import { AvailableCurrencies } from '../../../models/registry'
import { IRegistry, IWalletDetails } from '../../../core/API'
import CurrencyInput from 'react-currency-input-field'
import {
  calculateStopLossPipsFromCoe,
  calculateStopLossPrice,
} from '../../../sagas/tradingHelper'
import { TradeboxSLTP } from '../../TradeBoxFx/styled'
import classNames from 'classnames'
import { calculatePipValue } from '../../../shares/functions'
import { QuotesMap } from '../../../reducers/quotes'

const Modal = styled.div<any>`
  position: absolute;
  top: calc(50% - 300px);
  left: calc(50% - 145px);
  width: 290px;
  max-height: 340px;
  display: block;
  z-index: 41;
  background-color: ${(props) => props.colors.modalBackground};
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  padding: 21px 30px;

  .confirm-close-wrapper {
    color: ${(props) => props.colors.secondaryText};
  }
`

interface IModalEditStopLossProps {
  actionCloseModal: () => void
  actionSubmit: (trade: IOpenTrade, amount: number, price: number) => void
  colors: any
  trading: any
  instruments: any
  wallets: any
  currencies: AvailableCurrencies
  registry: IRegistry
  quotes: QuotesMap
}

const ModalEditStopLoss = (props: IModalEditStopLossProps) => {
  const instrument = props.instruments[props.trading.instrumentID]
  const wallet = props.wallets.find(
    (w: IWalletDetails) => w.walletID === props.trading.walletID
  )
  const currency = props.currencies[wallet.baseCurrency]
  const quote = props.quotes[props.trading.instrumentID]
  const { tradingConfig, pip } = instrument
  const { deltaSpread } = tradingConfig

  const [pipValue, setPipValue] = useState<number>(0)

  const [changingField, setChangingField] = useState<string>('')
  const [changedField, setChangedField] = useState<string>('')
  const [checked, setChecked] = useState(props.trading.stopLossPrice !== 0)
  const [amount, setAmount] = useState(-props.trading.stopLossAmount)
  const [pips, setPips] = useState(0)
  const [price, setPrice] = useState(props.trading.stopLossPrice)
  const [savebutton, setsavebutton] = useState<boolean>(true)

  useEffect(() => {
    if (props.trading.stopLossAmount !== 0) {
      const pips = -calculateStopLossPipsFromCoe({
        // lastPrice: quote.last,
        lastPrice: props.trading.pendingOrderType
          ? props.trading.orderTriggerPrice
          : props.trading.referencePrice,
        coe: props.trading.stopLossPrice,
        pip,
        direction: props.trading.direction,
      })
      setPips(pips)
      setPipValue(props.trading.stopLossAmount / pips)
      setsavebutton(true)
      props.trading.direction == 1
        ? !props.trading.pendingOrderType &&
          setsavebutton(quote.last < props.trading.stopLossPrice)
        : !props.trading.pendingOrderType &&
          setsavebutton(quote.last > props.trading.stopLossPrice)
    } else {
      const stoploss = -props.trading.stake
      const pipValue = calculatePipValue({
        stake: props.trading.stake,
        lastQuote: props.trading.lastQuote,
        leverage: props.trading.leverage,
        pip,
      })
      const slPips = -stoploss / pipValue
      const lastPice =
        props.trading.direction === 1
          ? quote.last - (deltaSpread + slPips * pip)
          : quote.last + (deltaSpread + slPips * pip)
      setPipValue(pipValue)
      setPips(slPips)
      // setPrice(lastPice)
      setPrice(
        props.trading.stopLossPrice === 0
          ? lastPice
          : props.trading.stopLossPrice
      )
      setAmount(stoploss)
      setsavebutton(true)
      props.trading.direction == 1
        ? !props.trading.pendingOrderType &&
          setsavebutton(quote.last < props.trading.stopLossPrice)
        : !props.trading.pendingOrderType &&
          setsavebutton(quote.last > props.trading.stopLossPrice)
    }
  }, [])

  useEffect(() => {
    if ((changedField === 'pips' || changedField === '') && pips !== 0) {
      const lastPice =
        props.trading.direction === 1
          ? quote.last - (deltaSpread + pips * pip)
          : quote.last + (deltaSpread + pips * pip)
      //   ? props.trading.stopLossPrice - (deltaSpread + pips * pip)
      //   : props.trading.stopLossPrice + (deltaSpread + pips * pip)
      //   setPrice(lastPice)
      setPrice(
        props.trading.stopLossPrice === 0
          ? lastPice
          : props.trading.stopLossPrice
      )
    }
  }, [quote, changedField])

  const onFocus = (field: string) => {
    setChangingField(field)
  }

  const onBlur = (field: string) => {
    setChangingField('')
  }

  const onChange = (field: string, value: string) => {
    field !== changedField && setChangedField(field)
    switch (field) {
      case 'pips':
        setPips(value)
        setAmount(value * pipValue)
        break
      case 'price':
        props.trading.direction == 1
          ? !props.trading.pendingOrderType && setsavebutton(quote.last < value)
          : !props.trading.pendingOrderType && setsavebutton(quote.last > value)
        setPrice(value)
        const pips = -calculateStopLossPipsFromCoe({
          lastPrice: props.trading.pendingOrderType
            ? props.trading.orderTriggerPrice
            : props.trading.referencePrice,
          coe: value,
          pip,
          direction: props.trading.direction,
        })
        setPips(pips)
        setAmount(pips * pipValue)
        break
      default:
        break
    }
  }

  const amountReCal =
    props.trading.direction === 1
      ? price <
        (props.trading.orderTriggerPrice
          ? props.trading.orderTriggerPrice
          : props.trading.referencePrice)
        ? -Math.abs(parseFloat(amount.toFixed(2)))
        : Math.abs(parseFloat(amount.toFixed(2)))
      : price >
        (props.trading.orderTriggerPrice
          ? props.trading.orderTriggerPrice
          : props.trading.referencePrice)
      ? -Math.abs(parseFloat(amount.toFixed(2)))
      : Math.abs(parseFloat(amount.toFixed(2)))

  return (
    <>
      <Modal colors={props.colors}>
        <div
          className="header-modal"
          style={{ color: props.colors.secondaryText }}
        >{t`Stop Loss`}</div>
        {wallet.isMargin && (
          <div
            className="header-modal-checbox"
            style={{ color: props.colors.defaultText }}
          >
            {`${t`Stop Loss`} (${currency.currencyName})`}
            <div
              className={classNames({
                'trade-box-checkbox': true,
                'trade-box-checked': checked,
              })}
            >
              <div
                className="trade-box-checkbox-background"
                style={{
                  backgroundColor: props.colors.tradebox.fieldBackground,
                }}
              ></div>
              <div
                className="trade-box-checkbox-toggler"
                style={{
                  backgroundColor: checked
                    ? props.colors.accentDefault
                    : props.colors.secondaryText,
                }}
                onClick={() => setChecked(!checked)}
              ></div>
            </div>
          </div>
        )}
        {checked && (
          <TradeboxSLTP colors={props.colors} isMobile={false}>
            <div className="sltp-row">
              <div className="center" style={{ flex: 'unset' }}>{t`Price`}</div>
              <div>
                <CurrencyInput
                  className={`currency-input ${
                    checked ? '' : 'disable-input'
                  } ${changingField === 'price' ? 'field-active' : ''}`}
                  style={
                    props.trading.pendingOrderType
                      ? Number(pips) <= 0
                        ? { borderColor: props.colors.tradebox.lowActive }
                        : {}
                      : !savebutton
                      ? {}
                      : { borderColor: props.colors.tradebox.lowActive }
                  }
                  name="stop-loss-coe"
                  value={
                    typeof price === 'string'
                      ? price
                      : parseFloat(Number(price).toFixed(5))
                  }
                  onValueChange={(value: any) => {
                    if (
                      value === undefined ||
                      value[value.length - 1] === '.' ||
                      price[price.length - 1] === '.' ||
                      value[value.length - 1] !== '.' /*&&
                        parseFloat(Number(value).toFixed(5)) !==
                    parseFloat(Number(price).toFixed(5))*/
                    )
                      onChange('price', value || 0)
                  }}
                  decimalsLimit={5}
                  onFocus={() => onFocus('price')}
                  onBlur={() => onBlur('price')}
                  disabled={!checked}
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="sltp-row">
              <div className="center" style={{ flex: 'unset' }}>
                {currency.currencySymbol}
              </div>
              <div>
                <CurrencyInput
                  className={`currency-input disable-input ${
                    changingField === 'amount' ? 'field-active' : ''
                  }`}
                  name="stop-loss-amount"
                  value={amountReCal}
                  allowNegativeValue={false}
                  disabled
                />
              </div>
            </div>
          </TradeboxSLTP>
        )}
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
              opacity: props.trading.pendingOrderType
                ? pips > 0
                  ? 1
                  : 0.3
                : savebutton
                ? 0.3
                : 1,
            }}
            className="button button-submit"
            onClick={() => {
              if (props.trading.pendingOrderType ? pips > 0 : !savebutton)
                props.actionSubmit(
                  props.trading,
                  checked ? -amount : wallet.isMargin ? 0 : -amount,
                  checked ? price : wallet.isMargin ? 0 : price
                )
            }}
          >
            <span style={{ textTransform: 'uppercase' }}>{t`Save`}</span>
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
  registry: state.registry.data,
  quotes: state.quotes,
})

export default connect(mapStateToProps, {})(ModalEditStopLoss)
