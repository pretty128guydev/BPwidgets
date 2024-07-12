/* eslint-disable require-yield */
// @ts-nocheck 7057
/**
 * Handle get registry and side effects
 */
import {
  put,
  takeLatest,
  call,
  takeEvery,
  select,
  delay,
  all,
} from 'redux-saga/effects'
import { actionCloseModal, actionShowModal, ModalTypes } from '../actions/modal'
import { actionSetGlobalLoader } from '../actions/registry'
import {
  actionSignInFailure,
  actionSignInSuccess,
  actionUpdateFavorites,
  ADD_INSTRUMENT_TO_FAVS,
  START_PING,
  LOG_OUT,
  GUEST_DEMO_REQUEST,
  ACCOUNT_REFRESH,
  actionResetUser,
  actionSetUserInfo,
  SIGN_IN_REQUEST,
  REMOVE_INSTRUMENT_FROM_FAVS,
  SET_PRACTICE_MODE,
  actionLogout,
  GUEST_DEMO_EXPIRED,
  ADD_INSTRUMENT_TO_TOP,
  REMOVE_INSTRUMENT_FROM_TOP,
  actionUpdateTop,
} from '../actions/account'
import { api } from '../core/createAPI'
import { actionAddMessage } from '../actions/messages'
import { fetchAccountData, refetchRegistry } from './registrySaga'
import {
  actionSelectBonusWallet,
  SELECT_BONUS_WALLET_REMOTE,
} from '../actions/trading'
import { actionResetWallets } from '../actions/wallets'
import { actionResetTrades } from '../actions/trades'
import Cookies from 'js-cookie'
import UserStorage from '../core/UserStorage'
import { actionSetFXTheme, actionSetTheme } from '../actions/theme'
import { convertFxThemeToColors } from '../shares/colorConvert'
import { actionSetCollapsedSideMenu } from '../actions/container'
import { filter, isArray } from 'lodash'

/**
 * This saga is used only for user account stuff like sign-in, ping
 */
function* requestSignIn({ payload }: any): any {
  try {
    const { email, password } = payload
    const data = yield call(api.signIn, email, password)
    if (data.success) {
      yield put(actionSignInSuccess({ ...data, loggedIn: false }))
      yield delay(1500)
      yield put(actionSignInSuccess({ ...data, message: '', loggedIn: true }))
      yield put(actionCloseModal())
      yield put(actionSetCollapsedSideMenu(false))
      yield all([refetchRegistry(), fetchAccountData(true)])
    } else {
      yield put(actionSignInFailure(data.message))
      yield delay(2000)
      yield put(actionSignInFailure(''))
    }
  } catch (err) {
    yield put(actionSignInFailure(err.message))
    console.error(err)
  }
}

/**
 * Clear language when sign out
 */
function* resetLanguage() {
  try {
    Cookies.remove('userLanguage')
    UserStorage.resetLanguage()
    return null
  } catch (err) {
    console.warn(err)
    return null
  }
}

function* onSignOut(action: any): any {
  try {
    yield call(api.signOut)
    yield resetLanguage()
    if (action.payload) {
      window.location.reload()
    }
  } catch (err) {
    console.warn(err)
  }
}

function* requestPracticeMode(action: any) {
  try {
    const { allowPracticeModeChange } = yield select(
      (state) => state.account.userInfo
    )
    if (allowPracticeModeChange) {
      const data = yield call(api.practiceMode, action.payload)
      yield put(actionSetGlobalLoader(true))
      if (data.success) {
        yield fetchAccountData(true)
      }
      yield put(actionSetGlobalLoader(false))
    } else {
      yield put(actionAddMessage('Changing practice mode is not allowed'))
    }
  } catch (err) {
    console.warn(err)
    yield put(actionSetGlobalLoader(false))
  }
}

function* onRemoveInstrumentFromFavorites(action: any) {
  try {
    const data = yield call(api.starInstrument, action.payload, true)

    if (data.success) {
      const userFavorites = yield select(
        (state) => state.account.userInfo.favAssets
      )
      const newFavorites: string[] = userFavorites.filter(
        (item: string) => item !== Number(action.payload)
      )
      yield put(actionUpdateFavorites(newFavorites))
    } else {
      yield put(actionShowModal(ModalTypes.NETWORK_ERROR, {}))
    }
  } catch (err) {
    console.warn(err)
  }
}

function* onAddInstrumentToFavorites(action: any) {
  try {
    const data = yield call(api.starInstrument, action.payload, false)

    if (data.success) {
      const userFavorites = yield select(
        (state) => state.account.userInfo.favAssets
      )
      const newFavorites: string[] = [...userFavorites, Number(action.payload)]
      yield put(actionUpdateFavorites(newFavorites))
    } else {
      yield put(actionShowModal(ModalTypes.NETWORK_ERROR, {}))
    }
  } catch (err) {
    console.warn(err)
  }
}

function* onRemoveInstrumentFromTop(action: any) {
  try {
    const data = yield call(api.topInstrument, action.payload, true)

    if (data.success) {
      const userTop = yield select((state) => state.account.userInfo.topAssets)
      const newTop: string[] = userTop.filter(
        (item: string) => item !== Number(action.payload)
      )
      yield put(actionUpdateTop(newTop))
    } else {
      yield put(actionShowModal(ModalTypes.NETWORK_ERROR, {}))
    }
  } catch (err) {
    console.warn(err)
  }
}

