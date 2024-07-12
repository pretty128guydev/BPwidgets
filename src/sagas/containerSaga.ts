// @ts-nocheck 7057
/**
 * Adjust timer each second
 * Check if game is in dead period and try to refresh it
 */
import { call, delay, put, select, takeLatest } from 'redux-saga/effects'
import {
  SET_ASSETS_PAGE,
  actionSetCurrentAssetsPage,
  actionSetLoadingMoreAssets,
} from '../actions/container'
import LSFeed from '../core/feed'
import { shortOpenInstruments } from '../components/selectors/instruments'
import { INSTRUMENTS_PER_PAGE } from '../components/constant'
import { actionSetInstrumentsHistory } from '../actions/registry'
import { api } from '../core/createAPI'

function* onSetAssetsPage(action: any) {
  yield put(actionSetLoadingMoreAssets(true))
  let instruments = yield select((state) =>
    Object.values(shortOpenInstruments(state))
  )
  if (action.payload.searchInstruments)
    instruments = action.payload.searchInstruments
  const selectedInstrument = yield select((state) => state.trading.selected)
  const histories = yield select((state) => state.registry.instrumentsHistory)

  const currentPage = action.payload.currentAssetsPage

  const availableInstruments = [...instruments].splice(
    0,
    INSTRUMENTS_PER_PAGE * currentPage
  )

  const isSelectedInstrumentIncluded = availableInstruments.find(
    (i) => i.instrumentID === selectedInstrument
  )

  if (!isSelectedInstrumentIncluded) {
    const instrument = instruments.find(
      (i) => i.instrumentID === selectedInstrument
    )
    if (instrument) subscribeInstruments = [...availableInstruments, instrument]
  }

  const historyInstruments = [...instruments].splice(
    currentPage === 1 ? 0 : INSTRUMENTS_PER_PAGE * (currentPage - 1),
    INSTRUMENTS_PER_PAGE
  )

  const instrumentsID = historyInstruments
    .map((i: any) => i.instrumentID)
    .join(',')

  const resp: { [key: string]: number[][] } = yield call(
    api.fetchInstrumentHistory,
    instrumentsID,
    false,
    1,
    historyInstruments.length
  )

  yield put(actionSetInstrumentsHistory({ ...histories, ...resp }))

  yield delay(2000)

  yield put(actionSetCurrentAssetsPage(currentPage))
  yield put(actionSetLoadingMoreAssets(false))
}

function* containerSaga() {
  yield takeLatest(SET_ASSETS_PAGE, onSetAssetsPage)
}

export default containerSaga
