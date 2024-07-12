import React from 'react'
import { connect } from 'react-redux'
import './index.scss'
import classNames from 'classnames'
import { Colors } from '../../../models/color'

interface ICurrencyInputProps {
  decimalsLimit: number
  decimalScale: number
}

interface ITradeBoxSwitchProps {
  checked: boolean
  onChangeCheck: () => void
  colors: any
  size?: number
  sameColor?: boolean
}

const TradeBoxSwitch = (props: ITradeBoxSwitchProps) => {
  return (
    <div
      className={classNames({
        'trade-box-checkbox': true,
        'trade-box-checked': props.checked,
      })}
      style={props.size ? { width: props.size * 2, height: props.size } : {}}
      onClick={props.onChangeCheck}
    >
      <div
        className="trade-box-checkbox-background"
        style={{
          backgroundColor: props.colors.tradebox.fieldBackground,
          borderRadius: props.size ? props.size : 20,
        }}
      ></div>
      <div
        className="trade-box-checkbox-toggler"
        style={{
          backgroundColor:
            props.checked || props.sameColor
              ? props.colors.accentDefault
              : props.colors.defaultText,
          width: props.size ? props.size : 20,
          height: props.size ? props.size : 20,
        }}
      ></div>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
})

export default connect(mapStateToProps, {})(TradeBoxSwitch)
