// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { Overlay } from 'react-md'
import { Colors } from '../../../models/color'
import './index.scss'
import { t } from 'ttag'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { connect } from 'react-redux'
import { AvailableCurrencies } from '../../../models/registry'
import { IRegistry, IWalletDetails } from '../../../core/API'
import CurrencyInput from 'react-currency-input-field'
import {
  calculateProfitPipsFromCoe,
  calculateProfitPrice,
} from '../../../sagas/tradingHelper'
import { TradeboxSLTP } from '../../TradeBoxFx/styled'
import { getTakeProfitBoundaries } from '../../../core/utils'
import classNames from 'classnames'
import { calculatePipValue } from '../../../shares/functions'

const Modal = styled.div<any>`
  position: absolute;
  top: calc(50% - 200px);
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

interface IModalEditTakeProfitProps {
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

const ModalEditTakeProfit = (props: IModalEditTakeProfitProps) => {
  const instrument = props.instruments[props.trading.instrumentID]
  const wallet = props.wallets.find(
    (w: IWalletDetails) => w.walletID === props.trading.walletID
  )
  const currency = props.currencies[wallet.baseCurrency]
  const quote = props.quotes[props.trading.instrumentID]
  const { tradingConfig, pip } = instrument

  const { minTakeProfit, maxTakeProfit } = getTakeProfitBoundaries(
    tradingConfig,
    props.trading.stake
  )

  const [pipValue, setPipValue] = useState<number>(0)

  const [changingField, setChangingField] = useState<string>('')
  const [checked, setChecked] = useState(props.trading.takeProfitAmount !== 0)
  const [amount, setAmount] = useState(props.trading.takeProfitAmount)
  const [pips, setPips] = useState(0)
  const [price, setPrice] = useState(props.trading.takeProfitPrice)
  const [savebutton, setsavebutton] = useState<boolean>(true)

  useEffect(() => {
    if (props.trading.takeProfitAmount !== 0) {
      const pips = calculateProfitPipsFromCoe({
        lastPrice: props.trading.pendingOrderType
          ? props.trading.orderTriggerPrice
          : props.trading.referencePrice,
        coe: props.trading.takeProfitPrice,
        pip,
        direction: props.trading.direction,
      })
      props.trading.direction == 1
        ? !props.trading.pendingOrderType &&
          setsavebutton(quote.last > props.trading.takeProfitPrice)
        : !props.trading.pendingOrderType &&
          setsavebutton(quote.last < props.trading.takeProfitPrice)
      setPips(pips)
      setPipValue(props.trading.takeProfitAmount / pips)
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
      setPips(pPips)
      setPrice(pPrice)
      setAmount(profit)
      props.trading.direction == 1
        ? !props.trading.pendingOrderType &&
          setsavebutton(quote.last > props.trading.takeProfitPrice)
        : !props.trading.pendingOrderType &&
          setsavebutton(quote.last < props.trading.takeProfitPrice)
    }
  }, [])

  const onFocus = (field: string) => {
    setChangingField(field)
  }

  const onBlur = (field: string) => {
    setChangingField('')
    // setTimeout(() => {
    //   switch (field) {
    //     case 'pips':
    //     case 'price':
    //       let profit = pipValue * pips

    //       if (profit < minTakeProfit || profit > maxTakeProfit || profit <= 0) {
    //         profit = profit < minTakeProfit ? minTakeProfit : maxTakeProfit
    //         const pPips = profit / pipValue
    //         const pPrice = calculateProfitPrice({
    //           lastPrice: props.trading.pendingOrderType
    //             ? props.trading.orderTriggerPrice
    //             : props.trading.referencePrice,
    //           pips: pPips,
    //           pip,
    //           direction: props.trading.direction,
    //         })
    //         setPips(pPips)
    //         setPrice(pPrice)
    //         setAmount(profit)
    //       }
    //       break
    //     default:
    //       break
    //   }
    // }, 100)
  }

  const onChange = (field: string, value: string) => {
    switch (field) {
      case 'pips':
        setPips(value)
        setAmount(value * pipValue)
        const pPrice = calculateProfitPrice({
          lastPrice: props.trading.pendingOrderType
            ? props.trading.orderTriggerPrice
            : props.trading.referencePrice,
          pips: value,
          pip,
          direction: props.trading.direction,
        })
        setPrice(pPrice)

        break
      case 'price':
        props.trading.direction == 1
          ? !props.trading.pendingOrderType && setsavebutton(quote.last > value)
          : !props.trading.pendingOrderType && setsavebutton(quote.last < value)
        setPrice(value)
        const pips = calculateProfitPipsFromCoe({
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

  return (
    <>
      <Modal colors={props.colors}>
        <div
          className="header-modal"
          style={{ color: props.colors.secondaryText }}
        >{t`Take Profit`}</div>
        {wallet.isMargin && (
          <div
            className="header-modal-checbox"
            style={{ color: props.colors.defaultText }}
          >
            {`${t`Take Profit`} (${currency.currencyName})`}
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
                  value={parseFloat(amount.toFixed(2))}
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
                  checked ? amount : wallet.isMargin ? 0 : amount,
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

export default connect(mapStateToProps, {})(ModalEditTakeProfit)
