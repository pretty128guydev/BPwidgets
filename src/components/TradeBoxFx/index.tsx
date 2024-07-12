// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import TradeBuyButton from './TradeBuyButton'
import TradeSellButton from './TradeSellButton'
import './index.scss'
import { LineExpand, LineExpandIcon, Panel, TradeboxSLTP } from './styled'
import { TradeDirection } from '../../models/instrument'
import {
  actionSubmitTrade,
  actionSetPendingOrder,
  actionSetTradeIfReachPendingOrder,
  actionSetStopLoss,
  actionSetCheckedStopLoss,
  actionSetProfit,
  actionSetCheckedProfit,
  actionSetCurrentDirection,
  actionSetProfitPercent,
  actionSetStopLossPercent,
  actionSetProfitPips,
  actionSetStopLossPips,
  actionSetProfitCoe,
  actionSetStopLossCoe,
} from '../../actions/trading'
import TradeBoxInstrument from './TradeBoxInstrument'
import TradeBoxSummary from './TradeBoxSummary'
import { IConversionChain, IInstrument, IWalletDetails } from '../../core/API'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
  lastQuotesRiskForConversionChainProfitInstruments,
} from '../selectors/instruments'
import { IQuote } from '../../reducers/quotes'
import TradeSubmit from '../notifications/TradeSubmit'
import { getWalletCurrencySymbol } from '../selectors/currency'
import ModalConfirmSubmit from './ModalConfirmSubmit'
import { isLoggedIn } from '../selectors/loggedIn'
import { isMobileLandscape } from '../../core/utils'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import Tabs from './Tabs'
import TradeBoxSwitch from './TradeBoxSwitch'
import CurrencyInput from 'react-currency-input-field'
import TradeBoxAmountUnits from './TradeBoxAmountUnits'
import TradeBoxLimitPrice from './TradeBoxLimitPrice'
import { delay } from 'lodash'
import {
  calculateStopLossPipsFromCoeWhenOpenTrade,
  calculateProfitPipsFromCoe,
  calculateProfitPrice,
  calculateStopLossPrice,
} from '../../sagas/tradingHelper'
import { getTakeProfitBoundaries } from '../../core/utils'

interface ITradeBoxProps {
  colors: any
  stopLoss: number
  selectedDirection: TradeDirection
  actionSubmitTrade: (attributes: any) => void
  actionSetPendingOrder: (value: any) => void
  currentInstrument: IInstrument
  quote: IQuote | {}
  actionSetTradeIfReachPendingOrder: (tradeIfReachPending: boolean) => void
  tradeIfReachPending: boolean
  checkedStopLoss: boolean
  profit: number
  checkedProfit: boolean
  actionSetStopLoss: (value: number) => void
  actionSetCheckedStopLoss: () => void
  actionSetProfit: (value: number) => void
  actionSetCheckedProfit: () => void
  stake: number
  currencySymbol: string
  actionSetCurrentDirection: (value: number | null) => void
  actionSetProfitPercent: (value: number) => void
  actionSetStopLossPercent: (value: number) => void
  actionSetProfitPips: (value: number) => void
  actionSetStopLossPips: (value: number) => void
  actionSetProfitCoe: (value: number) => void
  actionSetStopLossCoe: (value: number) => void
  stopLossCoe: number
  profitCoe: number
  stopLossPips: number
  profitPips: number
  lotValue: number
  isMobile?: boolean
  isLoggedIn: boolean
  actionShowModal: (modalName: ModalTypes, props?: any) => void
  conversionChainProfit: IConversionChain
  quotesProfit: any[]
  activeWallet: IWalletDetails
  chartHistory: any
  pendingOrder: number
}

