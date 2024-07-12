/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { Overlay } from 'react-md'
import { Colors } from '../../../models/color'
import './index.scss'
import { t } from 'ttag'
import { IOpenTrade } from '../../../core/interfaces/trades'
import classNames from 'classnames'
import { connect } from 'react-redux'
import SelectedPercentBar from '../../TradeBoxFx/SelectedPercentBar'
import { AvailableCurrencies } from '../../../models/registry'
import { calculatePipValue } from '../../../shares/functions'
import { IRegistry, IWalletDetails } from '../../../core/API'
import { toNumber } from 'lodash'

const Modal = styled.div<any>`
  position: absolute;
  top: calc(50% - 200px);
  left: calc(50% - 145px);
  width: 290px;
  max-height: 250px;
  display: block;
  z-index: 41;
  background-color: ${(props) => props.colors.modalBackground};
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  padding: 21px 30px;

  .confirm-close-wrapper {
    color: ${(props) => props.colors.secondaryText};
  }
`

interface IModalEditStopLossNonMarginProps {
  actionCloseModal: () => void
  actionSubmit: (trade: IOpenTrade, amount: number, price: number) => void
  colors: any
  trading: any
  instruments: any
  wallets: any
  currencies: AvailableCurrencies
  registry: IRegistry
}

const ModalEditStopLossNonMargin = (
  props: IModalEditStopLossNonMarginProps
) => {
  const instrument = props.instruments[props.trading.instrumentID]
  const wallet = props.wallets.find(
    (w: IWalletDetails) => w.walletID === props.trading.walletID
  )
  const currency = props.currencies[wallet.baseCurrency]

  const { tradingConfig, pip } = instrument

  const pipValue = calculatePipValue({
    stake: props.trading.stake,
    lastQuote: props.trading.lastQuote,
    leverage: props.trading.leverage,
    pip,
  })

  const {
    partnerConfig: {
      sliderStepRules: { stepRules },
    },
  } = props.registry

  const [value, setValue] = useState(props.trading.stopLossAmount)
  const [checked, setChecked] = useState(true)

  useEffect(() => {
    if (checked) {
      setValue(props.trading.stopLossAmount)
    } else {
      setValue(props.trading.stake)
    }
  }, [checked])

  const onChangeValue = (value: any, isSlider: boolean = false) => {
    if (isSlider) {
      setValue(Number(value).toFixed(2))
    } else {
      setValue(value)
    }
  }

  const minStopLoss = (tradingConfig.limitDelta / pip) * pipValue

  const sliderStepStopLoss =
    stepRules.find((e: any) => e.minValue < minStopLoss) ||
    stepRules[stepRules.length - 1]

  return (
    <>
      <Modal colors={props.colors}>
        <div
          className="header-modal"
          style={{ color: props.colors.secondaryText }}
        >{t`Stop Loss`}</div>
        <div className="header-modal-checbox">
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
        {checked && (
          <>
            <SelectedPercentBar
              {...props}
              value={value}
              onChangeValue={onChangeValue}
              onChangeRange={onChangeValue}
              maxValue={parseFloat(toNumber(props.trading.stake).toFixed(2))}
              minValue={parseFloat(minStopLoss.toFixed(2))}
              valueProcessBar={value}
              sliderStep={sliderStepStopLoss?.step}
              currencyInputProps={{ decimalsLimit: 2 }}
            />
            <div
              className="trade-box-subtitle"
              style={{ color: props.colors.secondaryText }}
            >
              {`${t`Estimated Stop Loss price`}: ${parseFloat(
                props.trading.stopLossPrice.toFixed(4)
              )}`}
            </div>
          </>
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
            }}
            className="button button-submit"
            onClick={() =>
              props.actionSubmit(
                props.trading,
                value,
                props.trading.stopLossPrice
              )
            }
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
})

export default connect(mapStateToProps, {})(ModalEditStopLossNonMargin)
