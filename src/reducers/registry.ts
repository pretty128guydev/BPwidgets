/**
 * Registry state
 * holds loading, registry object
 */
import { cloneDeep } from 'lodash'
import {
  SET_LOADING,
  SET_APP_READY,
  SET_SCREENMODE,
  UPDATE,
  SET_EMBEDDED,
  SET_THEME_READY,
  CHANGE_CHART_TYPE,
  SET_INSTRUMENTS_HISTORY,
} from '../actions/registry'
import { ChartType } from '../components/ChartContainer/ChartLibraryConfig'
import { IRegistry } from '../core/API'
import { getIsMobile } from '../sagas/registrySaga'

interface IRegistryReducerState {
  themeReady: boolean
  loading: boolean
  appReady: boolean
  isMobile: boolean
  data: IRegistry | null
  embedded: null | any
  currentChartType: ChartType | null
}

const defaultState = {
  themeReady: false,
  loading: true,
  data: null,
  isMobile: getIsMobile(),
  embedded: null,
  currentChartType: null,
  appReady: false,
  instrumentsHistory: {},
}

const registryReducer = (
  state: IRegistryReducerState = defaultState,
  action: any
) => {
  switch (action.type) {
    case UPDATE:
      const data = cloneDeep(action.payload)
      return {
        ...state,
        data,
        currentChartType: '3',
      }
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case SET_SCREENMODE:
      return {
        ...state,
        isMobile: action.payload,
      }
    case SET_EMBEDDED:
      return {
        ...state,
        embedded: action.payload,
      }
    case SET_THEME_READY:
      return {
        ...state,
        themeReady: true,
      }
    case CHANGE_CHART_TYPE:
      return {
        ...state,
        currentChartType: action.payload,
      }
    case SET_APP_READY:
      return {
        ...state,
        appReady: action.payload,
      }
    case SET_INSTRUMENTS_HISTORY:
      return {
        ...state,
        instrumentsHistory: action.payload,
      }
    default:
      return state
  }
}

export default registryReducer
