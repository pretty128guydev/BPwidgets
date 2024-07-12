import React, { useEffect, useState, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
  lastQuotesRiskForConversionChainInstruments,
  lastQuotesRiskForConversionChainProfitInstruments,
} from '../../selectors/instruments'
import { Colors } from '../../../models/color'
import CurrencyInput from 'react-currency-input-field'
import {
  IConversionChain,
  IInstrument,
  IWalletDetails,
} from '../../../core/API'
import styled, { css } from 'styled-components'
import { t } from 'ttag'
import {
  actionSetCurrentInvestment,
  actionSetLotValue,
  actionSetStopLoss,
  actionSetProfit,
  actionSetCheckedLots,
  actionSetLots,
} from '../../../actions/trading'
import TradeBoxMarginUsedPercent from '../TradeBoxMarginUsedPercent'
import { TradeDirection } from '../../../models/instrument'
import { isLoggedIn } from '../../selectors/loggedIn'
import TradeBoxSwitch from '../TradeBoxSwitch'
import Images from '../../../assets/images'
import { convertHexToRGBA, isMobileLandscape } from '../../../core/utils'
import { Currency } from '../../../models/registry'
import { IChallengeDashboardData } from '../../Dashboard/interfaces'
import { isNaN } from 'lodash'

const TradeBoxAmountUnit = styled.div<{
  colors: any
  isMobile: boolean
}>`
  margin-top: 10px;
  border-bottom: 1px solid ${(props) => props.colors.backgroundHue3};

  > .unit-amount-container {
    display: flex;
    flex-direction: row;
    padding-bottom: 14px;

    .units-lots-container {
      display: flex;
      flex-direction: row;
      align-items: center;

      .label-units {
        margin-right: 5px;
      }

      .label-lots {
        margin-left: 5px;
      }
    }
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .input-container {
    flex: 1;
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    cursor: pointer;
    position: relative;

    &:hover {
      border: 1px solid ${(props) => props.colors.accentDefault};
    }
  }

  .select-lots {
    width: 16px;
    display: flex;
    flex-direction: center;
    align-items: center;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .label {
    margin: 10px 0;
    color: ${(props) => props.colors.defaultText};
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
  }

  input.currency-input {
    border: 0px;
    outline: none;
    font-size: 16px;
    color: ${(props) => props.colors.primaryText};
    width: 100%;
    background-color: ${(props) => props.colors.fieldBackground};
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    opacity: 1;

    &.disable-input {
      color: ${(props) =>
        props.isMobile ? props.colors.primaryText : props.colors.secondaryText};
    }
  }
`

const SignButton = styled.div<{
  colors: any
  disabled: boolean
  fontSize: number
}>`
  flex: 0 0 18px;
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

const WrapBrowser = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;

  .container {
    position: relative;
    width: 100%;
    height: 100%;
  }
`

const LotsLabel = styled.div<{
  isMobile: boolean
  top: number
  maxHeight: number
  colors: any
}>`
  background-color: ${(props) => props.colors.backgroundHue3};
  position: absolute;

  ${(props) =>
    props.isMobile
      ? isMobileLandscape(props.isMobile)
        ? css`
            right: 123px;
          `
        : css`
            left: 43px;
          `
      : css`
          right: 123px;
        `};

  ${(props) =>
    props.isMobile && !isMobileLandscape(props.isMobile)
      ? css`
          bottom: ${props.top}px;
        `
      : css`
          top: ${props.top}px;
        `};
  ${(props) =>
    props.isMobile
      ? isMobileLandscape(props.isMobile)
        ? css`
            width: 107px;
          `
        : css`
            width: ${(window.innerWidth / 3) * 2 - 78}px;
          `
      : css`
          width: 107px;
        `};
  box-shadow: 0 0 15px #263346;
  border-radius: 4px;

  .time-duration-label-header {
    position: relative;
    height: 40px;
    font-weight: bold;
    font-size: 12px;
    color: #8b9097;
  }

  .lots-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    overflow: auto;
    max-height: ${(props) => props.maxHeight}px;
  }

  .scrollable-container {
    &::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      width: 6px;
      border-radius: 3px;
      background-color: rgba(255, 255, 255, 0.7);
    }
  }
`

