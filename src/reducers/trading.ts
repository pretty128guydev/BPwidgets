import { cloneDeep, find, values } from 'lodash'
import { UPDATE } from '../actions/registry'
import {
  SELECT_BONUS_WALLET,
  SELECT_INSTRUMENT,
  SET_CURRENT_PAYOUT,
  SET_DIRECTION,
  SET_INSTRUMENTS,
  SET_IN_TRADING_HOURS,
  SET_TRADING_TIMEOUT,
  SUBMIT_TRADE_FAILURE,
  SUBMIT_TRADE_REQUEST,
  SUBMIT_TRADE_SUCCESS,
  GAME_ENTERED_DEAD_PERIOD,
  LOCK_ADD,
  LOCK_RELEASE,
  HOVER_DIRECTION,
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
  SET_CHECKED_LOTS,
  SET_LOTS,
  SET_DEFAULT_VIEW,
  SET_CHART_HISTORY,
} from '../actions/trading'
import { IConversionChain, IInstrument } from '../core/API'

export interface ISentimentItem {
  id: number
  label: string
}

interface ITradingReducerState {
  instruments: IInstrument[]
  selectedDirection: 1 | -1 | 0
  bonusWallet: any | null
  distances: any
  sendingTrade: boolean
  inTradingHours: boolean
  tradeTimeout: number
  currentPayout: number
  gameEnteredDeadPeriod: boolean
  locked: any[] // array of tradeIDs
  hoveredDirection: number
  fxRiskFactor: number
  baseCurrency: string | null
  leverage: number[]
  defaultLeverage: number
  selected: number
  currentInstrument?: IInstrument
  currentLeverage: number
  error: object
  pendingOrder: number
  tradeIfReachPending: boolean
  stake: number
  defaultStake: number
  stopLoss: number
  checkedStopLoss: boolean
  profit: number
  checkedProfit: boolean
  profitPercent: number
  stopLossPercent: number
  stopLossCoe: number
  profitCoe: number
  lotValue: number
  stopLossPips: number
  profitPips: number
  defaultLayout: object | undefined
  chartsCount: number
  activeChartIndex: number
  conversionChain: IConversionChain
  conversionChainProfit: IConversionChain
  margin: number
  chartInstruments: IInstrument[]
  tradingPanelType: number
  checkedLots: boolean
  lots: number
  chartHistory: any
}

const defaultState: ITradingReducerState = {
  instruments: [],
  selectedDirection: 0,
  bonusWallet: null,
  distances: {},
  sendingTrade: false,
  inTradingHours: true,
  tradeTimeout: 0,
  currentPayout: 0,
  gameEnteredDeadPeriod: false,
  locked: [],
  hoveredDirection: 0,
  fxRiskFactor: 1,
  baseCurrency: null,
  leverage: [],
  defaultLeverage: 0,
  selected: 0,
  currentInstrument: undefined,
  currentLeverage: 0,
  error: {},
  pendingOrder: 0,
  tradeIfReachPending: false,
  stake: 0,
  defaultStake: 0,
  stopLoss: 0,
  checkedStopLoss: true,
  profit: 0,
  checkedProfit: true,
  profitPercent: 100,
  stopLossPercent: 99.5,
  stopLossCoe: 0,
  profitCoe: 0,
  lotValue: 0,
  stopLossPips: 0,
  profitPips: 0,
  defaultLayout: undefined,
  chartsCount: 4,
  activeChartIndex: 0,
  conversionChain: {
    needsConversion: false,
    operations: [],
  },
  conversionChainProfit: {
    needsConversion: false,
    operations: [],
  },
  margin: 0,
  chartInstruments: [],
  tradingPanelType: 1,
  checkedLots: false,
  lots: 0.01,
  chartHistory: null,
}

const getMinMaxInvestment = (minStopLoss: number, maxStopLoss: number) => {
  const steps = 10
  const stepValue = maxStopLoss / steps
  const investmentOptions = []
  for (let i = 1; i <= steps; i++) investmentOptions.push(i * stepValue)

  return investmentOptions
}

/**
 * This reducer holds actual trading state like current asset
 */
