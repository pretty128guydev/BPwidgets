import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  actionSetCurrentInvestment,
  actionSetStopLoss,
  actionSetProfit,
} from '../../../actions/trading'
import Images from '../../../assets/images'
import { IInstrument } from '../../../core/API'
import { Colors } from '../../../models/color'
import { getInstrumentObject } from '../../selectors/instruments'
import './index.scss'
import styled from 'styled-components'
import CurrencyInput from 'react-currency-input-field'
import Selector from '../../Selector/Selector'
import { getWalletCurrency } from '../../selectors/currency'
import { isLoggedIn } from '../../selectors/loggedIn'
import { toNumber } from 'lodash'
import { AvailableCurrencies } from '../../../models/registry'

export const InputRangeWrapper = styled.div<any>`
  .input-range__track {
    background: ${(props) => (props.colors as Colors).background};
  }

  .input-range__track.input-range__track--active {
    background-color: ${(props) => (props.colors as Colors).primary};
  }

  .select-percent-item {
    border: 2px solid transparent;

    &:hover {
      border-color: ${(props) => (props.colors as Colors).primary};
    }
  }
`

export const VerticalFlexContainer = styled.div`
  display: flex;
  flex-direction: column;

  iframe {
    flex: 1 1 auto;
  }
`

export const SignButton = styled.div<{
  colors: any
  disabled: boolean
  fontSize: number
  height?: number
}>`
  flex: 0 0 24px;
  height: ${(props) => props.height || 36}px;
  line-height: ${(props) => props.height || 36}px;
  border-radius: 3px;
  text-align: center;
  user-select: none;
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.colors.primaryText};
  background-color: ${(props) => props.colors.tradebox.fieldBackground};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:first-child {
    margin-right: 5px;
  }

  &:last-child {
    margin-left: 5px;
  }
`

interface ITradeBoxMultiplierProps {
  colors: any
  currentInstrument?: IInstrument
  actionSetCurrentInvestment: (value: number) => void
  actionSetStopLoss: (value: number) => void
  actionSetProfit: (value: number) => void
  stake: number
  defaultStake: number
  currency: any
  wallet: any
  wallets: any
  isLoggedIn: boolean
  isMobile?: boolean
  tradingConfigPerCurrency: any
  partnerConfig: any
  currencies: AvailableCurrencies
  stopLossPercent: number
  profitPercent: number
}

