// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { Overlay } from 'react-md'
import './index.scss'
import { t } from 'ttag'
import { IOpenTrade } from '../../../../core/interfaces/trades'
import { connect } from 'react-redux'
import { AvailableCurrencies } from '../../../../models/registry'
import { IRegistry, IWalletDetails } from '../../../../core/API'
import CurrencyInput from 'react-currency-input-field'
import {
  calculateProfitPipsFromCoe,
  calculateProfitPrice,
  calculateStopLossPipsFromCoe,
  calculateStopLossPrice,
} from '../../../../sagas/tradingHelper'
import { TradeboxSLTP } from '../../../TradeBoxFx/styled'
import { calculatePipValue } from '../../../../shares/functions'
import TradeBoxSwitch from '../../../TradeBoxFx/TradeBoxSwitch'
import { getTakeProfitBoundaries } from '../../../../core/utils'

const Modal = styled.div<any>`
  position: fixed;
  top: calc(50% - 300px);
  left: 20px;
  right: 20px;
  max-height: 340px;
  display: block;
  z-index: 100;
  background-color: ${(props) => props.colors.modalBackground};
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  padding: 21px 30px;

  .confirm-close-wrapper {
    color: ${(props) => props.colors.secondaryText};
  }
`

interface IModalEditTradeProps {
  actionCloseModal: () => void
  actionSubmit: (
    trade: IOpenTrade,
    slAmount: number,
    slPrice: number,
    tpAmount: number,
    tpPrice: number,
    isMargin: boolean
  ) => void
  colors: any
  trading: any
  instruments: any
  wallets: any
  currencies: AvailableCurrencies
  registry: IRegistry
  activeWallet: IWalletDetails
  quotes: QuotesMap
}