function* onAddInstrumentToTop(action: any) {
  try {
    const data = yield call(api.topInstrument, action.payload, false)

    if (data.success) {
      const userTop = yield select((state) => state.account.userInfo.topAssets)
      const newTop: string[] = [...userTop, Number(action.payload)]
      yield put(actionUpdateTop(newTop))
    } else {
      yield put(actionShowModal(ModalTypes.NETWORK_ERROR, {}))
    }
  } catch (err) {
    console.warn(err)
  }
}

/**
 * Saga which will call itself on success and sleep 60 seconds
 * @param params
 */
function* startUserPing(retry: number = 0): any {
  try {
    // const { success } = yield call(api.ping)
    const success = true
    if (success) {
      yield delay(60000)
      yield call(startUserPing, retry + 1)
    } else {
      const userInfo = yield select((state) => state.account.userInfo)
      const isDemo = userInfo ? userInfo.isDemo && userInfo.isDemoActive : false
      if (isDemo) {
        yield put(actionShowModal(ModalTypes.GUESTDEMO_EXPIRED, {}))
      } else {
        yield put(actionShowModal(ModalTypes.SESSION_EXPIRED, {}))
      }
      yield put(actionResetUser())
      yield put(actionResetWallets())
      yield put(actionResetTrades())
    }
  } catch (err) {
    console.error('Ping failed', err)
  }
}

/**
 * Guest demo button pressed
 * Implements a fxcfd algorithm
 * 1) Show loader
 * 2) Reload page when cookies are set
 */
function* onGuestDemo() {
  try {
    yield put(actionSetGlobalLoader(true))

    const fingerprint = (window as any).fingerprint
    localStorage.setItem('demoAccountID', fingerprint)

    const state = yield call(api.createDemoAccount, fingerprint)

    if (state.success) {
      window.location.reload()
    } else {
      yield put(actionSetGlobalLoader(false))
      yield put(
        actionAddMessage(state.message || 'Technical error: could not login')
      )
    }
  } catch (err) {
    console.warn(err)
    yield put(actionSetGlobalLoader(false))
  }
}

/**
 * Event from LS-feed
 * Show modal, reset state, do logout (don't clear localStorage)
 */
function* onGuestDemoExpired() {
  yield put(actionShowModal(ModalTypes.GUESTDEMO_EXPIRED, {}))
  yield put(actionResetUser())
  yield put(actionResetWallets())
  yield put(actionResetTrades())
  yield put(actionLogout(false))
}

/**
 * Update backend with selected wallet
 */
function* onSelectBonusWallet(action: any) {
  const { payload } = action
  yield put(actionSelectBonusWallet(payload))
  const resp = yield call(api.selectBonusForVolume, payload)
  if (resp) {
    if (!resp.success) {
      yield put(actionAddMessage(resp.message))
    }
  }
}
/**
 * Update user data
 */
export function* onFetchUserInfo() {
  const userInfo = yield call(api.fetchUserInfo)
  yield put(actionSetUserInfo(userInfo))
  const partnerConfig = yield select(
    (state) => state.registry.data.partnerConfig
  )
  if (
    typeof (
      partnerConfig[partnerConfig.defaultTheme] ||
      partnerConfig.themePrimary ||
      partnerConfig.theme
    ) === 'object'
  ) {
    yield put(
      actionSetFXTheme(
        partnerConfig[partnerConfig.defaultTheme] ||
          partnerConfig.themePrimary ||
          partnerConfig.theme
      )
    )
    yield put(
      actionSetTheme(
        convertFxThemeToColors(
          partnerConfig[partnerConfig.defaultTheme] ||
            partnerConfig.themePrimary ||
            partnerConfig.theme
        )
      )
    )
  }
}

function* accountSaga() {
  yield takeEvery(ADD_INSTRUMENT_TO_FAVS, onAddInstrumentToFavorites) // add instrument to fav
  yield takeEvery(REMOVE_INSTRUMENT_FROM_FAVS, onRemoveInstrumentFromFavorites) // remove instrument from fav
  yield takeEvery(ADD_INSTRUMENT_TO_TOP, onAddInstrumentToTop) // add instrument to top
  yield takeEvery(REMOVE_INSTRUMENT_FROM_TOP, onRemoveInstrumentFromTop) // remove instrument from top
  yield takeLatest(START_PING, startUserPing) // user ping
  yield takeLatest(GUEST_DEMO_REQUEST, onGuestDemo) // guest demo requested
  yield takeLatest(GUEST_DEMO_EXPIRED, onGuestDemoExpired)
  yield takeLatest(SIGN_IN_REQUEST, requestSignIn) // sign in requested
  yield takeLatest(LOG_OUT, onSignOut) // log out requested
  yield takeLatest(ACCOUNT_REFRESH, onFetchUserInfo) // user info refresh requested
  yield takeLatest(SELECT_BONUS_WALLET_REMOTE, onSelectBonusWallet) // wallet picked
  yield takeLatest(SET_PRACTICE_MODE, requestPracticeMode) // practice mode clicked
}

export default accountSaga