const LotItem = styled.div<{ colors: any; isActive: boolean }>`
  width: 100%;
  background: #06141f;
  margin: 1px;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 9px 15px;
  ${(props) =>
    props.isActive
      ? css`
          background-color: ${convertHexToRGBA(
            props.colors.accentDefault,
            0.2
          )};
          pointer-events: none;
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
          background-color: transparent;
          border: 1px solid transparent;
        `}

  .top, .bottom {
    white-space: nowrap;
    display: flex;
  }

  .bottom {
    line-height: 12px;
  }

  .time {
    font-size: 13px;
    color: ${(props) =>
      props.isActive ? props.colors.accentDefault : props.colors.secondaryText};
    font-weight: 500;
  }

  &:hover {
    border: 1px solid ${(props) => props.colors.accentDefault};
  }
`

interface ICurrencyInputProps {
  decimalsLimit: number
  decimalScale: number
}

interface ITradeBoxAmountUnitsProps {
  stake: number
  lotValue: number
  colors: any
  currentInstrument: IInstrument
  currencySymbol: string
  actionSetCurrentInvestment: (value: number) => void
  actionSetLotValue: (value: number) => void
  conversionChain: IConversionChain
  quote: any
  quotes: any[]
  leverage: number
  conversionChainProfit: IConversionChain
  actionSetStopLoss: (value: number) => void
  actionSetProfit: (value: number) => void
  stopLossPips: number
  profitPips: number
  quotesProfit: any[]
  isMobile: boolean
  selectedDirection: TradeDirection
  isLoggedIn: boolean
  activeWallet: IWalletDetails
  checkedLots: boolean
  lots: number
  actionSetCheckedLots: () => void
  actionSetLots: (value: any) => void
  availableCurrencies: {
    [props: string]: Currency
  }
  challengeDashboard: IChallengeDashboardData
  isNonMargin?: boolean
  profitPercent: number
  stopLossPercent: number
}

const LOTS_LIST = [
  0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5,
  0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
]

