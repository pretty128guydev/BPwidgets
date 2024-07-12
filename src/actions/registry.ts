import { action } from 'typesafe-actions'
import { IRegistry } from '../core/API'

const entity = 'registry'

const CONNECT = `${entity}/CONNECT`
const UPDATE = `${entity}/UPDATE`
const SET_LOADING = `${entity}/SET_LOADING`
const SET_APP_READY = `${entity}/SET_APP_READY`
const SET_SCREENMODE = `${entity}/SET_SCREENMODE`
const SET_EMBEDDED = `${entity}/SET_EMBEDDED`
const SET_THEME_READY = `${entity}/SET_THEME_READY`
const CHANGE_CHART_TYPE = `${entity}/CHANGE_CHART_TYPE`
const SET_INSTRUMENTS_HISTORY = `${entity}/SET_INSTRUMENTS_HISTORY`

const actionConnect = () => action(CONNECT)
const actionUpdateRegistry = (registry: IRegistry) => action(UPDATE, registry)
const actionSetGlobalLoader = (loader: boolean) => action(SET_LOADING, loader)
const actionSetAppReady = (ready: boolean) => action(SET_APP_READY, ready)
const actionSetScreenMode = (isMobile: boolean) =>
  action(SET_SCREENMODE, isMobile)
const actionSetEmbedded = (xprops: any) => action(SET_EMBEDDED, xprops)
const actionSetThemeReady = () => action(SET_THEME_READY)
const actionChangeChartType = (chartType: string) =>
  action(CHANGE_CHART_TYPE, chartType)
const actionSetInstrumentsHistory = (instrumentsHistory: {
  [key: string]: number[][]
}) => action(SET_INSTRUMENTS_HISTORY, instrumentsHistory)

export {
  CONNECT,
  UPDATE,
  SET_LOADING,
  SET_APP_READY,
  SET_SCREENMODE,
  SET_EMBEDDED,
  SET_THEME_READY,
  CHANGE_CHART_TYPE,
  SET_INSTRUMENTS_HISTORY,
  actionConnect,
  actionUpdateRegistry,
  actionSetGlobalLoader,
  actionSetScreenMode,
  actionSetEmbedded,
  actionSetThemeReady,
  actionChangeChartType,
  actionSetAppReady,
  actionSetInstrumentsHistory,
}
