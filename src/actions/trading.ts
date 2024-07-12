import { action } from 'typesafe-actions'
import { IConversionChain, IInstrument } from '../core/API'
import { IEditTrade } from '../models/trade'
import { LayoutType } from '../charting_library_pro/charting_library/charting_library'

const entity = 'trading'

const TRADING_INITIALIZE = `${entity}/INITIALIZE`
const FORCE_UPDATE = `${entity}/FORCE_UPDATE`
const SET_INSTRUMENTS = `${entity}/SET_INSTRUMENTS`
const SELECT_INSTRUMENT = `${entity}/SELECT`
const UPDATE_INSTRUMENT = `${entity}/UPDATE_INSTRUMENT`
const SUBMIT_TRADE_REQUEST = `${entity}/SUBMIT_TRADE`
const SUBMIT_TRADE_SUCCESS = `${entity}/SUBMIT_SUCCESS`
const SUBMIT_TRADE_FAILURE = `${entity}/SUBMIT_FAILURE`
const SET_IN_TRADING_HOURS = `${entity}/TRADING_HOURS`
const SELECT_BONUS_WALLET = `${entity}/SELECT_BONUS_WALLET`
const SELECT_BONUS_WALLET_REMOTE = `${entity}/SELECT_BONUS_WALLET_REMOTE`
const SET_TRADING_TIMEOUT = `${entity}/SET_TRADING_TIMEOUT`
const SET_CURRENT_PAYOUT = `${entity}/SET_CURRENT_PAYOUT`
const SET_DIRECTION = `${entity}/SET_DIRECTION`
const HOVER_DIRECTION = `${entity}/HOVER_DIRECTION`
const TIMED_CANCEL_TRADE = `${entity}/TIMED_CANCEL_TRADE`
const GAME_ENTERED_DEAD_PERIOD = `${entity}/GAME_ENTERED_DEAD_PERIOD`
const LOCK_ADD = `${entity}/LOCK_ADD`
const LOCK_RELEASE = `${entity}/LOCK_RELEASE`
const SET_CURRENT_LEVERAGE = `${entity}/SET_CURRENT_LEVERAGE`
const SET_CURRENT_INVESTMENT = `${entity}/SET_CURRENT_INVESTMENT`
const SET_CURRENT_DIRECTION = `${entity}/SET_CURRENT_DIRECTION`
const SET_TRADING_ERROR = `${entity}/SET_TRADING_ERROR`
const RESET_TRADING_ERROR = `${entity}/RESET_TRADING_ERROR`
const SET_PENDING_ORDER = `${entity}/SET_PENDING_ORDER`
const SET_TRADE_IF_REACH_PENDING = `${entity}/SET_TRADE_IF_REACH_PENDING`
const SET_STOP_LOSS = `${entity}/SET_STOP_LOSS`
const SET_CHECKED_STOP_LOSS = `${entity}/SET_CHECKED_STOP_LOSS`
const SET_PROFIT = `${entity}/SET_PROFIT`
const SET_CHECKED_PROFIT = `${entity}/SET_CHECKED_PROFIT`
const EDIT_TRADE_REQUEST = `${entity}/EDIT_TRADE_REQUEST`
const SET_PROFIT_PERCENT = `${entity}/SET_PROFIT_PERCENT`
const SET_STOP_LOSS_PERCENT = `${entity}/SET_STOP_LOSS_PERCENT`
const SET_STOP_LOSS_COE = `${entity}/SET_STOP_LOSS_COE`
const SET_PROFIT_COE = `${entity}/SET_PROFIT_COE`
const SET_LOT_VALUE = `${entity}/SET_LOT_VALUE`
const SET_PROFIT_PIPS = `${entity}/SET_PROFIT_PIPS`
const SET_STOP_LOSS_PIPS = `${entity}/SET_STOP_LOSS_PIPS`
const SET_DEFAULT_LAYOUT = `${entity}/SET_DEFAULT_LAYOUT`
const SET_CHARTS_COUNT = `${entity}/SET_CHARTS_COUNT`
const SET_ACTIVE_CHART_INDEX = `${entity}/SET_ACTIVE_CHART_INDEX`
const SET_CONVERSION_CHAIN = `${entity}/SET_CONVERSION_CHAIN`
const SET_MARGIN = `${entity}/SET_MARGIN`
const SET_CHART_INSTRUMENTS = `${entity}/SET_CHART_INSTRUMENTS`
const SET_CONVERSION_CHAIN_PROFIT = `${entity}/SET_CONVERSION_CHAIN_PROFIT`
const SET_TRADING_PANEL_TYPE = `${entity}/SET_TRADING_PANEL_TYPE`
const SET_CHECKED_LOTS = `${entity}/SET_CHECKED_LOTS`
const SET_LOTS = `${entity}/SET_LOTS`
const SET_DEFAULT_VIEW = `${entity}/SET_DEFAULT_VIEW`
const SET_CHART_HISTORY = `${entity}/SET_CHART_HISTORY`