const tradingReducer = (
  state: ITradingReducerState = defaultState,
  action: any
) => {
  switch (action.type) {
    case SET_INSTRUMENTS:
      return {
        ...state,
        instruments: action.payload,
      }
    case SELECT_INSTRUMENT:
      const currentInstrument = find(state.instruments, [
        'instrumentID',
        action.payload,
      ])
      if (state.tradingPanelType === 1) {
        let defaultTakeProfit = 100
        if (currentInstrument) {
          defaultTakeProfit = currentInstrument.tradingConfig.defaultTakeProfit
        }
        const profit = (defaultTakeProfit * state.stake) / 100
        const stopLoss = state.stake * 0.995

        return {
          ...state,
          selected: action.payload,
          currentInstrument,
          currentLeverage: currentInstrument?.tradingConfig?.defaultLeverage,
          profit,
          stopLoss,
          lotValue: currentInstrument?.defaultUnitValue,
          lots: currentInstrument?.defaultLotValue || 0.01,
          stopLossPercent: 99.5,
          profitPercent: defaultTakeProfit,
        }
      }
      let chartInstruments = state.chartInstruments
      if (currentInstrument) {
        chartInstruments[state.activeChartIndex] = currentInstrument
      }
      return {
        ...state,
        selected: action.payload,
        currentInstrument,
        currentLeverage: currentInstrument?.tradingConfig?.defaultLeverage,
        lotValue: currentInstrument?.defaultUnitValue,
        chartInstruments,
        stake: 0,
        stopLoss: 0,
        profit: 0,
        lots: currentInstrument?.defaultLotValue || 0.01,
      }

    case SUBMIT_TRADE_REQUEST:
      return {
        ...state,
        sendingTrade: true,
      }
    case SUBMIT_TRADE_FAILURE:
    case SUBMIT_TRADE_SUCCESS:
      return {
        ...state,
        sendingTrade: false,
      }
    case SET_IN_TRADING_HOURS:
      return {
        ...state,
        inTradingHours: action.payload,
      }
    case GAME_ENTERED_DEAD_PERIOD:
      return {
        ...state,
        gameEnteredDeadPeriod: action.payload,
      }
    case SELECT_BONUS_WALLET:
      return {
        ...state,
        bonusWallet: action.payload,
      }
    case SET_TRADING_TIMEOUT:
      return {
        ...state,
        tradeTimeout: action.payload,
      }
    case SET_CURRENT_PAYOUT:
      return {
        ...state,
        currentPayout: action.payload,
      }
    case SET_DIRECTION:
      return {
        ...state,
        direction: action.payload,
      }
    case HOVER_DIRECTION:
      return {
        ...state,
        hoveredDirection: action.payload,
      }
    case LOCK_ADD:
      return {
        ...state,
        locked: [...state.locked, action.payload],
      }
    case LOCK_RELEASE:
      return {
        ...state,
        locked: state.locked.filter((i: any) => i !== action.payload),
      }
    case UPDATE: {
      const data = cloneDeep(action.payload)
      const baseCurrency = state.baseCurrency
        ? data.tradingConfigPerCurrency[state.baseCurrency]
        : values(data.tradingConfigPerCurrency)[0]
      const { minStopLoss, maxStopLoss, defaultStopLoss } = baseCurrency
      const minMaxInvestment = getMinMaxInvestment(minStopLoss, maxStopLoss)
      return {
        ...state,
        minMaxInvestment,
        stake: defaultStopLoss,
        defaultStake: defaultStopLoss,
      }
    }
    case SET_CURRENT_LEVERAGE: {
      return {
        ...state,
        currentLeverage: action.payload,
      }
    }
    case SET_CURRENT_INVESTMENT: {
      return {
        ...state,
        stake: action.payload,
      }
    }
    case SET_CURRENT_DIRECTION: {
      return {
        ...state,
        selectedDirection: action.payload,
      }
    }
    case SET_TRADING_ERROR: {
      return {
        ...state,
        error: {
          ...state.error,
          [action.payload.field]: action.payload.message,
        },
      }
    }
    case RESET_TRADING_ERROR: {
      return {
        ...state,
        error: {},
      }
    }
    case SET_PENDING_ORDER: {
      return {
        ...state,
        pendingOrder: action.payload,
      }
    }
    case SET_TRADE_IF_REACH_PENDING: {
      return {
        ...state,
        tradeIfReachPending: action.payload,
      }
    }
    case SET_STOP_LOSS: {
      return {
        ...state,
        stopLoss: action.payload,
      }
    }
    case SET_CHECKED_STOP_LOSS: {
      return {
        ...state,
        checkedStopLoss: !state.checkedStopLoss,
      }
    }
    case SET_PROFIT: {
      return {
        ...state,
        profit: action.payload,
      }
    }
    case SET_CHECKED_PROFIT: {
      return {
        ...state,
        checkedProfit: !state.checkedProfit,
      }
    }
    case SET_PROFIT_PERCENT: {
      return {
        ...state,
        profitPercent: action.payload,
      }
    }
    case SET_STOP_LOSS_PERCENT: {
      return {
        ...state,
        stopLossPercent: action.payload,
      }
    }
    case SET_STOP_LOSS_COE: {
      return {
        ...state,
        stopLossCoe: action.payload,
      }
    }
    case SET_PROFIT_COE: {
      return {
        ...state,
        profitCoe: action.payload,
      }
    }
    case SET_LOT_VALUE: {
      return {
        ...state,
        lotValue: action.payload,
      }
    }
    case SET_STOP_LOSS_PIPS: {
      return {
        ...state,
        stopLossPips: action.payload,
      }
    }
    case SET_PROFIT_PIPS: {
      return {
        ...state,
        profitPips: action.payload,
      }
    }
    case SET_DEFAULT_LAYOUT: {
      return {
        ...state,
        defaultLayout: action.payload,
      }
    }
    case SET_CHARTS_COUNT: {
      return {
        ...state,
        chartsCount: action.payload,
      }
    }
    case SET_ACTIVE_CHART_INDEX: {
      return {
        ...state,
        activeChartIndex: action.payload,
      }
    }
    case SET_CONVERSION_CHAIN: {
      return {
        ...state,
        conversionChain: action.payload,
      }
    }
    case SET_MARGIN: {
      return {
        ...state,
        margin: action.payload,
      }
    }
    case SET_CHART_INSTRUMENTS: {
      return {
        ...state,
        chartInstruments: action.payload,
      }
    }
    case SET_CONVERSION_CHAIN_PROFIT: {
      return {
        ...state,
        conversionChainProfit: action.payload,
      }
    }
    case SET_TRADING_PANEL_TYPE: {
      return {
        ...state,
        tradingPanelType: action.payload,
      }
    }
    case SET_CHECKED_LOTS: {
      return {
        ...state,
        checkedLots: !state.checkedLots,
      }
    }
    case SET_LOTS: {
      return {
        ...state,
        lots: action.payload,
      }
    }
    case SET_DEFAULT_VIEW: {
      return {
        ...state,
        checkedLots: action.payload === 2,
      }
    }
    case SET_CHART_HISTORY: {
      return {
        ...state,
        chartHistory: action.payload,
      }
    }
    default:
      return state
  }
}

export default tradingReducer
