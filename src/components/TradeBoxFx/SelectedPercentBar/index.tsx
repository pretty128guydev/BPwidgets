import React from 'react'
import { connect } from 'react-redux'
import { getInstrumentObject } from '../../selectors/instruments'
import './index.scss'
import CurrencyInput from 'react-currency-input-field'
import { getTrackBackground, Range } from 'react-range'
import { IInstrument } from '../../../core/API'
import { isLoggedIn } from '../../selectors/loggedIn'
import { SignButton } from '../TradeBoxMultiplier'

interface ICurrencyInputProps {
  decimalsLimit?: number
  decimalScale?: number
}

interface ISelectedPercentBarProps {
  value: string | number
  colors: any
  onChangeValue?: (value: any) => void
  onChangeRange?: (value: any, isSlider: boolean) => void
  trading: any
  hideSlider?: boolean
  currencyInputProps?: ICurrencyInputProps
  currentInstrument: IInstrument
  showButtonPlusMinus?: boolean
  onPressButtonPlusMinus?: (type: any) => void
  loggedIn: boolean
  minValue: number
  maxValue: number
  valueProcessBar?: number
  sliderStep?: number
  prefixInput?: string
}

const SelectedPercentBar = (props: ISelectedPercentBarProps) => {
  const onBlurInput = () => {
    if (props.minValue && props.maxValue) {
      let value = props.value
      if (props.value > props.maxValue) value = props.maxValue
      if (props.value < props.minValue) value = props.minValue
      props.onChangeValue && props.onChangeValue(value)
    }
  }

  const onAdjust = (direction: number) => {
    const { precision } = props.currentInstrument
    const difference = Number(`${(0).toFixed(precision - 1)}1`)
    const newValue = parseFloat(
      (Number(props.value) + direction * difference).toFixed(precision)
    )
    const isValueValid = Number(newValue) >= 0 && Number(newValue) <= 1000000
    isValueValid && props.onChangeValue && props.onChangeValue(newValue)
  }

  return (
    <div className="selected-percent-bar-container">
      {props.showButtonPlusMinus && (
        <SignButton
          fontSize={30}
          colors={props.colors}
          disabled={false}
          onClick={() => onAdjust(-1)}
        >
          -
        </SignButton>
      )}
      <CurrencyInput
        className={`input-field ${
          props.hideSlider ? 'input-field-without-slider' : ''
        }`}
        name="amount"
        max={props.maxValue}
        min={props.minValue}
        value={props.value}
        allowNegativeValue={false}
        decimalsLimit={
          props.currencyInputProps?.decimalsLimit ||
          props.currentInstrument.precision
        }
        prefix={props.prefixInput || ''}
        onBlur={onBlurInput}
        onValueChange={(value: any) =>
          props.onChangeValue && props.onChangeValue(value)
        }
        style={{ fontSize: 16 }}
        autoComplete="off"
      />
      {props.showButtonPlusMinus && (
        <SignButton
          fontSize={20}
          colors={props.colors}
          disabled={false}
          onClick={() => onAdjust(1)}
        >
          +
        </SignButton>
      )}
      {!props.hideSlider && (
        <div className="input-range">
          <Range
            onChange={(values: number[]) =>
              props.onChangeRange && props.onChangeRange(values[0], true)
            }
            max={
              props.maxValue <= props.minValue
                ? props.minValue + 1
                : props.maxValue
            }
            min={props.minValue}
            step={props.sliderStep}
            values={[props.valueProcessBar as number]}
            renderTrack={({ props: rangeProps, children }) => (
              <div
                onMouseDown={rangeProps.onMouseDown}
                onTouchStart={rangeProps.onTouchStart}
                style={{
                  ...rangeProps.style,
                  height: '14px',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <div
                  ref={rangeProps.ref}
                  style={{
                    height: '6px',
                    width: '100%',
                    borderRadius: '3px',
                    background: getTrackBackground({
                      values: [props.valueProcessBar as number],
                      colors: [
                        props.colors.accentDefault,
                        props.colors.tradebox.fieldBackground,
                      ],
                      min: props.minValue || 0,
                      max: props.maxValue || 1,
                    }),
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props: rangeProps }) => (
              <div {...rangeProps} className="slider-thumb" />
            )}
          />
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  loggedIn: isLoggedIn(state),
  currentInstrument: getInstrumentObject(state),
})

export default connect(mapStateToProps, {})(SelectedPercentBar)