const TradeBoxMultiplier = (props: ITradeBoxMultiplierProps) => {
  const [percentAmount, setPercentAmount] = useState<number>(1)
  const [isUserInput, setIsUserInput] = useState<boolean>(false)

  const getMinMaxInvestment = () => {
    let currencyIndex
    if (Object.keys(props.wallet).length === 0) {
      const { defaultCurrency } = props.partnerConfig
      currencyIndex = Object.keys(props.currencies).find((key) => {
        return (
          props.currencies[key].currencyName === defaultCurrency.toLowerCase()
        )
      })
    } else {
      currencyIndex = props.wallet.baseCurrency
    }
    const { minStopLoss: minInvestment, maxStopLoss: maxInvestment } =
      props.tradingConfigPerCurrency[currencyIndex]
    return { minInvestment, maxInvestment }
  }

  const onAdjust = (direction: number) => {
    let investment = props.stake
    const { minInvestment, maxInvestment } = getMinMaxInvestment()
    let changeValue
    if (investment >= 5000) {
      changeValue = 100
    } else if (investment >= 500) {
      changeValue = 50
    } else if (investment < 1) {
      changeValue = minInvestment
    } else {
      changeValue = 1
    }
    investment += direction * changeValue
    if (investment < minInvestment || investment > maxInvestment) {
      return
    }
    onChangeValue(investment)
  }

  const onChangeValue = (value: any) => {
    if (!isUserInput) setIsUserInput(true)
    if (
      typeof value === 'string' &&
      (value?.includes('.') || value?.includes(','))
    )
      return props.actionSetCurrentInvestment(value as any)
    const valueNumber = toNumber(value)
    if (isNaN(valueNumber)) {
      props.actionSetCurrentInvestment(0)
    } else {
      // const { minInvestment, maxInvestment } = getMinMaxInvestment()
      // let value = valueNumber
      // if (valueNumber < minInvestment) value = minInvestment
      // if (valueNumber > maxInvestment) value = maxInvestment
      props.actionSetProfit((valueNumber * props.profitPercent) / 100)
      props.actionSetStopLoss((valueNumber * props.stopLossPercent) / 100)
      props.actionSetCurrentInvestment(valueNumber)
    }
  }

  return (
    <InputRangeWrapper colors={props.colors}>
      <div className="amount-currency-wrapper">
        <span className="amount-currency">
          {t`Amount`}{' '}
          {props.isLoggedIn
            ? ` (${props.currency?.currencyName?.toUpperCase()})`
            : ''}
        </span>
        {/* <span className="button-switch-margin">
          <Images.ArrowLeftRight
            width={18}
            height={18}
            style={{ marginRight: 4 }}
          />{' '}
          Margin
        </span> */}
      </div>
      <div
        className="investment-input"
        style={{
          color: props.colors.tradebox.oneClickTradeText,
          marginBottom: props.isMobile ? 0 : 18,
        }}
      >
        <SignButton
          fontSize={30}
          colors={props.colors}
          disabled={false}
          height={42}
          onClick={() => onAdjust(-1)}
        >
          -
        </SignButton>
        <CurrencyInput
          className={`amount-input ${
            props.isMobile ? 'amount-input-mobile' : ''
          }`}
          name="amount"
          value={props.stake}
          allowNegativeValue={false}
          prefix={props.currency.currencySymbol || '$'}
          onValueChange={onChangeValue}
          style={{
            fontSize: 22,
            backgroundColor: props.colors.tradebox.fieldBackground,
            padding: 8,
            borderRadius: 4,
            flex: 1,
          }}
          autoComplete="off"
        />
        <SignButton
          fontSize={20}
          colors={props.colors}
          disabled={false}
          onClick={() => onAdjust(1)}
          height={42}
        >
          +
        </SignButton>
        {/* {!props.isMobile && (
          <Selector
            items={[0.1, 0.25, 0.5, 0.75, 1]}
            borderColor={
              props.defaultStake === props.stake || isUserInput
                ? props.colors.secondaryText
                : props.colors.accentDefault
            }
            color={
              props.defaultStake === props.stake || isUserInput
                ? props.colors.secondaryText
                : props.colors.accentDefault
            }
            value={percentAmount}
            renderItem={(item) => <span>{item * 100}%</span>}
            renderLabel={(selectedItem: number) => (
              <span>{selectedItem * 100} % </span>
            )}
            onChange={(value: number) => {
              setPercentAmount(value)
              setIsUserInput(false)
              props.actionSetCurrentInvestment(
                parseFloat(
                  toNumber(
                    (props.wallet.availableCash || props.stake) * value
                  ).toFixed(2)
                )
              )
            }}
          ></Selector>
        )} */}
      </div>
    </InputRangeWrapper>
  )
}

const mapStateToProps = (state: any) => ({
  currentInstrument: getInstrumentObject(state),
  colors: state.theme,
  stake: state.trading.stake,
  defaultStake: state.trading.defaultStake,
  currency: getWalletCurrency(state),
  wallet: state.wallets.activeWallet,
  wallets: state.wallets,
  isLoggedIn: isLoggedIn(state),
  tradingConfigPerCurrency: state.registry.data.tradingConfigPerCurrency,
  partnerConfig: state.registry.data.partnerConfig,
  currencies: state.registry.data.availableCurrencies,
  stopLossPercent: state.trading.stopLossPercent,
  profitPercent: state.trading.profitPercent,
})

export default connect(mapStateToProps, {
  actionSetCurrentInvestment,
  actionSetStopLoss,
  actionSetProfit,
})(TradeBoxMultiplier)
