import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import TradeBuyButton from '../TradeBuyButton'
import TradeSellButton from '../TradeSellButton'
import '../index.scss'
import { Panel } from '../styled'
import { TradeDirection } from '../../../models/instrument'
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
  actionSetStopLossCoe,
  actionSetProfitCoe,
} from '../../../actions/trading'
import TradeBoxInstrument from '../TradeBoxInstrument'
import TradeBoxSummary from '../TradeBoxSummary'
import { IInstrument, IRegistry, IWalletDetails } from '../../../core/API'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../../selectors/instruments'
import { IQuote } from '../../../reducers/quotes'
import { isNumber, toNumber } from 'lodash'
import { INotification } from '../../../actions/notifications'
import TradeSubmit from '../../notifications/TradeSubmit'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import { calculatePipValue } from '../../../shares/functions'
import ModalConfirmSubmit from '../ModalConfirmSubmit'
import { isLoggedIn } from '../../selectors/loggedIn'
import Images from '../../../assets/images'
import { getTakeProfitBoundaries, isMobileLandscape } from '../../../core/utils'
import { actionShowModal, ModalTypes } from '../../../actions/modal'
import {
  calculateStopLoss,
  calculateTakeProfit,
  calculateTakeProfitPayout,
} from '../../../sagas/tradingHelper'
import TradeBoxSwitchNonMargin from '../TradeBoxSwitchNonMargin'
import TradeBoxAmountUnits from '../TradeBoxAmountUnits'

interface ITradeBoxNonMarginProps {
  colors: any
  stopLoss: number
  selectedDirection: TradeDirection
  actionSubmitTrade: (attributes: any) => void
  wallets: IWalletDetails[]
  pendingOrder: number
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
  notifications: INotification<{ message: string }>[]
  stake: number
  activeWallet: IWalletDetails
  currencySymbol: string
  actionSetCurrentDirection: (value: number | null) => void
  actionSetProfitPercent: (value: number) => void
  actionSetStopLossPercent: (value: number) => void
  actionSetStopLossCoe: (value: number) => void
  actionSetProfitCoe: (value: number) => void
  profitPercent: number
  stopLossPercent: number
  stopLossCoe: number
  profitCoe: NumberConstructor
  leverage: number
  instruments: any
  isMobile: boolean
  isLoggedIn: boolean
  registry: IRegistry
  actionShowModal: any
  chartHistory: any
}

