// @ts-nocheck 7057
/**
 * Handle get registry and side effects like themes
 */
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { actionSetInstrumentsAdvanced } from '../actions/instruments'
import { actionCloseModal, actionShowModal, ModalTypes } from '../actions/modal'
import {
  actionSetGlobalLoader,
  actionSetInstrumentsHistory,
  actionSetThemeReady,
  actionUpdateRegistry,
  CONNECT,
} from '../actions/registry'
import {
  actionSetLoggedIn,
  actionStartPing,
  actionUpdateFavorites,
} from '../actions/account'
import { actionStartTimer } from '../actions/time'
import {
  actionAddMoreTrades,
  actionSetClosedTrades,
  actionSetOpenTrades,
  actionSetPendingTrades,
  LOAD_MORE_TRADES_REQUEST,
  REFETCH_TRADES,
} from '../actions/trades'
import {
  actionSelectInstrument,
  actionSetDefaultLayout,
  actionSetDefaultView,
  actionSetInstruments,
  actionSetTradingPanelType,
  FORCE_UPDATE,
} from '../actions/trading'
import { actionSetWallets } from '../actions/wallets'
import { api } from '../core/createAPI'
import LSFeed from '../core/feed'
import { actionAddMessage } from '../actions/messages'
import { actionSetFXTheme, actionSetTheme } from '../actions/theme'
import { onFetchUserInfo } from './accountSaga'
import { defaultTopAssets } from '../components/selectors/instruments'
import { FakeData } from '../shares/fakeData'
import UserStorage from '../core/UserStorage'
import { convertFxThemeToColors } from '../shares/colorConvert'
import {
  actionSetCollapsedSideMenu,
  actionSetShowChallenge,
  actionSetShowSideMenu,
  actionSetShowTopMenu,
  actionSetSideMenuItems,
  actionSetTopMenuItems,
} from '../actions/container'
import { isArray, uniq } from 'lodash'

/**
 * Should be changed for native platforms
 */
export const getIsMobile = (): boolean => window.innerWidth < 978

/**
 * Check if theme defined in URL or xprops
 */
const getTheme = (): string | null =>
  getQueryParam('themeSet') ||
  ((window as any).xprops ? (window as any).xprops.themeSet : null)

const getQueryParam = (q: string) =>
  // eslint-disable-next-line
  (window.location.search.match(new RegExp('[?&]' + q + '=([^&]+)')) || [
    ,
    null,
  ])[1]

/**
 * Initial call
 * Call API for registry and setup feed
 */
function* fetchRegistry(): any {
  try {
    /**
     * Theme support
     */
    const themeName = getTheme()
    if (themeName) {
      const theme = yield call(api.getTheme, themeName)
      yield put(actionSetFXTheme(theme))
      yield put(actionSetTheme(convertFxThemeToColors(theme)))
    }
    /**
     * Default flow
     */
    const data = yield call(api.getRegistry)
    if (data) {
      yield put(
        actionSetTradingPanelType(Number(data.partnerConfig.tradingPanelType))
      )
      const { defaultView } = yield call(
        api.getDefaultTradeBlockView,
        data.siteId
      )
      yield put(actionSetDefaultView(defaultView))
      yield put(actionUpdateRegistry(data))
      yield put(actionSetLoggedIn(data.isLoggedIn))
      yield put(actionStartTimer())
      yield put(actionSetShowSideMenu(data.partnerConfig.platformLeftMenuShow))
      yield put(actionSetSideMenuItems(data.partnerConfig.platformLeftMenu))
      yield put(actionSetShowTopMenu(data.partnerConfig.platformTopMenuShow))
      yield put(actionSetTopMenuItems(data.partnerConfig.platformTopMenu))
      /**
       * Update theme from registry, otherwise fallback from file will be used
       */
      if (!themeName) {
        if (
          typeof (
            data.partnerConfig[data.partnerConfig.defaultTheme] ||
            data.partnerConfig.themePrimary ||
            data.partnerConfig.theme
          ) === 'object'
        ) {
          yield put(
            actionSetFXTheme(
              data.partnerConfig[data.partnerConfig.defaultTheme] ||
                data.partnerConfig.themePrimary ||
                data.partnerConfig.theme
            )
          )
          yield put(
            actionSetTheme(
              convertFxThemeToColors(
                data.partnerConfig[data.partnerConfig.defaultTheme] ||
                  data.partnerConfig.themePrimary ||
                  data.partnerConfig.theme
              )
            )
          )
        } else {
          console.log(
            'Theme configuration is not valid, fallback to default theme'
          )
          yield put(actionSetTheme(FakeData.theme))
        }
      }

      yield put(actionSetThemeReady()) // will show global loader

      LSFeed.initialize(data)
      /**
       * Run advanced and account data in parallel
       */
      yield put(actionSetCollapsedSideMenu(!data.isLoggedIn))
      yield fetchAccountData(data.isLoggedIn)
      yield fetchAdvanced(true)
      const defaultLayout = UserStorage.getDefaultLayout()
      if (defaultLayout) {
        yield put(actionSetDefaultLayout(defaultLayout))
      }
      yield put(actionSetGlobalLoader(false))
    } else {
      console.warn('Could not fetch registry')
    }
  } catch (err) {
    console.warn('Could not fetch registry: ', err)
  }
}