const ModalEditTrade = (props: IModalEditTradeProps) => {
  const instrument = props.instruments[props.trading.instrumentID]
  const wallet = props.wallets.find(
    (w: IWalletDetails) => w.walletID === props.trading.walletID
  )
  const currency = props.currencies[wallet.baseCurrency]

  const { tradingConfig, pip } = instrument
  const { deltaSpread } = tradingConfig
  const quote = props.quotes[props.trading.instrumentID]

  const [pipValue, setPipValue] = useState<number>(0)

  const [changingField, setChangingField] = useState<string>('')
  const [checkedStopLoss, setCheckedStopLoss] = useState(
    props.trading.stopLossAmount !== 0
  )
  const [checkedTakeProfit, setCheckedTakeProfit] = useState(
    props.trading.takeProfitAmount !== 0
  )
  const [stopLossAmount, setStopLossAmount] = useState(
    -props.trading.stopLossAmount
  )
  const [stopLossPips, setStopLossPips] = useState(0)
  const [stopLossPrice, setStopLossPrice] = useState(
    props.trading.stopLossPrice
  )

  const [takeProfitAmount, setTakeProfitAmount] = useState(
    props.trading.takeProfitAmount
  )
  const [takeProfitPips, setTakeProfitPips] = useState(0)
  const [takeProfitPrice, setTakeProfitPrice] = useState(
    props.trading.takeProfitPrice
  )

  const { minTakeProfit, maxTakeProfit } = getTakeProfitBoundaries(
    tradingConfig,
    props.trading.stake
  )
  const [savebutton, setsavebutton] = useState<boolean>(true)
  const [savebutton2, setsavebutton2] = useState<boolean>(true)

  useEffect(() => {
    if (props.trading.stopLossAmount !== 0) {
      const stopLossPips = calculateStopLossPipsFromCoe({
        lastPrice: props.trading.pendingOrderType
          ? props.trading.orderTriggerPrice
          : props.trading.referencePrice,
        coe: props.trading.stopLossPrice,
        pip,
        direction: props.trading.direction,
      })
      checkedStopLoss
        ? props.trading.direction == 1
          ? !props.trading.pendingOrderType &&
            setsavebutton(quote.last < props.trading.stopLossPrice)
          : !props.trading.pendingOrderType &&
            setsavebutton(quote.last > props.trading.stopLossPrice)
        : setsavebutton(false)
      setStopLossPips(stopLossPips)
      setPipValue(props.trading.stopLossAmount / stopLossPips)
    } else {
      const stoploss = -props.trading.stake
      const pipValue = calculatePipValue({
        stake: props.trading.stake,
        lastQuote: props.trading.lastQuote,
        leverage: props.trading.leverage,
        pip,
      })
      const slPips = -stoploss / pipValue
      const slPrice = calculateStopLossPrice({
        lastPrice: props.trading.pendingOrderType
          ? props.trading.orderTriggerPrice
          : props.trading.referencePrice,
        pips: slPips,
        pip,
        direction: props.trading.direction,
        deltaSpread,
      })
      setPipValue(pipValue)
      setStopLossPips(slPips)
      setStopLossPrice(slPrice)
      setStopLossAmount(stoploss)
      checkedStopLoss
        ? props.trading.direction == 1
          ? !props.trading.pendingOrderType &&
            setsavebutton(quote.last < props.trading.stopLossPrice)
          : !props.trading.pendingOrderType &&
            setsavebutton(quote.last > props.trading.stopLossPrice)
        : setsavebutton(false)
    }
    if (props.trading.takeProfitAmount !== 0) {
      const pips = calculateProfitPipsFromCoe({
        lastPrice: props.trading.pendingOrderType
          ? props.trading.orderTriggerPrice
          : props.trading.referencePrice,
        coe: props.trading.takeProfitPrice,
        pip,
        direction: props.trading.direction,
      })
      setTakeProfitPips(pips)
      setPipValue(props.trading.takeProfitAmount / pips)
      checkedTakeProfit
        ? props.trading.direction == 1
          ? !props.trading.pendingOrderType &&
            setsavebutton2(quote.last > props.trading.takeProfitPrice)
          : !props.trading.pendingOrderType &&
            setsavebutton2(quote.last < props.trading.takeProfitPrice)
        : setsavebutton2(false)
    } else {
      const { defaultTakeProfit } = tradingConfig
      const profit = props.trading.stake * (defaultTakeProfit / 100)
      const pipValue = calculatePipValue({
        stake: props.trading.stake,
        lastQuote: props.trading.lastQuote,
        leverage: props.trading.leverage,
        pip,
      })
      const pPips = profit / pipValue
      const pPrice = calculateProfitPrice({
        lastPrice: props.trading.pendingOrderType
          ? props.trading.orderTriggerPrice
          : props.trading.referencePrice,
        pips: pPips,
        pip,
        direction: props.trading.direction,
      })
      setPipValue(pipValue)
      setTakeProfitPips(pPips)
      setTakeProfitPrice(pPrice)
      setTakeProfitAmount(profit)
      checkedTakeProfit
        ? props.trading.direction == 1
          ? !props.trading.pendingOrderType &&
            setsavebutton2(quote.last > props.trading.takeProfitPrice)
          : !props.trading.pendingOrderType &&
            setsavebutton2(quote.last < props.trading.takeProfitPrice)
        : setsavebutton2(false)
    }
  }, [checkedStopLoss, checkedTakeProfit])

  const onFocus = (field: string) => {
    setChangingField(field)
  }

  const onBlur = (field: string) => {
    setChangingField('')
  }

  const onChange = (field: string, value: string) => {
    switch (field) {
      case 'stopLossPips':
        setStopLossPips(value)
        setStopLossAmount(value * pipValue)
        const slPrice = calculateStopLossPrice({
          lastPrice: props.trading.pendingOrderType
            ? props.trading.orderTriggerPrice
            : props.trading.referencePrice,
          pips: value,
          pip,
          direction: props.trading.direction,
          deltaSpread,
        })
        setStopLossPrice(slPrice)
        break
      case 'stopLossPrice':
        props.trading.direction == 1
          ? !props.trading.pendingOrderType && setsavebutton(quote.last < value)
          : !props.trading.pendingOrderType && setsavebutton(quote.last > value)
        setStopLossPrice(value)
        const stopLossPips = calculateStopLossPipsFromCoe({
          lastPrice: props.trading.pendingOrderType
            ? props.trading.orderTriggerPrice
            : props.trading.referencePrice,
          coe: value,
          pip,
          direction: props.trading.direction,
        })
        setStopLossPips(stopLossPips)
        setStopLossAmount(stopLossPips * pipValue)
        break
      case 'takeProfitPips':
        setTakeProfitPips(value)
        setTakeProfitAmount(value * pipValue)
        const pPrice = calculateProfitPrice({
          lastPrice: props.trading.pendingOrderType
            ? props.trading.orderTriggerPrice
            : props.trading.referencePrice,
          pips: value,
          pip,
          direction: props.trading.direction,
        })
        setTakeProfitPrice(pPrice)
        break
      case 'takeProfitPrice':
        props.trading.direction == 1
          ? !props.trading.pendingOrderType &&
            setsavebutton2(quote.last > value)
          : !props.trading.pendingOrderType &&
            setsavebutton2(quote.last < value)
        setTakeProfitPrice(value)
        const pips = calculateProfitPipsFromCoe({
          lastPrice: props.trading.pendingOrderType
            ? props.trading.orderTriggerPrice
            : props.trading.referencePrice,
          coe: value,
          pip,
          direction: props.trading.direction,
        })
        setTakeProfitPips(pips)
        setTakeProfitAmount(pips * pipValue)
        break
      default:
        break
    }
  }

  return (
    <>
      <Modal colors={props.colors}>
        <TradeboxSLTP colors={props.colors}>
          <div className="sltp-row">
            <div>
              <span>{t`SL`}</span>
              <TradeBoxSwitch
                checked={checkedStopLoss}
                onChangeCheck={() => setCheckedStopLoss(!checkedStopLoss)}
              />
            </div>
            <div className="center"></div>
            <div>
              <span>{t`TP`}</span>
              <TradeBoxSwitch
                checked={checkedTakeProfit}
                onChangeCheck={() => setCheckedTakeProfit(!checkedTakeProfit)}
              />
            </div>
          </div>
          {!(
            !checkedStopLoss &&
            !checkedTakeProfit &&
            props.activeWallet.isMargin
          ) && (
            <div className="sltp-row">
              <div>
                <CurrencyInput
                  className={`currency-input ${
                    checkedStopLoss
                      ? ''
                      : props.activeWallet.isMargin
                      ? 'hidden-input'
                      : 'disable-input'
                  } ${changingField === 'stopLossPrice' ? 'field-active' : ''}`}
                  style={
                    props.trading.pendingOrderType
                      ? Number(stopLossPips) >= 0
                        ? { borderColor: props.colors.tradebox.lowActive }
                        : {}
                      : !savebutton
                      ? {}
                      : { borderColor: props.colors.tradebox.lowActive }
                  }
                  name="stop-loss-coe"
                  value={
                    typeof stopLossPrice === 'string'
                      ? stopLossPrice
                      : parseFloat(Number(stopLossPrice).toFixed(5))
                  }
                  onValueChange={(value: any) => {
                    onChange('stopLossPrice', value || 0)
                  }}
                  decimalsLimit={5}
                  onFocus={() => onFocus('stopLossPrice')}
                  onBlur={() => onBlur('stopLossPrice')}
                  disabled={!checkedStopLoss}
                  autoComplete="off"
                />
              </div>
              <div className="center">{t`Price`}</div>
              <div>
                <CurrencyInput
                  className={`currency-input ${
                    checkedTakeProfit
                      ? ''
                      : props.activeWallet.isMargin
                      ? 'hidden-input'
                      : 'disable-input'
                  } ${
                    changingField === 'takeProfitPrice' ? 'field-active' : ''
                  }`}
                  style={
                    props.trading.pendingOrderType
                      ? Number(takeProfitPips) <= 0
                        ? { borderColor: props.colors.tradebox.lowActive }
                        : {}
                      : !savebutton2
                      ? {}
                      : { borderColor: props.colors.tradebox.lowActive }
                  }
                  name="take-profit-coe"
                  value={
                    typeof takeProfitPrice === 'string'
                      ? takeProfitPrice
                      : parseFloat(Number(takeProfitPrice).toFixed(5))
                  }
                  onValueChange={(value: any) => {
                    onChange('takeProfitPrice', value || 0)
                  }}
                  decimalsLimit={5}
                  onFocus={() => onFocus('takeProfitPrice')}
                  onBlur={() => onBlur('takeProfitPrice')}
                  disabled={!checkedTakeProfit}
                  autoComplete="off"
                />
              </div>
            </div>
          )}
          {!(
            !checkedStopLoss &&
            !checkedTakeProfit &&
            props.activeWallet.isMargin
          ) && (
            <div className="sltp-row">
              <div>
                <CurrencyInput
                  className={`currency-input disable-input ${
                    checkedStopLoss
                      ? ''
                      : props.activeWallet.isMargin
                      ? 'hidden-input'
                      : ''
                  } ${
                    changingField === 'stopLossAmount' ? 'field-active' : ''
                  }`}
                  name="stop-loss-amount"
                  value={parseFloat(stopLossAmount.toFixed(2))}
                  allowNegativeValue={false}
                  disabled
                />
              </div>
              <div className="center">{currency.currencySymbol}</div>
              <div>
                <CurrencyInput
                  className={`currency-input disable-input ${
                    checkedTakeProfit
                      ? ''
                      : props.activeWallet.isMargin
                      ? 'hidden-input'
                      : ''
                  } ${
                    changingField === 'takeProfitAmount' ? 'field-active' : ''
                  }`}
                  name="take-profit-amount"
                  value={parseFloat(takeProfitAmount.toFixed(2))}
                  allowNegativeValue={false}
                  disabled
                />
              </div>
            </div>
          )}
        </TradeboxSLTP>
        <div className="button-group button-group-mobile">
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
                ? stopLossPips < 0 && takeProfitPips > 0
                  ? 1
                  : 0.3
                : savebutton || savebutton2
                ? 0.3
                : 1,
            }}
            className="button button-submit"
            onClick={() => {
              if (
                props.trading.pendingOrderType
                  ? stopLossPips < 0 && takeProfitPips > 0
                  : !savebutton || !savebutton2
              )
                props.actionSubmit(
                  props.trading,
                  checkedStopLoss
                    ? -stopLossAmount
                    : wallet.isMargin
                    ? 0
                    : -stopLossAmount,
                  checkedStopLoss
                    ? stopLossPrice
                    : wallet.isMargin
                    ? 0
                    : stopLossPrice,
                  checkedTakeProfit
                    ? takeProfitAmount
                    : wallet.isMargin
                    ? 0
                    : takeProfitAmount,
                  checkedTakeProfit
                    ? takeProfitPrice
                    : wallet.isMargin
                    ? 0
                    : takeProfitPrice,
                  true
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
        style={{ zIndex: 99 }}
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
  activeWallet: state.wallets.activeWallet,
  quotes: state.quotes,
})

export default connect(mapStateToProps, {})(ModalEditTrade)