const TradeBoxNonMargin = (props: ITradeBoxNonMarginProps) => {
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false)
  const [showAdvancedTrade, setShowAdvancedTrade] = useState(false)
  const [stopLossType, setStopLossType] = useState('amount')
  const [profitType, setProfitType] = useState('amount')

  const {
    stake,
    selectedDirection,
    stopLoss,
    stopLossCoe,
    stopLossPercent,
    checkedStopLoss,
    leverage,
    pendingOrder: pd,
    profit,
    profitCoe,
    profitPercent,
    checkedProfit,
    quote,
    currencySymbol,
    currentInstrument,
    registry,
    isMobile,
    colors,
    tradeIfReachPending,
    isLoggedIn,
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
    actionShowModal,
    actionSetStopLossCoe,
    actionSetProfitCoe,
    activeWallet,
    chartHistory,
  } = props

  const pendingOrder = Number(pd)

  const prevQuote = useRef(quote)

  useEffect(() => {
    if (!activeWallet.isMargin && !checkedStopLoss) actionSetCheckedStopLoss()
    if (!activeWallet.isMargin && !checkedProfit) actionSetCheckedProfit()
  }, [activeWallet])

  const last =
    (quote as IQuote)?.last ||
    chartHistory?.aggs?.[chartHistory.aggs.length - 2]?.close ||
    0

  useEffect(() => {
    if (!isMobile && selectedDirection === TradeDirection.none) {
      if (tradeIfReachPending)
        actionSetPendingOrder(
          (quote as IQuote)?.last ||
            chartHistory?.aggs?.[chartHistory.aggs.length - 2]?.close ||
            0
        )

      if (selectedDirection === TradeDirection.none)
        actionSetCurrentDirection(TradeDirection.up)
    }
  }, [])

  useEffect(() => {
    if (
      Object.keys(prevQuote.current).length === 0 &&
      Object.keys(quote).length !== 0
    ) {
      prevQuote.current = quote
      if (currentInstrument.isOpen) {
        actionSetTradeIfReachPendingOrder(false)
        actionSetPendingOrder(0)
      } else {
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
      actionSetTradeIfReachPendingOrder(false)
      actionSetPendingOrder(0)
    } else {
      actionSetTradeIfReachPendingOrder(true)
      const pendingOrder =
        chartHistory?.instrumentId === currentInstrument.instrumentID
          ? (quote as IQuote)?.last ||
            chartHistory?.aggs?.[chartHistory.aggs.length - 2]?.close ||
            0
          : 0
      actionSetPendingOrder(pendingOrder)
    }
  }, [currentInstrument, , chartHistory?.instrumentId])

  const { tradingConfig, precision, pip } = currentInstrument
  const {
    partnerConfig: {
      sliderStepRules: { stepRules },
    },
  } = registry

  const currentLeverage = leverage

  const pipValue = calculatePipValue({
    stake: stake || 0,
    lastQuote: last,
    leverage: currentLeverage || 0,
    pip,
  })

  useEffect(() => {
    const { bid, ask } = quote as IQuote

    const stopLossCoe = calculateStopLoss({
      ask,
      bid,
      stake: stake,
      pendingOrder: pendingOrder,
      stopLossAmount: stopLoss,
      direction: selectedDirection,
      currentLeverage,
    })

    const profitCoe = calculateTakeProfit({
      ask,
      bid,
      stake: stake,
      pendingOrder: pendingOrder,
      takeProfitPayout: calculateTakeProfitPayout(profit, stake),
      direction: selectedDirection,
      currentLeverage,
    })

    actionSetStopLossCoe(parseFloat(Number(stopLossCoe).toFixed(5)) || 0)
    actionSetProfitCoe(parseFloat(Number(profitCoe).toFixed(5)) || 0)
  }, [
    actionSetProfitCoe,
    actionSetStopLossCoe,
    currentLeverage,
    pendingOrder,
    profit,
    quote,
    selectedDirection,
    stake,
    stopLoss,
  ])

  const onChangeValueStopLoss = (value: string | number) => {
    if (!value) value = 0
    const percent = (toNumber(value) / stake) * 100
    actionSetStopLossPercent(percent)
    actionSetStopLoss(value as number)
  }

  const onChangeValueProfit = (value: string | number) => {
    if (!value) value = 0
    const percent = (toNumber(value) / stake) * 100
    actionSetProfitPercent(percent)
    actionSetProfit(value as number)
  }

  const getColor = () => {
    if (selectedDirection === TradeDirection.up && stake !== 0) {
      return {
        text: colors?.tradebox.highActive,
        border: `2px solid ${colors?.tradebox.highActive}`,
        opacity: 1,
      }
    }
    if (selectedDirection === TradeDirection.down && stake !== 0) {
      return {
        text: colors?.tradebox.lowActive,
        border: `2px solid ${colors?.tradebox.lowActive}`,
        opacity: 1,
      }
    }
    return {
      text: colors.secondaryText,
      border: `2px solid ${colors.secondaryText}`,
      opacity: 0.3,
    }
  }

  const btnColor = getColor()

  const { minTakeProfit, maxTakeProfit } = getTakeProfitBoundaries(
    tradingConfig,
    stake
  )

  const minStopLoss = (tradingConfig.limitDelta / pip) * pipValue

  const sliderStepStopLoss =
    stepRules.find((e: any) => e.minValue < minStopLoss) ||
    stepRules[stepRules.length - 1]

  const sliderStepTakeProfit =
    stepRules.find((e: any) => e.minValue < minTakeProfit) ||
    stepRules[stepRules.length - 1]

  const stopLossValue = stopLossType === 'amount' ? stopLoss : stopLossCoe
  const stopLossSubValue = stopLossType === 'amount' ? stopLossCoe : stopLoss

  const profitValue = profitType === 'amount' ? profit : (profitCoe as any)
  const profitSubValue = profitType === 'amount' ? (profitCoe as any) : profit

  return (
    <Panel
      colors={colors}
      isMobile={isMobile}
      className={`scrollable ${
        isMobile ? 'trade-box-mobile' : 'trade-box-desktop'
      }`}
    >
      {(!isMobile || isMobileLandscape(isMobile)) && (
        <TradeBoxInstrument isMobile={isMobile}></TradeBoxInstrument>
      )}
      {!isMobile && (
        <div className="trade-buttons" style={{ marginTop: 32 }}>
          <TradeBuyButton
            isMobile={isMobile}
            onClick={() => {
              if (isMobile) {
                if (isLoggedIn) {
                  actionSetCurrentDirection(TradeDirection.up)
                  setShowConfirmSubmitModal(true)
                } else {
                  actionShowModal(ModalTypes.SESSION_EXPIRED)
                }
              } else {
                if (!(selectedDirection === TradeDirection.up)) {
                  actionSetCurrentDirection(TradeDirection.up)
                } else {
                  actionSetCurrentDirection(TradeDirection.none)
                }
              }
            }}
          ></TradeBuyButton>
          <TradeSellButton
            isMobile={isMobile}
            onClick={() => {
              if (isMobile) {
                if (isLoggedIn) {
                  actionSetCurrentDirection(TradeDirection.down)
                  setShowConfirmSubmitModal(true)
                } else {
                  actionShowModal(ModalTypes.SESSION_EXPIRED)
                }
              } else {
                if (!(selectedDirection === TradeDirection.down)) {
                  actionSetCurrentDirection(TradeDirection.down)
                } else {
                  actionSetCurrentDirection(TradeDirection.none)
                }
              }
            }}
          />
          {!isMobile && <TradeSubmit />}
        </div>
      )}
      <div
        style={{
          marginTop: isMobile ? (isMobileLandscape(isMobile) ? 14 : -10) : 20,
        }}
      >
        <TradeBoxAmountUnits
          currencySymbol={currencySymbol}
          isNonMargin={true}
          isMobile={isMobile}
        />
      </div>
      {isMobile && (
        <div
          className="advanced-header"
          onClick={() => setShowAdvancedTrade(!showAdvancedTrade)}
        >
          <span className="advanced-title">{t`Advanced`}</span>
          <span className="arrow-order">
            {showAdvancedTrade ? (
              <Images.ArrowUp width={18} height={18} stroke="#ffffff" />
            ) : (
              <Images.ArrowDown width={18} height={18} stroke="#ffffff" />
            )}
          </span>
        </div>
      )}
      <div
        style={{
          display: isMobile && !showAdvancedTrade ? 'none' : 'block',
        }}
      >
        <div
          className="switch-wraper"
          style={{
            borderTopColor: isMobile
              ? 'transparent'
              : colors.tradebox.oneClickTradeText,
          }}
        >
          <TradeBoxSwitchNonMargin
            title={
              tradeIfReachPending
                ? t`Open trade if price reaches`
                : t`Open trade if price reaches not set`
            }
            value={pendingOrder}
            percentOptions={[]}
            hideSlider
            checked={tradeIfReachPending}
            showButtonPlusMinus
            onChangeValue={actionSetPendingOrder}
            onChangeCheck={() => {
              if (currentInstrument.isOpen) {
                actionSetTradeIfReachPendingOrder(!tradeIfReachPending)
                if (!tradeIfReachPending) {
                  actionSetPendingOrder(
                    (quote as IQuote)?.last ||
                      chartHistory?.aggs?.[chartHistory.aggs.length - 2]
                        ?.close ||
                      0
                  )
                } else {
                  actionSetPendingOrder(0)
                }
              }
            }}
            showSwitch={true}
            hideChangeType={true}
            minValue={0}
            maxValue={1}
          ></TradeBoxSwitchNonMargin>
        </div>
        <div
          className="switch-wraper"
          style={{
            borderTopColor: isMobile
              ? 'transparent'
              : colors.tradebox.oneClickTradeText,
          }}
        >
          <TradeBoxSwitchNonMargin
            selectedPercent={stopLossPercent}
            percentOptions={[25, 50, 75, 100]}
            title={checkedStopLoss ? t`Stop Loss` : t`Stop Loss not set`}
            value={
              isNumber(stopLossValue) && stopLossType === 'amount'
                ? parseFloat(toNumber(stopLossValue).toFixed(2))
                : stopLossValue
            }
            subTitle={t`Estimated Stop Loss at`}
            subValue={
              isNumber(stopLossSubValue) && stopLossType === 'rate'
                ? parseFloat(toNumber(stopLossSubValue).toFixed(2))
                : stopLossSubValue
            }
            checked={checkedStopLoss}
            onChangeValue={(value) =>
              stopLossType === 'amount' ? onChangeValueStopLoss(value) : null
            }
            onChangeRange={onChangeValueStopLoss}
            onChangeCheck={() => {
              actionSetCheckedStopLoss()
              actionSetStopLossPercent(1)
            }}
            maxValue={
              stopLoss > stake * 0.995
                ? stopLoss
                : parseFloat(toNumber(stake * 0.995).toFixed(2))
            }
            minValue={parseFloat(minStopLoss.toFixed(2))}
            valueProcessBar={stopLoss}
            sliderStep={sliderStepStopLoss?.step}
            type={stopLossType}
            onChangeType={setStopLossType}
            prefixInput={stopLossType === 'amount' ? currencySymbol : ''}
            showSwitch={false}
            hideChangeType={false}
          ></TradeBoxSwitchNonMargin>
        </div>
        <div
          className="switch-wraper"
          style={{
            borderTopColor: isMobile
              ? 'transparent'
              : colors.tradebox.oneClickTradeText,
          }}
        >
          <TradeBoxSwitchNonMargin
            selectedPercent={profitPercent}
            percentOptions={tradingConfig.takeProfit}
            title={checkedProfit ? t`Take Profit` : t`Take Profit not set`}
            value={
              isNumber(profitValue) && profitType === 'amount'
                ? parseFloat(toNumber(profitValue).toFixed(2))
                : profitValue
            }
            subTitle={t`Estimated Take Profit at`}
            subValue={
              isNumber(profitSubValue) && profitType === 'rate'
                ? parseFloat(toNumber(profitSubValue).toFixed(2))
                : profitSubValue
            }
            checked={checkedProfit}
            onChangeValue={(value) =>
              profitType === 'amount' ? onChangeValueProfit(value) : null
            }
            onChangeRange={onChangeValueProfit}
            onChangeCheck={() => {
              actionSetCheckedProfit()
              actionSetProfitPercent(tradingConfig.defaultTakeProfit / 100)
            }}
            maxValue={parseFloat(maxTakeProfit.toFixed(2))}
            minValue={parseFloat(minTakeProfit.toFixed(2))}
            valueProcessBar={profit}
            sliderStep={sliderStepTakeProfit?.step}
            type={profitType}
            onChangeType={setProfitType}
            prefixInput={profitType === 'amount' ? currencySymbol : ''}
            showSwitch={false}
            hideChangeType={false}
          ></TradeBoxSwitchNonMargin>
        </div>
      </div>
      {isMobile && (
        <div className="trade-buttons">
          <TradeBuyButton
            isMobile={isMobile}
            onClick={() => {
              if (isMobile) {
                if (isLoggedIn) {
                  actionSetCurrentDirection(TradeDirection.up)
                  setShowConfirmSubmitModal(true)
                } else {
                  actionShowModal(ModalTypes.SESSION_EXPIRED)
                }
              } else {
                if (!(selectedDirection === TradeDirection.up)) {
                  actionSetCurrentDirection(TradeDirection.up)
                } else {
                  actionSetCurrentDirection(TradeDirection.none)
                }
              }
            }}
          ></TradeBuyButton>
          <TradeSellButton
            isMobile={isMobile}
            onClick={() => {
              if (isMobile) {
                if (isLoggedIn) {
                  actionSetCurrentDirection(TradeDirection.down)
                  setShowConfirmSubmitModal(true)
                } else {
                  actionShowModal(ModalTypes.SESSION_EXPIRED)
                }
              } else {
                if (!(selectedDirection === TradeDirection.down)) {
                  actionSetCurrentDirection(TradeDirection.down)
                } else {
                  actionSetCurrentDirection(TradeDirection.none)
                }
              }
            }}
          />
          {!isMobile && <TradeSubmit />}
        </div>
      )}
      {!isMobile && (
        <div>
          <div
            style={{
              color: btnColor.text,
              border: btnColor.border,
              opacity: btnColor.opacity,
            }}
            className="tradebox-trade-button"
            onClick={() => {
              if (selectedDirection !== TradeDirection.none && stake !== 0) {
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
      )}
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
  wallets: state.wallets.wallets,
  pendingOrder: state.trading.pendingOrder,
  currentInstrument: getInstrumentObject(state),
  quote: lastQuoteRiskForSelectedInstrument(state as never),
  tradeIfReachPending: state.trading.tradeIfReachPending,
  stopLoss: state.trading.stopLoss,
  checkedStopLoss: state.trading.checkedStopLoss,
  profit: state.trading.profit,
  checkedProfit: state.trading.checkedProfit,
  notifications: state.notifications.notifications,
  stake: state.trading.stake,
  activeWallet: state.wallets.activeWallet,
  currencySymbol: getWalletCurrencySymbol(state),
  profitPercent: state.trading.profitPercent,
  stopLossPercent: state.trading.stopLossPercent,
  stopLossCoe: state.trading.stopLossCoe,
  profitCoe: state.trading.profitCoe,
  leverage: state.trading.currentLeverage,
  instruments: state.instruments,
  isLoggedIn: isLoggedIn(state),
  registry: state.registry.data,
  chartHistory: state.trading.chartHistory,
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
  actionShowModal,
  actionSetStopLossCoe,
  actionSetProfitCoe,
})(TradeBoxNonMargin)
