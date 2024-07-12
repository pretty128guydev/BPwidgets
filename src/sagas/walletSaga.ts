// @ts-nocheck 7057
/**
 * Adjust timer each second
 * Check if game is in dead period and try to refresh it
 */
import { takeLatest, select, call, put } from 'redux-saga/effects'
import {
  SET_ACTIVE_WALLET,
  SET_WALLETS,
  actionSetChallengeDashboard,
} from '../actions/wallets'
import { onInstrumentSelect } from './tradingSaga'
import { onFetchTrades } from './registrySaga'
import { api } from '../core/createAPI'

function* onSetActiveWallet() {
  const state = yield select((state) => state)
  const selectedInstrument = state.trading.selected
  yield call(onInstrumentSelect, { payload: selectedInstrument })
  yield call(onFetchTrades)
  const activeWallet = state.wallets.activeWallet
  if (activeWallet.challengeID) {
    const resp = yield call(
      api.fetchChallengeDashboard,
      activeWallet.challengeID
    )
    const { success, challenge } = resp
    if (success) {
      yield put(actionSetChallengeDashboard(challenge))
    }
  }
}

function* walletSaga() {
  yield takeLatest(SET_WALLETS, onSetActiveWallet)
  yield takeLatest(SET_ACTIVE_WALLET, onSetActiveWallet)
}

export default walletSaga
