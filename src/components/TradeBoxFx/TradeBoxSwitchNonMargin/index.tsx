import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { getInstrumentObject } from '../../selectors/instruments'
import './index.scss'
import classNames from 'classnames'
import { actionSetTradingError } from '../../../actions/trading'
import SelectedPercentBar from '../SelectedPercentBar'
import { toNumber } from 'lodash'
import { IInstrument } from '../../../core/API'
import { getWalletCurrency } from '../../selectors/currency'
import { isLoggedIn } from '../../selectors/loggedIn'
import Images from '../../../assets/images'

interface ICurrencyInputProps {
  decimalsLimit: number
  decimalScale: number
}

interface ITradeBoxSwitchNonMarginProps {
  checked: boolean
  title: string
  value: string | number
  subTitle?: string
  subValue?: string | number
  onChangeCheck: (value: boolean) => void
  colors: any
  percentOptions: number[]
  onChangeValue?: (value: string) => void
  onChangeRange?: (value: number) => void
  selectedPercent?: number
  trading: any
  currency: any
  hideChangeType?: boolean
  currentInstrument: IInstrument
  currencyInputProps?: ICurrencyInputProps
  isLoggedIn?: boolean
  minValue: number
  maxValue: number
  valueProcessBar?: number
  sliderStep?: number
  showButtonPlusMinus?: boolean
  type?: string
  onChangeType?: (type: string) => void
  prefixInput?: string
  showSwitch: boolean
  hideSlider?: boolean
}

const TradeBoxSwitchNonMargin = (props: ITradeBoxSwitchNonMarginProps) => {
  return (
    <div>
      <div className="trade-box-checkbox-top">
        <div className="trade-box-checkbox-top-left">
          <span
            style={{
              color: props.colors.secondaryText,
              fontSize: 12,
            }}
          >
            {props.title}
          </span>
        </div>
        <div className="trade-box-checkbox-top-right">
          {props.checked && !props.hideChangeType && (
            <span
              onClick={() =>
                props.onChangeType &&
                props.onChangeType(props.type === 'amount' ? 'rate' : 'amount')
              }
              className="button-switch-margin button-switch-margin-switch"
              style={{ marginRight: 0, cursor: 'pointer' }}
            >
              <Images.ArrowLeftRight
                width={18}
                height={18}
                style={{ marginRight: 4 }}
              />{' '}
              {props.type === 'amount' ? t`Amount` : t`Rate`}
            </span>
          )}
          {props.showSwitch && (
            <div
              className={classNames({
                'trade-box-checkbox': true,
                'trade-box-checked': props.checked,
              })}
              onClick={() => {
                props.onChangeCheck(!props.checked)
              }}
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
                  backgroundColor: props.checked
                    ? props.colors.accentDefault
                    : props.colors.secondaryText,
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
      {!!props.percentOptions && props.checked && (
        <>
          <SelectedPercentBar {...props} />
          {props.subTitle && props.subValue ? (
            <div
              className="trade-box-subtitle"
              style={{ color: props.colors.secondaryText }}
            >
              {`${props.subTitle}: `}
              <span
                className="trade-box-subtitle-value"
                style={{ color: props.colors.accentDefault }}
              >
                {`${
                  props.type === 'rate' ? props.currency?.currencySymbol : ''
                }${parseFloat(
                  toNumber(props.subValue).toFixed(
                    props.currentInstrument.precision
                  )
                )}`}
              </span>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  currentInstrument: getInstrumentObject(state),
  colors: state.theme,
  trading: state.trading,
  currency: getWalletCurrency(state),
  isLoggedIn: isLoggedIn(state),
})

export default connect(mapStateToProps, {
  actionSetTradingError,
})(TradeBoxSwitchNonMargin)