const actionInitializeInstruments = () => action(TRADING_INITIALIZE)
const actionForceUpdateInstruments = (time: number) =>
  action(FORCE_UPDATE, time)
const actionSetInstruments = (instruments: IInstrument[]) =>
  action(SET_INSTRUMENTS, instruments)
const actionSelectBonusWallet = (bonusWallet: any) =>
  action(SELECT_BONUS_WALLET, bonusWallet)
const actionSelectBonusWalletRemote = (bonusWallet: any) =>
  action(SELECT_BONUS_WALLET_REMOTE, bonusWallet)
const actionSelectInstrument = (id: number) => action(SELECT_INSTRUMENT, id)
const actionUpdateInstrument = (instrument: any) =>
  action(UPDATE_INSTRUMENT, instrument)
const actionSubmitTrade = (attributes: any) =>
  action(SUBMIT_TRADE_REQUEST, attributes)
const actionEditTrade = (trade: IEditTrade) => action(EDIT_TRADE_REQUEST, trade)
const actionSetTradeable = (inTradingHours: boolean) =>
  action(SET_IN_TRADING_HOURS, inTradingHours)
const actionSetTradingTimeout = (timeout: number) =>
  action(SET_TRADING_TIMEOUT, timeout)
const actionSetCurrentPayout = (payout: number) =>
  action(SET_CURRENT_PAYOUT, payout)
const actionSetDirection = (direction: number) =>
  action(SET_DIRECTION, direction)
const actionHoverDirection = (direction: number | null) =>
  action(HOVER_DIRECTION, direction)
const actionTimedCancelTrade = (tradeID: number) =>
  action(TIMED_CANCEL_TRADE, tradeID)
const actionGameEnteredDeadPeriod = (flag: boolean) =>
  action(GAME_ENTERED_DEAD_PERIOD, flag)
const actionLockAdd = (id: string | number) => action(LOCK_ADD, id)
const actionLockRelease = (id: string | number) => action(LOCK_RELEASE, id)
const actionSetCurrentLeverage = (lever: number) =>
  action(SET_CURRENT_LEVERAGE, lever)
const actionSetCurrentInvestment = (investment: number) =>
  action(SET_CURRENT_INVESTMENT, investment)
const actionSetCurrentDirection = (value: number | null) =>
  action(SET_CURRENT_DIRECTION, value)
const actionResetTradingError = () => action(RESET_TRADING_ERROR)
const actionSetTradingError = (field: string, message: string) =>
  action(SET_TRADING_ERROR, { field, message })
const actionSetPendingOrder = (value: number) =>
  action(SET_PENDING_ORDER, value)
const actionSetTradeIfReachPendingOrder = (tradeIfReachPending: boolean) =>
  action(SET_TRADE_IF_REACH_PENDING, tradeIfReachPending)
const actionSetStopLoss = (value: number) => action(SET_STOP_LOSS, value)
const actionSetCheckedStopLoss = () => action(SET_CHECKED_STOP_LOSS)
const actionSetProfit = (value: number) => action(SET_PROFIT, value)
const actionSetCheckedLots = () => action(SET_CHECKED_LOTS)
const actionSetLotValue = (value: any) => action(SET_LOT_VALUE, value)
const actionSetCheckedProfit = () => action(SET_CHECKED_PROFIT)
const actionSetProfitPercent = (value: number) =>
  action(SET_PROFIT_PERCENT, value)
const actionSetStopLossPercent = (value: number) =>
  action(SET_STOP_LOSS_PERCENT, value)
const actionSetStopLossCoe = (value: number) => action(SET_STOP_LOSS_COE, value)
const actionSetProfitCoe = (value: number) => action(SET_PROFIT_COE, value)
const actionSetProfitPips = (value: number) => action(SET_PROFIT_PIPS, value)
const actionSetStopLossPips = (value: number) =>
  action(SET_STOP_LOSS_PIPS, value)
const actionSetDefaultLayout = (value: LayoutType) =>
  action(SET_DEFAULT_LAYOUT, value)
const actionSetChartsCount = (value: number) => action(SET_CHARTS_COUNT, value)
const actionSetChartInstruments = (value: IInstrument[]) =>
  action(SET_CHART_INSTRUMENTS, value)