/**
 * Registry contains different coefficents
 * Refetch registry on sign-in/sign-up
 * @param params
 */
export function* refetchRegistry() {
  const data = yield call(api.getRegistry)
  if (data) {
    yield put(actionUpdateRegistry(data))
  } else {
    console.warn('Could not refetch registry')
  }
}

/**
 * Fetch advanced data for instruments
 */
function* fetchAdvanced(selectFirst?: boolean) {
  try {
    const data = yield call(api.fetchInstruments)
    const instruments = data.instruments.filter(
      ({ instrumentID, name }) => !!instrumentID && !!name
    )
    yield put(actionSetInstrumentsAdvanced(instruments))
    yield put(actionSetInstruments(instruments))
    LSFeed.getInstance().subscribeInstruments(instruments)
    if (selectFirst) {
      const defaultTopAsset = yield select((state) => defaultTopAssets(state))
      if (isArray(defaultTopAsset) && defaultTopAsset.length > 0) {
        yield put(actionSelectInstrument(defaultTopAsset[0].instrumentID))
      } else {
        yield put(actionSelectInstrument(instruments[0].instrumentID))
      }
    }
  } catch (err) {
    console.warn(err)
  }
}

export function* onFetchWalletDetails(isResetActiveWallet?: boolean) {
  let wallets = yield call(api.fetchWalletDetails)
  wallets = wallets.reverse()
  const walletsFilter = wallets.filter(
    (wallet) =>
      !wallet.challengeID ||
      (wallet.challengeID && ![5, 6].includes(wallet.challengeStatus || 0))
  )

  const storageWallet = UserStorage.getChallengeWallet()

  if (storageWallet) {
    const wallet = wallets.find(
      (w) => w.walletID === storageWallet.walletID && w.challengeStatus === 1
    )
    if (wallet) {
      const isMobile = getIsMobile()
      yield put(
        actionShowModal(ModalTypes.CREATE_CHALLENGE_SUCCESS, {
          challenge: storageWallet,
          isMobile,
        })
      )
      UserStorage.removeChallengeWallet()
    }
  }

  if (isResetActiveWallet) {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const walletID = urlParams.get('walletID')
    let walletIndex
    if (walletID) {
      walletIndex = walletsFilter.findIndex(
        (wallet) => wallet.walletID === parseInt(walletID)
      )
    } else {
      // walletIndex = walletsFilter.findIndex((wallet) => wallet.default)
      walletIndex = 0
    }
    yield put(actionSetWallets(walletsFilter, walletIndex))
  } else {
    yield put(actionSetWallets(walletsFilter))
  }
  yield put(actionSetShowChallenge(walletsFilter.length === 0))
  /**
   * Select bonus in local state
   * Will not send request to select on backend
   */
  // yield put(
  //   actionSelectBonusWallet(
  //     wallets[0].bonusesInfo.find((bonus: any) => bonus.active === true)
  //   )
  // )
}

export function* onFetchTrades() {
  const activeWallet = yield select((state) => state.wallets.activeWallet)
  const trades = yield call(api.fetchTrades, {
    walletID: activeWallet?.walletID,
  })
  const { success, open, closed, pending } = trades
  if (success) {
    if (closed.rows)
      yield put(
        actionSetClosedTrades({
          closed: closed.rows,
          totalPages: closed.pages,
          currentPage: 1,
        })
      )
    yield put(actionSetOpenTrades(open.rows ? open : { rows: [] }))
    yield put(actionSetPendingTrades(pending.rows ? pending : { rows: [] }))

    const openTrades = open.rows ? open.rows : []
    const instrumentsID = uniq(openTrades.map((i: any) => i.instrumentID))
    const resp: { [key: string]: number[][] } = yield call(
      api.fetchInstrumentHistory,
      instrumentsID.join(','),
      false,
      1,
      instrumentsID.length
    )
    const histories = yield select((state) => state.registry.instrumentsHistory)
    yield put(actionSetInstrumentsHistory({ ...histories, ...resp }))
  } else {
    yield put(actionAddMessage('Could not fetch trades'))
  }
}