const TradeBoxFX = (props: ITradeBoxProps) => {
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false)
  const [edittedFieldSL, setEdittedFieldSL] = useState('')
  const [edittedFieldTP, setEdittedFieldTP] = useState('')

  const {
    isMobile,
    colors,
    selectedDirection,
    currentInstrument,
    quote,
    tradeIfReachPending,
    checkedStopLoss,
    checkedProfit,
    stake,
    currencySymbol,
    stopLossCoe,
    profitCoe,
    stopLoss,
    profit,
    isLoggedIn,
    stopLossPips,
    profitPips,
    lotValue,
    conversionChainProfit,
    quotesProfit,
    activeWallet,
    actionSubmitTrade,
    actionSetPendingOrder,
    actionSetTradeIfReachPendingOrder,
    actionSetCheckedStopLoss,
    actionSetCheckedProfit,
    actionSetCurrentDirection,
    actionShowModal,
    actionSetProfitCoe,
    actionSetStopLossCoe,
    actionSetStopLossPips,
    actionSetProfitPips,
    actionSetStopLoss,
    actionSetProfit,
    chartHistory,
    pendingOrder: pd,
  } = props

  const pendingOrder = Number(pd)

  const [hidePanel, setHidePanel] = useState(false)

  const [pipValue, setPipValue] = useState(
    lotValue * (currentInstrument?.pip || 0)
  )

  const [last, setLast] = useState<number>(
    tradeIfReachPending
      ? pendingOrder
      : (quote as IQuote)?.last ||
          chartHistory?.aggs?.[chartHistory.aggs.length - 2]?.close
  )

  useEffect(() => {
    if (tradeIfReachPending) {
      if (pendingOrder !== last) setLast(pendingOrder)
    } else {
      setLast(
        (quote as IQuote)?.last ||
          chartHistory?.aggs?.[chartHistory.aggs.length - 2]?.close
      )
    }
  }, [tradeIfReachPending, pendingOrder, quote, chartHistory])

  const { tradingConfig, pip } = currentInstrument
  const { limitDelta, deltaSpread, defaultTakeProfit } = tradingConfig

  const minStopLossPips = limitDelta / pip

  const { minTakeProfit, maxTakeProfit } = getTakeProfitBoundaries(
    tradingConfig,
    stake
  )

  const prevQuote = useRef(quote)

  const tabs = [t`MARKET`, t`LIMIT`]
  const [disabledTabIndex, setDisabledTabIndex] = useState<number[]>(
    currentInstrument.isOpen ? [] : [0]
  )
  const [tab, setTab] = useState<number>(0)

  const [changingField, setChangingField] = useState<string>('')

  useEffect(() => {
    if (!activeWallet.isMargin) {
      actionSetCheckedStopLoss(true)
      actionSetCheckedProfit(true)
    }
  }, [])

  useEffect(() => {
    if (
      Object.keys(prevQuote.current).length === 0 &&
      Object.keys(quote).length !== 0
    ) {
      prevQuote.current = quote
      if (currentInstrument.isOpen) {
        setTab(0)
        setDisabledTabIndex([])
        actionSetTradeIfReachPendingOrder(false)
        actionSetPendingOrder(0)
      } else {
        setTab(1)
        setDisabledTabIndex([0])
        actionSetTradeIfReachPendingOrder(true)
        actionSetPendingOrder(
          (quote as IQuote)?.last ||
            chartHistory?.aggs?.[chartHistory.aggs.length - 2]?.close ||
            0
        )
      }
    }
  }, [prevQuote, quote])

  useEffect(() => {
    if (currentInstrument.isOpen) {
      setTab(0)
      setDisabledTabIndex([])
      actionSetTradeIfReachPendingOrder(false)
      actionSetPendingOrder(0)
    } else {
      setTab(1)
      setDisabledTabIndex([0])
      actionSetTradeIfReachPendingOrder(true)
      actionSetPendingOrder(
        chartHistory?.instrumentId === currentInstrument.instrumentID
          ? (quote as IQuote)?.last ||
              chartHistory?.aggs?.[chartHistory.aggs.length - 2]?.close ||
              0
          : 0
      )
    }
  }, [currentInstrument, chartHistory?.instrumentId])

  useEffect(() => {
    let pipValue = lotValue * (currentInstrument?.pip || 0)
    const { operations } = conversionChainProfit
    operations.forEach((o) => {
      const { instrumentID, action } = o
      const quo = quotesProfit.find((q) => q.instrumentID === instrumentID)
      if (quo)
        pipValue = action === '*' ? pipValue * quo.last : pipValue / quo.last
    })
    setPipValue(pipValue)
    const slPips = pipValue === 0 ? 0 : stake / pipValue
    if (edittedFieldSL === '') {
      actionSetStopLossPips(slPips)
      actionSetStopLoss(slPips * pipValue)
    }
    const tpPips =
      pipValue === 0 ? 0 : ((stake / pipValue) * defaultTakeProfit) / 100
    if (edittedFieldTP === '') {
      actionSetProfitPips(tpPips)
      actionSetProfit(tpPips * pipValue)
    }
  }, [
    stake,
    currentInstrument,
    lotValue,
    quotesProfit,
    edittedFieldSL,
    edittedFieldTP,
  ])

  useEffect(() => {
    if (edittedFieldSL !== 'stopLossCoe') {
      const stopLossCoe = calculateStopLossPrice({
        lastPrice: last || 0,
        pips: stopLossPips || 0,
        pip: pip || 0,
        direction: selectedDirection,
        deltaSpread,
      })
      actionSetStopLossCoe(Number(stopLossCoe) || 0)
    }
  }, [actionSetStopLossCoe, last, pip, stopLossPips, edittedFieldSL])

  useEffect(() => {
    if (edittedFieldTP !== 'profitCoe') {
      const profitCoe = calculateProfitPrice({
        lastPrice: last || 0,
        pips: profitPips || 0,
        pip: pip || 0,
        direction: selectedDirection,
      })
      actionSetProfitCoe(Number(profitCoe) || 0)
    }
  }, [actionSetProfitCoe, last, pip, profitPips, edittedFieldTP])

  const getColor = () => {
    if (
      selectedDirection === TradeDirection.up &&
      stake !== 0 &&
      stopLossPips > 0 &&
      profitPips > 0
    ) {
      return {
        text: colors.primaryDefault,
        border: `2px solid ${colors.primaryDefault}`,
        opacity: 1,
      }
    }
    if (
      selectedDirection === TradeDirection.down &&
      stake !== 0 &&
      stopLossPips > 0 &&
      profitPips > 0
    ) {
      return {
        text: colors.primaryHue1,
        border: `2px solid ${colors.primaryHue1}`,
        opacity: 1,
      }
    }
    return {
      text: colors.defaultText,
      border: `2px solid ${colors.defaultText}`,
      opacity: 0.3,
    }
  }

  const btnColor = getColor()

  const onBlur = (field: string) => {
    setChangingField('')
    switch (field) {
      case 'stopLossPips':
      case 'stopLossCoe':
        let stoploss = pipValue * stopLossPips

        if (stoploss <= 0 || stopLossCoe <= 0 || stopLossPips <= 0) {
          const slPips = minStopLossPips
          setEdittedFieldSL('')
          stoploss = pipValue * slPips
          const slCoe = calculateStopLossPrice({
            lastPrice: last || 0,
            pips: slPips,
            pip: pip || 0,
            direction: selectedDirection,
            deltaSpread,
          })
          actionSetStopLossPips(slPips)
          actionSetStopLossCoe(slCoe)
          actionSetStopLoss(stoploss)
        }
        break
      case 'profitPips':
      case 'profitCoe':
        let profit = pipValue * profitPips

        if (profit <= 0 || profitPips <= 0 || profitCoe <= 0) {
          setEdittedFieldTP('')
          profit = profit < minTakeProfit ? minTakeProfit : maxTakeProfit
          const profitPips = profit / pipValue
          const profitCoe = calculateProfitPrice({
            lastPrice: last || 0,
            pips: profitPips,
            pip: pip || 0,
            direction: selectedDirection,
          })
          actionSetProfitPips(profitPips)
          actionSetProfitCoe(profitCoe)
          actionSetProfit(profit)
        }
        break
      default:
        break
    }
  }

  const onFocus = (field: string) => {
    delay(() => setChangingField(field), 100)
  }

  const onChange = (field: string, value: string) => {
    switch (field) {
      case 'stopLossPips':
        const slPips = value
        actionSetStopLossPips(slPips)
        actionSetStopLoss(slPips * pipValue)
        break
      case 'profitPips':
        const pPips = value
        actionSetProfitPips(pPips)
        actionSetProfit(pPips * pipValue)
        break
      case 'stopLossCoe':
        const stopLossPips = calculateStopLossPipsFromCoeWhenOpenTrade({
          lastPrice: last || 0,
          coe: value,
          pip: pip || 0,
          direction: selectedDirection,
        })
        actionSetStopLossCoe(value)
        actionSetStopLossPips(stopLossPips)
        break
      case 'profitCoe':
        const profitPips = calculateProfitPipsFromCoe({
          lastPrice: last || 0,
          coe: value,
          pip: pip || 0,
          direction: selectedDirection,
        })
        actionSetProfitCoe(value)
        actionSetProfitPips(profitPips)
        break
      default:
        break
    }
  }

  const onmydirection = (field: string) => {
    switch (field) {
      case 'up':
        const upstopLossPips = calculateStopLossPipsFromCoeWhenOpenTrade({
          lastPrice: last || 0,
          coe: stopLossCoe,
          pip: pip || 0,
          direction: 1,
        })
        actionSetStopLossPips(upstopLossPips)
        const upprofitPips = calculateProfitPipsFromCoe({
          lastPrice: last || 0,
          coe: profitCoe,
          pip: pip || 0,
          direction: 1,
        })
        actionSetProfitPips(upprofitPips)
        break
      case 'down':
        const downstopLossPips = calculateStopLossPipsFromCoeWhenOpenTrade({
          lastPrice: last || 0,
          coe: stopLossCoe,
          pip: pip || 0,
          direction: -1,
        })
        actionSetStopLossPips(downstopLossPips)
        const downprofitPips = calculateProfitPipsFromCoe({
          lastPrice: last || 0,
          coe: profitCoe,
          pip: pip || 0,
          direction: -1,
        })
        actionSetProfitPips(downprofitPips)
        break
      default:
        break
    }
  }

  return (
    <Panel
      colors={colors}
      isMobile={isMobile}
      hidePanel={hidePanel}
      className={`scrollable ${
        isMobile ? 'trade-box-mobile' : 'trade-box-desktop'
      }`}
    >
      {(!isMobile || isMobileLandscape(isMobile)) && (
        <LineExpand
          hidePanel={hidePanel}
          colors={colors}
          isMobile={isMobile}
          isLoggedIn={isLoggedIn}
          className="line-expanded"
          onClick={() => setHidePanel(!hidePanel)}
        >
          <LineExpandIcon colors={colors}>
            <span>▾</span>
            <span>▾</span>
          </LineExpandIcon>
        </LineExpand>
      )}
      {(!isMobile || isMobileLandscape(isMobile)) && (
        <TradeBoxInstrument isMobile={isMobile}></TradeBoxInstrument>
      )}
      {isMobile && isMobileLandscape(isMobile) && (
        <div style={{ height: '20px' }}></div>
      )}
      <div className="trade-buttons">
        <TradeSellButton
          isMobile={isMobile}
          onClick={() => {
            if (!(selectedDirection === TradeDirection.down)) {
              actionSetCurrentDirection(TradeDirection.down)
              onmydirection('down')
            } else {
              actionSetCurrentDirection(TradeDirection.none)
            }
          }}
        />
        <TradeBuyButton
          isMobile={isMobile}
          onClick={() => {
            if (!(selectedDirection === TradeDirection.up)) {
              actionSetCurrentDirection(TradeDirection.up)
              onmydirection('up')
            } else {
              actionSetCurrentDirection(TradeDirection.none)
            }
          }}
        ></TradeBuyButton>
        {!isMobile && <TradeSubmit />}
      </div>
      <Tabs
        value={tab}
        tabs={tabs}
        onChange={(index) => {
          setTab(index)
          actionSetTradeIfReachPendingOrder(index === 1)
          actionSetPendingOrder(
            index === 1
              ? (quote as IQuote)?.last ||
                  chartHistory?.aggs?.[chartHistory.aggs.length - 2]?.close ||
                  0
              : 0
          )
        }}
        disabledTabIndex={disabledTabIndex}
      />
      {tab === 1 && <TradeBoxLimitPrice />}
      <TradeBoxAmountUnits
        currencySymbol={currencySymbol}
        isMobile={isMobile}
      />
      <TradeboxSLTP colors={colors} isMobile={isMobile}>
        <div className="sltp-row">
          <div>
            <span>{t`SL`}</span>
            <TradeBoxSwitch
              checked={checkedStopLoss}
              onChangeCheck={actionSetCheckedStopLoss}
            />
          </div>
          <div className="center"></div>
          <div>
            <span>{t`TP`}</span>
            <TradeBoxSwitch
              checked={checkedProfit}
              onChangeCheck={actionSetCheckedProfit}
            />
          </div>
        </div>
        {!(!checkedStopLoss && !checkedProfit && activeWallet.isMargin) && (
          <div className="sltp-row">
            <div>
              <CurrencyInput
                className={`currency-input ${
                  checkedStopLoss
                    ? ''
                    : activeWallet.isMargin
                    ? 'hidden-input'
                    : 'disable-input'
                } ${changingField === 'stopLossPips' ? 'field-active' : ''}`}
                name="stop-loss-pip"
                value={parseFloat(Number(stopLossPips).toFixed())}
                decimalsLimit={0}
                allowDecimals={false}
                onValueChange={(value: any) => {
                  setEdittedFieldSL('stopLossPips')
                  if (
                    parseFloat(Number(value).toFixed()) !==
                    parseFloat(Number(stopLossPips).toFixed())
                  )
                    onChange('stopLossPips', value || 0)
                }}
                onFocus={() => onFocus('stopLossPips')}
                onBlur={() => onBlur('stopLossPips')}
                disabled={!checkedStopLoss}
                autoComplete="off"
              />
            </div>
            <div className="center">{t`Pips`}</div>
            <div>
              <CurrencyInput
                className={`currency-input ${
                  checkedProfit
                    ? ''
                    : activeWallet.isMargin
                    ? 'hidden-input'
                    : 'disable-input'
                } ${changingField === 'profitPips' ? 'field-active' : ''}`}
                name="take-profit-pip"
                value={parseFloat(Number(profitPips).toFixed())}
                allowDecimals={false}
                decimalsLimit={0}
                onValueChange={(value: any) => {
                  setEdittedFieldTP('profitPips')
                  if (
                    parseFloat(Number(value).toFixed()) !==
                    parseFloat(Number(profitPips).toFixed())
                  )
                    onChange('profitPips', value || 0)
                }}
                onFocus={() => onFocus('profitPips')}
                onBlur={() => onBlur('profitPips')}
                disabled={!checkedProfit}
                autoComplete="off"
              />
            </div>
          </div>
        )}
        {!(!checkedStopLoss && !checkedProfit && activeWallet.isMargin) && (
          <div className="sltp-row">
            <div>
              <CurrencyInput
                className={`currency-input ${
                  checkedStopLoss
                    ? ''
                    : activeWallet.isMargin
                    ? 'hidden-input'
                    : 'disable-input'
                } ${changingField === 'stopLossCoe' ? 'field-active' : ''}`}
                style={
                  Number(stopLossPips) <= 0
                    ? { borderColor: colors.tradebox.lowActive }
                    : {}
                }
                name="stop-loss-coe"
                value={
                  typeof stopLossCoe === 'string'
                    ? stopLossCoe
                    : parseFloat(Number(stopLossCoe).toFixed(5))
                }
                onValueChange={(value: any) => {
                  setEdittedFieldSL('stopLossCoe')
                  if (
                    value === undefined ||
                    value[value.length - 1] === '.' ||
                    stopLossCoe[stopLossCoe.length - 1] === '.' ||
                    value[value.length - 1] !== '.' /*&&
                      parseFloat(Number(value).toFixed(5)) !==
                  parseFloat(Number(stopLossCoe).toFixed(5))*/
                  )
                    onChange('stopLossCoe', value || 0)
                }}
                decimalsLimit={5}
                onFocus={() => onFocus('stopLossCoe')}
                onBlur={() => onBlur('stopLossCoe')}
                disabled={!checkedStopLoss}
                autoComplete="off"
              />
            </div>
            <div className="center">{t`Price`}</div>
            <div>
              <CurrencyInput
                className={`currency-input ${
                  checkedProfit
                    ? ''
                    : activeWallet.isMargin
                    ? 'hidden-input'
                    : 'disable-input'
                } ${changingField === 'profitCoe' ? 'field-active' : ''}`}
                style={
                  Number(profitPips) <= 0
                    ? { borderColor: colors.tradebox.lowActive }
                    : {}
                }
                name="take-profit-coe"
                value={
                  typeof profitCoe === 'string'
                    ? profitCoe
                    : parseFloat(Number(profitCoe).toFixed(5))
                }
                onValueChange={(value: any) => {
                  setEdittedFieldTP('profitCoe')
                  if (
                    value === undefined ||
                    value[value.length - 1] === '.' ||
                    profitCoe[profitCoe.length - 1] === '.' ||
                    value[value.length - 1] !== '.' /*&&
                      parseFloat(Number(value).toFixed(5)) !==
                  parseFloat(Number(profitCoe).toFixed(5))*/
                  )
                    onChange('profitCoe', value || 0)
                }}
                decimalsLimit={5}
                onFocus={() => onFocus('profitCoe')}
                onBlur={() => onBlur('profitCoe')}
                disabled={!checkedProfit}
                autoComplete="off"
              />
            </div>
          </div>
        )}
        {!(!checkedStopLoss && !checkedProfit && activeWallet.isMargin) && (
          <div className="sltp-row">
            <div>
              <CurrencyInput
                className={`currency-input disable-input ${
                  checkedStopLoss
                    ? ''
                    : activeWallet.isMargin
                    ? 'hidden-input'
                    : ''
                } ${changingField === 'stopLossAmount' ? 'field-active' : ''}`}
                name="stop-loss-amount"
                value={parseFloat(stopLoss.toFixed(2))}
                allowNegativeValue={false}
                disabled
              />
            </div>
            <div className="center">{currencySymbol}</div>
            <div>
              <CurrencyInput
                className={`currency-input disable-input ${
                  checkedProfit
                    ? ''
                    : activeWallet.isMargin
                    ? 'hidden-input'
                    : ''
                } ${changingField === 'profitAmount' ? 'field-active' : ''}`}
                name="take-profit-amount"
                value={parseFloat(profit.toFixed(2))}
                allowNegativeValue={false}
                decimalsLimit={5}
                disabled
              />
            </div>
          </div>
        )}
      </TradeboxSLTP>
      <div>
        <div
          style={{
            color: btnColor.text,
            border: btnColor.border,
            opacity: btnColor.opacity,
          }}
          className="tradebox-trade-button"
          onClick={() => {
            if (
              selectedDirection !== TradeDirection.none &&
              stake !== 0 &&
              stopLossPips > 0 &&
              profitPips > 0
            ) {
              if (isLoggedIn) {
                actionSubmitTrade({})
              } else {
                actionShowModal(ModalTypes.SESSION_EXPIRED)
              }
            }
          }}
        >
          <span style={{ textTransform: 'uppercase' }}>
            {selectedDirection === TradeDirection.up
              ? t`Confirm Buy`
              : selectedDirection === TradeDirection.down
              ? t`Confirm Sell`
              : t`Confirm`}
          </span>
          <span></span>
          <span></span>
        </div>
      </div>
      {(selectedDirection !== 0 || isMobile) && (
        <div>
          <TradeBoxSummary isMobile={isMobile}></TradeBoxSummary>
        </div>
      )}
      {isMobile && showConfirmSubmitModal && (
        <ModalConfirmSubmit
          actionCloseModal={() => {
            actionSetCurrentDirection(TradeDirection.none)
            setShowConfirmSubmitModal(false)
          }}
          actionSubmit={async () => {
            await actionSubmitTrade({})
            actionSetCurrentDirection(TradeDirection.none)
            setShowConfirmSubmitModal(false)
          }}
        />
      )}
    </Panel>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  selectedDirection: state.trading.selectedDirection,
  currentInstrument: getInstrumentObject(state),
  quote: lastQuoteRiskForSelectedInstrument(state as never),
  tradeIfReachPending: state.trading.tradeIfReachPending,
  stopLoss: state.trading.stopLoss,
  checkedStopLoss: state.trading.checkedStopLoss,
  profit: state.trading.profit,
  checkedProfit: state.trading.checkedProfit,
  stake: state.trading.stake,
  currencySymbol: getWalletCurrencySymbol(state),
  stopLossCoe: state.trading.stopLossCoe,
  profitCoe: state.trading.profitCoe,
  isLoggedIn: isLoggedIn(state),
  stopLossPips: state.trading.stopLossPips,
  profitPips: state.trading.profitPips,
  lotValue: state.trading.lotValue,
  quotesProfit: lastQuotesRiskForConversionChainProfitInstruments(state),
  conversionChainProfit: state.trading.conversionChainProfit,
  activeWallet: state.wallets.activeWallet,
  chartHistory: state.trading.chartHistory,
  pendingOrder: state.trading.pendingOrder,
})

export default connect(mapStateToProps, {
  actionSubmitTrade,
  actionSetPendingOrder,
  actionSetTradeIfReachPendingOrder,
  actionSetStopLoss,
  actionSetCheckedStopLoss,
  actionSetProfit,
  actionSetCheckedProfit,
  actionSetCurrentDirection,
  actionSetProfitPercent,
  actionSetStopLossPercent,
  actionSetStopLossPips,
  actionSetProfitPips,
  actionShowModal,
  actionSetProfitCoe,
  actionSetStopLossCoe,
})(TradeBoxFX)