const actionSetActiveChartIndex = (value: number) =>
  action(SET_ACTIVE_CHART_INDEX, value)
const actionSetConversionChain = (value: IConversionChain) =>
  action(SET_CONVERSION_CHAIN, value)
const actionSetConversionChainProfit = (value: IConversionChain) =>
  action(SET_CONVERSION_CHAIN_PROFIT, value)
const actionSetMargin = (value: number) => action(SET_MARGIN, value)
const actionSetTradingPanelType = (value: number) =>
  action(SET_TRADING_PANEL_TYPE, value)
const actionSetLots = (value: number) => action(SET_LOTS, value)
const actionSetDefaultView = (value: number) => action(SET_DEFAULT_VIEW, value)
const actionSetChartHistory = (chartHistory: any) =>
  action(SET_CHART_HISTORY, chartHistory)

export {
  TRADING_INITIALIZE,
  FORCE_UPDATE,
  SET_INSTRUMENTS,
  SET_DIRECTION,
  HOVER_DIRECTION,
  SELECT_INSTRUMENT,
  UPDATE_INSTRUMENT,
  SUBMIT_TRADE_REQUEST,
  SUBMIT_TRADE_SUCCESS,
  SUBMIT_TRADE_FAILURE,
  SET_IN_TRADING_HOURS,
  SELECT_BONUS_WALLET,
  SELECT_BONUS_WALLET_REMOTE,
  SET_TRADING_TIMEOUT,
  SET_CURRENT_PAYOUT,
  TIMED_CANCEL_TRADE,
  GAME_ENTERED_DEAD_PERIOD,
  LOCK_ADD,
  LOCK_RELEASE,
  SET_CURRENT_LEVERAGE,
  SET_CURRENT_INVESTMENT,
  SET_CURRENT_DIRECTION,
  SET_TRADING_ERROR,
  RESET_TRADING_ERROR,
  SET_PENDING_ORDER,
  SET_TRADE_IF_REACH_PENDING,
  SET_STOP_LOSS,
  SET_CHECKED_STOP_LOSS,
  SET_PROFIT,
  SET_CHECKED_PROFIT,
  SET_CHECKED_LOTS,
  EDIT_TRADE_REQUEST,
  SET_PROFIT_PERCENT,
  SET_STOP_LOSS_PERCENT,
  SET_STOP_LOSS_COE,
  SET_PROFIT_COE,
  SET_LOT_VALUE,
  SET_STOP_LOSS_PIPS,
  SET_PROFIT_PIPS,
  SET_DEFAULT_LAYOUT,
  SET_CHARTS_COUNT,
  SET_ACTIVE_CHART_INDEX,
  SET_CONVERSION_CHAIN,
  SET_MARGIN,
  SET_CHART_INSTRUMENTS,
  SET_CONVERSION_CHAIN_PROFIT,
  SET_TRADING_PANEL_TYPE,
  SET_LOTS,
  SET_DEFAULT_VIEW,
  SET_CHART_HISTORY,
  actionTimedCancelTrade,
  actionInitializeInstruments,
  actionSetTradeable,
  actionForceUpdateInstruments,
  actionSetInstruments,
  actionSelectBonusWallet,
  actionSelectBonusWalletRemote,
  actionSelectInstrument,
  actionUpdateInstrument,
  actionSubmitTrade,
  actionSetTradingTimeout,
  actionSetCurrentPayout,
  actionSetDirection,
  actionHoverDirection,
  actionGameEnteredDeadPeriod,
  actionLockAdd,
  actionLockRelease,
  actionSetCurrentLeverage,
  actionSetCurrentInvestment,
  actionSetCurrentDirection,
  actionSetTradingError,
  actionResetTradingError,
  actionSetPendingOrder,
  actionSetTradeIfReachPendingOrder,
  actionSetStopLoss,
  actionSetCheckedStopLoss,
  actionSetProfit,
  actionSetCheckedProfit,
  actionEditTrade,
  actionSetStopLossPercent,
  actionSetProfitPercent,
  actionSetStopLossCoe,
  actionSetProfitCoe,
  actionSetLotValue,
  actionSetStopLossPips,
  actionSetProfitPips,
  actionSetDefaultLayout,
  actionSetChartsCount,
  actionSetActiveChartIndex,
  actionSetConversionChain,
  actionSetMargin,
  actionSetChartInstruments,
  actionSetConversionChainProfit,
  actionSetTradingPanelType,
  actionSetCheckedLots,
  actionSetLots,
  actionSetDefaultView,
  actionSetChartHistory,
}