/**
 * Intention to fetch mode trades
 */
export function* onFetchMoreTrades() {
  try {
    const { totalPages, currentPage } = (state) => state.trades
    const page = Math.min(currentPage + 1, totalPages)
    const trades = yield call(api.fetchTrades, { page })

    const { success, closed } = trades
    if (success) {
      if (closed.rows) {
        yield put(
          actionAddMoreTrades({
            closed: closed.rows,
            currentPage: page,
          })
        )
      }
    } else {
      yield put(actionAddMessage('Could not fetch more trades'))
    }
  } catch (err) {
    console.warn('Could not fetch more trades', err)
  }
}

/**
 * Reconnect to LS
 * @param loggedIn
 */
export function* fetchAccountData(loggedIn: boolean): any {
  if (loggedIn) {
    yield all([
      yield onFetchWalletDetails(true),
      yield onFetchTrades(),
      yield onFetchUserInfo(),
    ])
    /**
     * Handle guest demo expired logic: when loggedIn true but no userInfo
     */
    const userInfo = yield select((state) => state.account.userInfo)
    if (userInfo) {
      LSFeed.getInstance().userSubscriptions(
        userInfo.practiceMode,
        userInfo.userID
      ) // subscribe to user personal subscriptions like trades
      LSFeed.getInstance().getOpenPendingOrdersSubscription(userInfo.userID)
      LSFeed.getInstance().getCancelledPendingOrdersSubscription(
        userInfo.userID
      )
      if (userInfo.isDemo) {
        LSFeed.getInstance().getGuestDemoSubscription()
        if (!userInfo.isDemoActive) {
          yield put(actionShowModal(ModalTypes.GUESTDEMO_EXPIRED, {}))
        }
      }
      /**
       * Practice mode wallet expiry
       */
      if (userInfo.practiceMode) {
        const { practiceExpirationDate } = userInfo
        const expired = Number(new Date()) > practiceExpirationDate
        if (expired) {
          yield put(actionShowModal(ModalTypes.PRACTICE_EXPIRED, {}))
        }
      } else {
        /**
         * Close practice expired modal if we are not in practiceMode
         */
        const { modalName } = yield select((state) => state.modal)
        if (modalName === ModalTypes.PRACTICE_EXPIRED) {
          yield put(actionCloseModal())
        }
      }
    } else {
      yield put(actionShowModal(ModalTypes.SESSION_EXPIRED, {}))
    }
    const resp = yield call(api.fetchInstruments)
    if (resp && resp.instruments) {
      const instruments = resp.instruments.filter(
        ({ instrumentID }) => !!instrumentID
      )

      const favAssets =
        instruments
          ?.filter((item) => item.starred)
          ?.map((item) => item.instrumentID) || []
      yield put(actionUpdateFavorites(favAssets))
    }
    yield put(actionStartPing())
  }
  return
}

/**
 * Fire this action to update assets from CDN
 * When lightstreamer receives a signal with timestamp
 * @param action
 */
function* updateInstruments(action: any) {
  const instrumentID = yield select((state) => state.trading.selected)
  const loggedIn = yield select((state) => state.account.loggedIn)

  if (loggedIn) {
    const isPracticeMode = yield select(
      (state) => state.account.userInfo?.practiceMode
    )
    const isDemo = yield select((state) => state.account.userInfo?.isDemo)

    const min = isPracticeMode || isDemo ? 25 : 0
    const max = isPracticeMode || isDemo ? 61 : 26
    const delayMs = Math.trunc((Math.random() * (max - min) + min) * 1000)

    yield delay(delayMs)
    yield fetchAdvanced(false)
    yield put(actionSelectInstrument(instrumentID))
  }
}

function* registrySaga() {
  yield takeLatest(CONNECT, fetchRegistry) // start
  yield takeLatest(FORCE_UPDATE, updateInstruments) // payouts received
  yield takeLatest(REFETCH_TRADES, onFetchTrades) // trades refresh
  yield takeLatest(LOAD_MORE_TRADES_REQUEST, onFetchMoreTrades)
}

export default registrySaga