const TradeBoxAmountUnits = (props: ITradeBoxAmountUnitsProps) => {
  const {
    currentInstrument,
    colors,
    stake,
    lotValue,
    conversionChain,
    currencySymbol,
    quote,
    quotes,
    actionSetCurrentInvestment,
    actionSetLotValue,
    leverage,
    conversionChainProfit,
    actionSetStopLoss,
    actionSetProfit,
    stopLossPips,
    profitPips,
    quotesProfit,
    isMobile,
    selectedDirection,
    isLoggedIn,
    activeWallet,
    checkedLots,
    actionSetCheckedLots,
    lots,
    actionSetLots,
    availableCurrencies,
    challengeDashboard,
    isNonMargin,
    profitPercent,
    stopLossPercent,
  } = props

  const { contractSize, tradingConfig } = currentInstrument

  const onAdjust = (direction: number) => {
    if (checkedLots) {
      const index = LOTS_LIST.findIndex((l) => l === lots)
      if (index === 0 && direction === -1) return
      if (index === LOTS_LIST.length - 1 && direction === 1) return
      const newIndex = index + direction
      actionSetLots(LOTS_LIST[newIndex])
      actionSetLotValue(
        parseFloat((LOTS_LIST[newIndex] * contractSize).toFixed(5))
      )
    } else {
      if (Number(lotValue) + direction * currentInstrument.lotValue < 0) return
      const newValue = Number(lotValue) + direction * currentInstrument.lotValue
      actionSetLotValue(parseFloat(newValue.toFixed(5)))
    }
  }

  let currentLeverage = leverage

  if (activeWallet.challengeID) {
    const { state } = challengeDashboard
    if (
      state.leverageCap &&
      Number(state.leverageCap) < tradingConfig.defaultLeverage
    ) {
      currentLeverage = Number(state.leverageCap)
    }
  }

  const lotsInputContainerRef = useRef<any>(null)

  const [showSelectLots, setShowSelectLots] = useState<boolean>(false)

  const [top, setTop] = useState<number>(0)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  const getLotsPosition = useCallback(() => {
    const { y = 0 } =
      lotsInputContainerRef.current?.getBoundingClientRect() || {}

    const windowHeight = window.innerHeight
    if (isMobile && !isMobileLandscape(isMobile)) {
      const maxH = y - 7
      setMaxHeight(maxH)
      setTop(windowHeight - y + 2)
    } else {
      const maxH = windowHeight - (y + 47)
      setMaxHeight(maxH)
      setTop(y + 38)
    }
  }, [isMobile])

  useEffect(() => {
    window.addEventListener('resize', getLotsPosition)

    return () => window.removeEventListener('resize', getLotsPosition)
  }, [])

  useEffect(() => {
    if (isNonMargin && checkedLots) onChangeCheckedLots()
  }, [isNonMargin])

  useEffect(() => {
    getLotsPosition()
  }, [showSelectLots, getLotsPosition])

  useEffect(() => {
    let stake

    const lValue = lotValue ? Number(lotValue) : 0

    if (!quote?.last) {
      stake = 0
    } else if (!conversionChain || !conversionChain?.needsConversion) {
      stake = lValue / currentLeverage
    } else {
      let value = lValue / currentLeverage
      const { operations } = conversionChain
      operations.forEach((o) => {
        const { instrumentID, action } = o
        const quo = quotes.find((q) => q.instrumentID === instrumentID)
        if (quo) value = action === '*' ? value * quo.last : value / quo.last
      })
      stake = value
    }

    const currency: Currency = availableCurrencies[activeWallet.baseCurrency]

    actionSetCurrentInvestment(
      parseFloat(stake.toFixed(currency?.currencyName === 'btc' ? 4 : 2))
    )

    if (isNonMargin) {
      actionSetProfit((stake * profitPercent) / 100)
      actionSetStopLoss((stake * stopLossPercent) / 100)
    } else {
      let pipValue = lValue * (currentInstrument?.pip || 0)
      const { operations } = conversionChainProfit
      operations.forEach((o) => {
        const { instrumentID, action } = o
        const quo = quotesProfit.find((q) => q.instrumentID === instrumentID)
        if (quo)
          pipValue = action === '*' ? pipValue * quo.last : pipValue / quo.last
      })

      actionSetStopLoss(parseFloat((stopLossPips * pipValue).toFixed(5)))
      actionSetProfit(parseFloat((profitPips * pipValue).toFixed(5)))
    }
  }, [
    actionSetCurrentInvestment,
    actionSetProfit,
    actionSetStopLoss,
    conversionChain,
    conversionChainProfit,
    currentInstrument,
    leverage,
    lotValue,
    profitPips,
    quote,
    quotes,
    quotesProfit,
    stopLossPips,
  ])

  const onChangeCheckedLots = () => {
    actionSetCheckedLots()
    const value = !checkedLots ? lots * contractSize : lotValue
    actionSetLotValue(value)
  }

  return (
    <TradeBoxAmountUnit colors={colors} isMobile={isMobile}>
      <div className="unit-amount-container">
        <div style={{ flex: 3 }}>
          <div className="units-lots-container">
            <div
              className="label label-units"
              style={!checkedLots ? { color: colors.secondaryText } : {}}
            >{t`Units`}</div>
            {!isNonMargin && (
              <TradeBoxSwitch
                checked={checkedLots}
                onChangeCheck={onChangeCheckedLots}
                size={12}
                sameColor={true}
              />
            )}
            {!isNonMargin && (
              <div
                className="label label-lots"
                style={checkedLots ? { color: colors.secondaryText } : {}}
              >{t`Lots`}</div>
            )}
          </div>
          <div className="flex-row">
            <SignButton
              fontSize={30}
              colors={colors}
              disabled={false}
              onClick={() => onAdjust(-1)}
            >
              -
            </SignButton>
            {checkedLots ? (
              <div ref={lotsInputContainerRef} className="input-container">
                <div
                  className="currency-input"
                  style={{ color: colors.secondaryText }}
                >
                  <CurrencyInput
                    className="currency-input"
                    name="amount"
                    value={lots || 0}
                    allowNegativeValue={false}
                    style={{ color: colors.secondaryText }}
                    decimalsLimit={2}
                    onValueChange={(value) => {
                      actionSetLots(value)
                      actionSetLotValue(
                        (isNaN(Number(value)) ? 0 : Number(value)) *
                          contractSize
                      )
                    }}
                    autoComplete="off"
                  />
                </div>
                <div
                  className="select-lots"
                  onClick={() => setShowSelectLots(true)}
                >
                  <Images.ArrowDown
                    width={14}
                    height={14}
                    stroke={colors.secondaryText}
                  />
                </div>
              </div>
            ) : (
              <CurrencyInput
                className="currency-input"
                name="amount"
                value={checkedLots ? lots : lotValue}
                allowNegativeValue={false}
                style={{ color: colors.secondaryText }}
                decimalsLimit={2}
                onValueChange={(value) => {
                  actionSetLotValue(value as any)
                }}
                autoComplete="off"
              />
            )}
            <SignButton
              fontSize={20}
              colors={colors}
              disabled={false}
              onClick={() => onAdjust(1)}
            >
              +
            </SignButton>
          </div>
        </div>
        <div style={{ flex: 2 }}>
          <div className="label">{t`Amount`}</div>
          <div>
            <CurrencyInput
              className="currency-input disable-input"
              name="amount"
              value={stake}
              allowNegativeValue={false}
              style={{ color: colors.defaultText }}
              prefix={currencySymbol}
              decimalsLimit={5}
              disabled
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      {selectedDirection !== 0 && isLoggedIn && activeWallet.isMargin && (
        <TradeBoxMarginUsedPercent />
      )}
      {showSelectLots && (
        <WrapBrowser onClick={() => setShowSelectLots(false)}>
          <LotsLabel
            isMobile={isMobile}
            top={top}
            maxHeight={maxHeight}
            colors={colors}
          >
            <div className="lots-container scrollable">
              {LOTS_LIST.map((lot, index) => {
                return (
                  <LotItem
                    key={`lot-item-${index}`}
                    colors={colors}
                    isActive={lots === lot}
                    onClick={() => {
                      setShowSelectLots(false)
                      actionSetLots(lot)
                      actionSetLotValue(LOTS_LIST[index] * contractSize)
                    }}
                  >
                    <div className="top">
                      <span className="time">{lot}</span>
                    </div>
                  </LotItem>
                )
              })}
            </div>
          </LotsLabel>
        </WrapBrowser>
      )}
    </TradeBoxAmountUnit>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  currentInstrument: getInstrumentObject(state),
  stake: state.trading.stake,
  leverage: state.trading.currentLeverage,
  lotValue: state.trading.lotValue,
  conversionChain: state.trading.conversionChain,
  quote: lastQuoteRiskForSelectedInstrument(state),
  quotes: lastQuotesRiskForConversionChainInstruments(state),
  conversionChainProfit: state.trading.conversionChainProfit,
  stopLossPips: state.trading.stopLossPips,
  profitPips: state.trading.profitPips,
  quotesProfit: lastQuotesRiskForConversionChainProfitInstruments(state),
  selectedDirection: state.trading.selectedDirection,
  checkedLots: state.trading.checkedLots,
  isLoggedIn: isLoggedIn(state),
  activeWallet: state.wallets.activeWallet,
  challengeDashboard: state.wallets.challengeDashboard,
  lots: state.trading.lots,
  availableCurrencies: state.registry.data.availableCurrencies,
  profitPercent: state.trading.profitPercent,
  stopLossPercent: state.trading.stopLossPercent,
})

export default connect(mapStateToProps, {
  actionSetCurrentInvestment,
  actionSetLotValue,
  actionSetStopLoss,
  actionSetProfit,
  actionSetCheckedLots,
  actionSetLots,
})(TradeBoxAmountUnits)
