import React from 'react'
import { connect } from 'react-redux'
import { getInstrumentObject } from '../../selectors/instruments'
import { Colors } from '../../../models/color'
import CurrencyInput from 'react-currency-input-field'
import { IInstrument } from '../../../core/API'
import styled from 'styled-components'
import { t } from 'ttag'
import { actionSetPendingOrder } from '../../../actions/trading'

const LimitPrice = styled.div<{
  colors: any
}>`
  display: flex;
  flex-direction: row;
  padding-bottom: 14px;
  border-bottom: 1px solid ${(props) => props.colors.backgroundHue3};
  margin-top: 10px;

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .label {
    margin: 10px 0;
    color: ${(props) => props.colors.secondaryText};
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
  }

  input.currency-input {
    border: 0px;
    outline: none;
    font-size: 16px;
    color: ${(props) => props.colors.accentDefault};
    width: 100%;
    background-color: ${(props) => props.colors.fieldBackground};
    padding: 8px;
    border-radius: 4px;
    text-align: center;
  }
`

const SignButton = styled.div<{
  colors: any
  disabled: boolean
  fontSize: number
}>`
  flex: 0 0 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 3px;
  text-align: center;
  user-select: none;
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.colors.primaryText};
  background-color: ${(props) => props.colors.tradebox.fieldBackground};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-right: 5px;

  &:last-child {
    margin-left: 5px;
  }
`

interface ICurrencyInputProps {
  decimalsLimit: number
  decimalScale: number
}

interface ITradeBoxLimitPriceProps {
  currentInstrument: IInstrument
  colors: any
  pendingOrder: number
  actionSetPendingOrder: (value: any) => void
}

const TradeBoxLimitPrice = (props: ITradeBoxLimitPriceProps) => {
  const onAdjust = (direction: number) => {
    const { precision } = props.currentInstrument
    const difference = Number(`${(0).toFixed(precision - 1)}1`)
    const newValue = parseFloat(
      (Number(props.pendingOrder) + direction * difference).toFixed(precision)
    )
    const isValueValid = Number(newValue) >= 0 && Number(newValue) <= 1000000
    isValueValid && props.actionSetPendingOrder(newValue)
  }

  return (
    <LimitPrice colors={props.colors}>
      <div style={{ flex: 2 }}>
        <div className="label">{t`Limit price`}</div>
        <div className="flex-row">
          <SignButton
            fontSize={30}
            colors={props.colors}
            disabled={false}
            onClick={() => onAdjust(-1)}
          >
            -
          </SignButton>
          <CurrencyInput
            className="currency-input disable-input"
            name="amount"
            value={props.pendingOrder}
            allowNegativeValue={false}
            decimalsLimit={5}
            onValueChange={props.actionSetPendingOrder}
            style={{ color: props.colors.accentDefault }}
            autoComplete="off"
          />
          <SignButton
            fontSize={20}
            colors={props.colors}
            disabled={false}
            onClick={() => onAdjust(1)}
          >
            +
          </SignButton>
        </div>
      </div>
    </LimitPrice>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  pendingOrder: state.trading.pendingOrder,
  currentInstrument: getInstrumentObject(state),
})

export default connect(mapStateToProps, { actionSetPendingOrder })(
  TradeBoxLimitPrice
)
