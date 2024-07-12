/* eslint-disable react-hooks/exhaustive-deps */
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { Overlay } from 'react-md'
import './index.scss'
import { t } from 'ttag'
import { IOpenTrade } from '../../../../core/interfaces/trades'
import classNames from 'classnames'
import { connect } from 'react-redux'
import SelectedPercentBar from '../../../TradeBoxFx/SelectedPercentBar'
import { AvailableCurrencies } from '../../../../models/registry'
import { calculatePipValue } from '../../../../shares/functions'
import { IRegistry, IWalletDetails } from '../../../../core/API'
import { toNumber } from 'lodash'
import { getTakeProfitBoundaries } from '../../../../core/utils'

const Modal = styled.div<any>`
  position: fixed;
  top: calc(50% - 200px);
  left: 20px;
  right: 20px;
  max-height: 350px;
  display: block;
  z-index: 100;
  background-color: ${(props) => props.colors.modalBackground};
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  padding: 21px 30px;

  .confirm-close-wrapper {
    color: ${(props) => props.colors.secondaryText};
  }
`

interface IModalEditTradeNonMarginProps {
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
}

const ModalEditTradeNonMargin = (props: IModalEditTradeNonMarginProps) => {
  const instrument = props.instruments[props.trading.instrumentID]
  const wallet = props.wallets.find(
    (w: IWalletDetails) => w.walletID === props.trading.walletID
  )
  const currency = props.currencies[wallet.baseCurrency]

  const { tradingConfig, pip } = instrument
  const { defaultTakeProfit } = tradingConfig

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

  const [valueStopLoss, setValueStopLoss] = useState(
    props.trading.stopLossAmount
  )
  const [valueTakeProfit, setValueTakeProfit] = useState(
    props.trading.takeProfitAmount
  )
  const [checkedStopLoss, setCheckedStopLoss] = useState(true)
  const [checkedTakeProfit, setCheckedTakeProfit] = useState(true)

  useEffect(() => {
    if (checkedStopLoss) {
      setValueStopLoss(props.trading.stopLossAmount)
    } else {
      setValueStopLoss(props.trading.stake)
    }
  }, [checkedStopLoss])

  useEffect(() => {
    if (checkedTakeProfit) {
      setValueTakeProfit(props.trading.takeProfitAmount)
    } else {
      setValueTakeProfit((props.trading.stake * defaultTakeProfit) / 100)
    }
  }, [checkedTakeProfit])

  const onChangeValueStopLoss = (value: any, isSlider: boolean = false) => {
    if (isSlider) {
      setValueStopLoss(Number(value).toFixed(2))
    } else {
      setValueStopLoss(value)
    }
  }

  const onChangeValueTakeProfit = (value: any, isSlider: boolean = false) => {
    if (isSlider) {
      setValueTakeProfit(Number(value).toFixed(2))
    } else {
      setValueTakeProfit(value)
    }
  }

  const minStopLoss = (tradingConfig.limitDelta / pip) * pipValue

  const sliderStepStopLoss =
    stepRules.find((e: any) => e.minValue < minStopLoss) ||
    stepRules[stepRules.length - 1]

  const { minTakeProfit, maxTakeProfit } = getTakeProfitBoundaries(
    tradingConfig,
    props.trading.stake
  )

  const sliderStepTakeProfit =
    stepRules.find((e: any) => e.minValue < minTakeProfit) ||
    stepRules[stepRules.length - 1]

  return (
    <>
      <Modal colors={props.colors}>
        <div className="header-modal-checbox" style={{ marginTop: 0 }}>
          {`${t`Stop Loss`} (${currency.currencyName})`}
          <div
            className={classNames({
              'trade-box-checkbox': true,
              'trade-box-checked': checkedStopLoss,
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
                backgroundColor: checkedStopLoss
                  ? props.colors.accentDefault
                  : props.colors.secondaryText,
              }}
              onClick={() => setCheckedStopLoss(!checkedStopLoss)}
            ></div>
          </div>
        </div>
        {checkedStopLoss && (
          <>
            <SelectedPercentBar
              {...props}
              value={valueStopLoss}
              onChangeValue={onChangeValueStopLoss}
              onChangeRange={onChangeValueStopLoss}
              maxValue={parseFloat(toNumber(props.trading.stake).toFixed(2))}
              minValue={parseFloat(minStopLoss.toFixed(2))}
              valueProcessBar={valueStopLoss}
              sliderStep={sliderStepStopLoss?.step}
              currencyInputProps={{ decimalsLimit: 2 }}
            />
            <div
              className="trade-box-subtitle"
              style={{ color: props.colors.secondaryText }}
            >
              {`${t`Estimated Stop Loss price`}: ${parseFloat(
                props.trading.stopLossPrice.toFixed(instrument.precision)
              )}`}
            </div>
          </>
        )}

        <div className="header-modal-checbox">
          {`${t`Take Profit`} (${currency.currencyName})`}
          <div
            className={classNames({
              'trade-box-checkbox': true,
              'trade-box-checked': checkedTakeProfit,
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
                backgroundColor: checkedTakeProfit
                  ? props.colors.accentDefault
                  : props.colors.secondaryText,
              }}
              onClick={() => setCheckedTakeProfit(!checkedTakeProfit)}
            ></div>
          </div>
        </div>
        {checkedTakeProfit && (
          <>
            <SelectedPercentBar
              {...props}
              value={valueTakeProfit}
              onChangeValue={onChangeValueTakeProfit}
              onChangeRange={onChangeValueTakeProfit}
              maxValue={parseFloat(maxTakeProfit.toFixed(2))}
              minValue={parseFloat(minTakeProfit.toFixed(2))}
              valueProcessBar={valueTakeProfit}
              sliderStep={sliderStepTakeProfit?.step}
              currencyInputProps={{ decimalsLimit: 2 }}
            />
            <div
              className="trade-box-subtitle"
              style={{ color: props.colors.secondaryText }}
            >
              {`${t`Estimated Take Profit price`}: ${parseFloat(
                props.trading.takeProfitPrice.toFixed(instrument.precision)
              )}`}
            </div>
          </>
        )}
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
            }}
            className="button button-submit"
            onClick={() =>
              props.actionSubmit(
                props.trading,
                valueStopLoss,
                props.trading.stopLossPrice,
                valueTakeProfit,
                props.trading.takeProfitPrice,
                false
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
})

export default connect(mapStateToProps, {})(ModalEditTradeNonMargin)
