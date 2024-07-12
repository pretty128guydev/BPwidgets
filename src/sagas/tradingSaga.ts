// @ts-nocheck 7057
/**
 * Handle trading side effects
 */
import {
  all,
  call,
  delay,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import { actionAddMessage } from '../actions/messages'
import { REFRESH_WALLETS } from '../actions/wallets'
import {
  DOUBLE_UP_REQUESTED,
  HEDGE_REQUESTED,
  SELL_BACK_DO,
  SELL_BACK_REQUESTED,
} from '../actions/trades'
import {
  actionGameEnteredDeadPeriod,
  actionLockAdd,
  actionLockRelease,
  actionSetCurrentPayout,
  actionSetTradingTimeout,
  SELECT_INSTRUMENT,
  SET_TRADING_TIMEOUT,
  SUBMIT_TRADE_FAILURE,
  SUBMIT_TRADE_REQUEST,
  TIMED_CANCEL_TRADE,
  EDIT_TRADE_REQUEST,
  actionSetConversionChain,
  actionSetConversionChainProfit,
  actionSetCurrentLeverage,
} from '../actions/trading'
import { api } from '../core/createAPI'
import { getCurrentPayout } from '../core/currentPayout'
import { actionCloseModal, actionShowModal, ModalTypes } from '../actions/modal'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../components/selectors/instruments'
import {
  getIsMobile,
  onFetchTrades,
  onFetchWalletDetails,
} from './registrySaga'
import { IGame } from '../reducers/games'
import { t } from 'ttag'
import { actionSetBottomTab } from '../actions/sidebar'
import { IOpenTrade } from '../core/interfaces/trades'
import {
  actionSelectGame,
  SELECT_GAME,
  SELECT_NEXT_GAME,
} from '../actions/game'
import { getPositionsForExpiry } from '../components/selectors/positions'
import { actionDeselectExpiry, actionSelectExpiry } from '../actions/expiry'
import {
  actionShowNotification,
  NotificationTypes,
} from '../actions/notifications'
import {
  ITradeNotificationErrorProps,
  ITradeNotificationSuccessProps,
} from '../components/notifications/TradeSubmit/interfaces'

/**
 * Pick first game when default condition is not met
 * @param games
 */
const gamesFallback = (games: any) => Object.values(games).flat()[0]

/**
 * Select available game, prioritize first or return null
 * @param games
 */
export const pickGame = (games: any, defaultGameType: number) => {
  const game = games[defaultGameType]?.[0]
  return game ? game : gamesFallback(games)
}

/**
 * Handle side-effect for LS Feed
 * @param action
 */
// eslint-disable-next-line require-yield
export function* onInstrumentSelect(action: any) {
  const id = action.payload
  const state = yield select((state) => state)
  const { walletID = 0 } = state.wallets.activeWallet
  const { instruments } = state.trading
  const instrument = instruments.find((i) => i.instrumentID === id)

  if (instrument) {
    yield put(
      actionSetCurrentLeverage(instrument.tradingConfig.defaultLeverage)
    )
    const respChain = yield call(api.getConversionChain, id, walletID)
    if (respChain?.needsConversion) {
      yield put(actionSetConversionChain(respChain))
    } else {
      yield put(
        actionSetConversionChain({
          needsConversion: false,
          operations: [],
        })
      )
    }
    const respChainProfit = yield call(
      api.getConversionChainProfit,
      id,
      walletID
    )
    if (respChainProfit?.needsConversion) {
      yield put(actionSetConversionChainProfit(respChainProfit))
    } else {
      yield put(
        actionSetConversionChainProfit({
          needsConversion: false,
          operations: [],
        })
      )
    }
  }
}

function* onSubmitTrade(action) {
  try {
    const state = yield select((state) => state)
    const { walletID, isMargin, challengeID } = state.wallets.activeWallet
    const {
      currentInstrument,
      stake,
      selectedDirection,
      stopLoss,
      currentLeverage,
      profit,
      pendingOrder,
      tradeIfReachPending,
      profitCoe,
      stopLossCoe,
      lotValue,
      checkedStopLoss,
      checkedProfit,
    } = state.trading

    const direction = selectedDirection || action.payload?.direction
    const quote = yield select((state) =>
      lastQuoteRiskForSelectedInstrument(state)
    )
    const { ask, bid } = quote
    const referencePrice = direction === 1 ? ask : bid
    const takeProfit = (profit / stake) * 100

    const challengeDashboardState = state.wallets.challengeDashboard.state

    const trade = {
      walletID: walletID,
      instrumentID: currentInstrument.instrumentID,
      stake,
      optionType: 20,
      direction,
      referencePrice,
      stopLossPrice: stopLossCoe,
      stopLoss,
      takeProfit,
      takeProfitPrice: profitCoe,
      leverage:
        challengeID &&
        challengeDashboardState.leverageCap &&
        Number(challengeDashboardState.leverageCap) < currentLeverage
          ? Number(challengeDashboardState.leverageCap)
          : currentLeverage,
      units: lotValue,
      appId: 'fxcfd-web',
    }

    if (!checkedStopLoss && isMargin) {
      delete trade.stopLoss
      delete trade.stopLossPrice
    }
    if (!checkedProfit && isMargin) {
      delete trade.takeProfit
      delete trade.takeProfitPrice
    }

    if (tradeIfReachPending) {
      trade.orderTriggerPrice = pendingOrder
      if (direction !== 0) {
        trade.type = 'pendingOrder'
      }
    }

    const response = yield call(api.createTrade, trade)
    if (response.success) {
      yield put(
        actionShowNotification<ITradeNotificationSuccessProps>(
          NotificationTypes.TRADE_SUBMITTED_SUCCESS,
          {
            timeout: 5000,
            allowTimedCancel: true,
            tradeID: response.tradeID,
            success: true,
          }
        )
      )
      if (!getIsMobile()) {
        yield put(actionSetBottomTab(tradeIfReachPending ? 'pending' : 'open'))
      }
      yield onRefreshAccountData()
    } else {
      yield put(
        actionShowNotification<ITradeNotificationErrorProps>(
          NotificationTypes.TRADE_SUBMITTED_ERROR,
          {
            success: false,
            message: response.message,
          }
        )
      )
    }
  } catch (err) {
    console.log(
      'Debug ~ file: tradingSaga.ts:344 ~ function*onSubmitTrade ~ err:',
      err
    )
    yield put(
      actionShowNotification<ITradeNotificationErrorProps>(
        NotificationTypes.TRADE_SUBMITTED_ERROR,
        {
          success: false,
          message: 'Error',
        }
      )
    )
    yield put({ type: SUBMIT_TRADE_FAILURE })
  }
}

/**
 * Timed cancel
 * @param trade
 */
function* onEditTrade(action) {
  try {
    const res = yield call(api.editTrade, action.payload)
    if (res?.success) {
      const type = action.payload.stopLoss
        ? NotificationTypes.TRADE_EDIT_STOP_LOSS_SUCCESS
        : NotificationTypes.TRADE_EDIT_TAKE_PROFIT_SUCCESS
      yield put(
        actionShowNotification<ITradeNotificationSuccessProps>(type, {
          message: t`Edit trade successfull`,
        })
      )
      yield onFetchTrades()
    } else {
      const type = action.payload.stopLoss
        ? NotificationTypes.TRADE_EDIT_STOP_LOSS_ERROR
        : NotificationTypes.TRADE_EDIT_TAKE_PROFIT_ERROR
      yield put(
        actionShowNotification<ITradeNotificationSuccessProps>(type, {
          message: res?.message || t`Edit trade fail`,
        })
      )
    }
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Timed cancel
 * @param action
 */
function* onTimedCancelTrade(action: any) {
  try {
    const response = yield call(api.cancelTimedTrade, action.payload)
    yield put(actionCloseModal())
    if (response.success) {
      yield put(actionAddMessage(t`Cancelled Successfully`))
      yield onRefreshAccountData() // refresh open positions, closed positions tab
    } else {
      yield put(actionAddMessage(response.message.body))
    }
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Find a trade reference
 * Ask server how much money we can refund, display a window with yes/no
 * @param action
 */
function* onSellBack(action: any) {
  const { tradeID, x, y } = action.payload
  const openTrades = yield select((state) => state.trades.open)
  const trade = openTrades.find(
    (target: IOpenTrade) => target.tradeID === tradeID
  )
  yield put(actionLockAdd(tradeID))
  const resp = yield call(api.getSellbackAmount, tradeID)
  if (resp) {
    const { success, amount } = resp
    if (success) {
      yield put(actionLockRelease(tradeID))
      yield put(
        actionShowModal(ModalTypes.SELLBACK, {
          x,
          y,
          amount,
          trade,
          timeleft: 5,
        })
      )
    } else {
      yield put(actionLockRelease(tradeID))
      yield put(
        actionShowNotification<ITradeNotificationErrorProps>(
          NotificationTypes.TRADE_SUBMITTED_ERROR,
          {
            success: false,
            message: resp.message,
          }
        )
      )
    }
  } else {
    yield put(actionLockRelease(tradeID))
    yield put(actionAddMessage('Could not get response from server'))
  }
}

/**
 * Do a sellback: close modal, call server, refresh status on success
 * @param action
 */
function* onDoSellback(action: any) {
  yield put(actionCloseModal()) // side effect to close modal

  const { trade, amount } = action.payload
  yield put(actionLockAdd(trade.tradeID))
  const resp = yield call(api.sellback, trade.tradeID, amount, trade.stake)
  if (resp) {
    const { success } = resp
    if (success) {
      yield put(actionLockRelease(trade.tradeID))
      yield onRefreshAccountData()
    } else {
      yield put(actionLockRelease(trade.tradeID))
      yield put(
        actionShowNotification<ITradeNotificationErrorProps>(
          NotificationTypes.TRADE_SUBMITTED_ERROR,
          {
            success: false,
            message: resp.message,
          }
        )
      )
    }
  } else {
    yield put(actionLockRelease(trade.tradeID))
    yield put(actionAddMessage('Could not get response from server'))
  }
}

/**
 * Clone the trade, change direction and send to the server
 * @param action
 */
function* onHedge(action: any) {
  const trade: IOpenTrade = action.payload
  const practice = yield select((state) =>
    state.account.userInfo?.practiceMode ? 1 : 0
  )
  const userCurrency = yield select((state) =>
    state.wallets ? state.wallets.userCurrency : 1
  )
  const newTrade = {
    // Old platform compability
    type: trade.gameType,
    strike: trade.strike,
    userCurrency,
    practice,
    source: 'Simple-Trader',
    wow: 'true',
    // New platform data
    distance: trade.distance,
    payout: trade.payout,
    rebate: trade.rebate,
    stake: +trade.stake,
    instrumentID: trade.instrumentID,
    userCurrencyStake: +trade.stake,
    gameType: trade.gameType, // trade.gameType, // problem!
    expiry: trade.expiryTimestamp,
    opensAs: 2, // 2 for hedge, 3 for double up
    direction: trade.direction * -1,
    openAsTradeID: trade.tradeID,
  }
  yield put(actionLockAdd(trade.tradeID))
  const resp = yield call(api.createTrade, newTrade)
  if (resp.success) {
    yield onRefreshAccountData()
    yield put(actionLockRelease(trade.tradeID))
  } else {
    yield put(actionLockRelease(trade.tradeID))
    yield put(
      actionShowNotification<ITradeNotificationErrorProps>(
        NotificationTypes.TRADE_SUBMITTED_ERROR,
        {
          success: false,
          message: resp.message,
        }
      )
    )
  }
}

/**
 * Clone the trade
 * @param action
 */
function* onDoubleUp(action: any) {
  const trade: IOpenTrade = action.payload
  const practice = yield select((state) =>
    state.account.userInfo?.practiceMode ? 1 : 0
  )
  const userCurrency = yield select((state) =>
    state.wallets ? state.wallets.userCurrency : 1
  )

  const newTrade = {
    // Old platform compability
    type: trade.gameType,
    strike: trade.strike,
    userCurrency,
    practice,
    source: 'Simple-Trader',
    wow: 'true',
    // New platform data
    distance: trade.distance,
    payout: trade.payout,
    rebate: trade.rebate,
    stake: +trade.stake,
    instrumentID: trade.instrumentID,
    userCurrencyStake: +trade.stake,
    gameType: trade.gameType, // trade.gameType,
    expiry: trade.expiryTimestamp,
    opensAs: 3, // 2 for hedge, 3 for double up
    direction: trade.direction,
    openAsTradeID: trade.tradeID,
  }
  yield put(actionLockAdd(trade.tradeID))
  const resp = yield call(api.createTrade, newTrade)
  if (resp.success) {
    yield onRefreshAccountData()
    yield put(actionLockRelease(trade.tradeID))
  } else {
    yield put(actionLockRelease(trade.tradeID))
    yield put(
      actionShowNotification<ITradeNotificationErrorProps>(
        NotificationTypes.TRADE_SUBMITTED_ERROR,
        {
          success: false,
          message: resp.message,
        }
      )
    )
  }
}

/**
 * Refresh wallet, closed trades, open positions
 */
function* onRefreshAccountData() {
  yield all([yield onFetchWalletDetails(false), yield onFetchTrades()])
}

/**
 * Create a timer to reset
 * @param action
 */
function* onTradingTimeout(action: any) {
  if (action.payload > 0) {
    yield delay(action.payload * 1000)
    yield put(actionSetTradingTimeout(0))
  }
}

/**
 * Adjust payout
 * @param action
 */
function* onSelectGame(action: any) {
  const { payload, disabled } = action
  /**
   * Reset dead period on select
   */
  yield put(actionGameEnteredDeadPeriod(disabled))
  /**
   * Payout logic
   */
  if (payload) {
    /**
     * If game has trades than select expiry or unselect
     */
    const trades = yield select(getPositionsForExpiry)
    if (Array.isArray(trades)) {
      const [trade] = trades
      if (trade) {
        yield put(actionSelectExpiry(trade.expiryTimestamp))
      } else {
        yield put(actionDeselectExpiry())
      }
    } else {
      yield put(actionDeselectExpiry())
    }

    const { gameType } = payload
    const instrument = yield select(getInstrumentObject)
    /**
     * Get data from registry
     */
    const { payoutDeltas, maxClientPayouts } = yield select(
      (state) => state.registry.data
    )
    /**
     * Calculate target payout
     */
    const target = getCurrentPayout(
      gameType,
      instrument,
      payoutDeltas,
      maxClientPayouts
    )
    yield put(actionSetCurrentPayout(target))
  } else {
    yield put(actionSetCurrentPayout(0))
  }
}

const isNotInDeadPeriod = (game: IGame): boolean =>
  Number(game.timestamp) - game.deadPeriod * 1000 > Number(new Date())

/**
 * Get game type of current game, select next not disabled game of this gametype
 * @param action
 */
function* onSelectNextGame() {
  try {
    const currentGame: IGame = yield select((state) => state.game)
    const { gameType } = currentGame

    const games = yield select((state) => state.games)
    const list: any[] = Object.values(games).flat()

    const game = list.find(
      (game: IGame) => game.gameType === gameType && isNotInDeadPeriod(game)
    )

    if (game) {
      yield put(actionSelectGame(game))
    }
  } catch (err) {
    console.warn('Could not select next game', err)
  }
}

function* tradingSaga() {
  yield takeLatest(SELECT_INSTRUMENT, onInstrumentSelect)
  yield takeLatest(EDIT_TRADE_REQUEST, onEditTrade)
  yield takeLatest(SUBMIT_TRADE_REQUEST, onSubmitTrade)
  yield takeLatest(TIMED_CANCEL_TRADE, onTimedCancelTrade)
  yield takeEvery(SELL_BACK_DO, onDoSellback)
  yield takeEvery(SELL_BACK_REQUESTED, onSellBack)
  yield takeEvery(HEDGE_REQUESTED, onHedge)
  yield takeEvery(DOUBLE_UP_REQUESTED, onDoubleUp)
  yield takeLatest(REFRESH_WALLETS, onFetchWalletDetails)
  yield takeLatest(SET_TRADING_TIMEOUT, onTradingTimeout)
  yield takeLatest(SELECT_GAME, onSelectGame)
  yield takeLatest(SELECT_NEXT_GAME, onSelectNextGame)
}

export default tradingSaga
