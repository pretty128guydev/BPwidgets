import { forEach, keys, join, cloneDeep } from 'lodash'
import { TradeDirection } from '../models/instrument'
import { calculatePnL } from '../sagas/tradingHelper'
import { IQuote } from '../reducers/quotes'
import { IOpenTrade } from './interfaces/trades'

const isLandscape = window.matchMedia('(orientation: landscape)').matches

/**
 * serializes object to encoded URI Component
 * @param obj
 */
export const serializeObject = (obj: { [key: string]: any }) => {
  const res: string[] = []

  forEach(keys(obj), (key: string) =>
    res.push(`${key}=${encodeURIComponent(obj[key])}`)
  )

  return join(res, '&')
}

/**
 * replaces item in generic array by index
 * @param array
 * @param index
 * @param item
 */
export const replaceByIndex = <T>(array: T[], index: number, item: T) => {
  const res = cloneDeep(array)
  res[index] = item

  return res
}

export const isMobileLandscape = (isMobile: boolean) => isMobile && isLandscape

export const randomColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

export const calculateTakeProfitPrice = (
  percent: number,
  investment: number
) => {
  return (percent * investment) / 100
}

export const getTakeProfitBoundaries = (tradingConfig: any, stake: number) => {
  const { takeProfit } = tradingConfig

  return {
    minTakeProfit: takeProfit
      ? calculateTakeProfitPrice(takeProfit[0] || 1, stake)
      : 1,
    maxTakeProfit: takeProfit
      ? calculateTakeProfitPrice(takeProfit[takeProfit.length - 1], stake)
      : 100,
  }
}

export const calculatePipPrice = (
  investment: number,
  quote: number,
  multiplier: number,
  pip: number
) => {
  return (investment / quote) * multiplier * pip
}

export const calculateStopLossMinPrice = (
  limitDelta: number,
  pip: number,
  investment: number,
  quote: number,
  multiplier: number
) => {
  const pipPrice = calculatePipPrice(investment, quote, multiplier, pip)

  return (limitDelta / pip) * pipPrice || 0
}

export const convertHexToRGBA = (hexCode: string, opacity = 1) => {
  let hex = hexCode.replace('#', '')

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100
  }

  return `rgba(${r},${g},${b},${opacity})`
}

export const getInitialPendingOrderPrice = (
  precision: number,
  selectedDirection: TradeDirection,
  askIn: number,
  bidIn: number,
  pendingOrderLimit: number
) => {
  const ask = askIn || 0
  const bid = bidIn || 0
  if (selectedDirection === 1) {
    return Number((ask + pendingOrderLimit * 2).toFixed(precision))
  }

  return Number((bid - pendingOrderLimit * 2).toFixed(precision))
}

export const getFormData = (object: any) => {
  const formData = new FormData()
  Object.keys(object).forEach((key) => formData.append(key, object[key]))
  return formData
}

export const openPnlCal = (item: any, quote: IQuote) => {
  if (!quote) return 0
  const { direction, deltaSpread, fxRiskFactor, swaps } = item
  const ask = quote.ask + (deltaSpread * fxRiskFactor || 0) / 2
  const bid = quote.bid - (deltaSpread * fxRiskFactor || 0) / 2
  const currentPrice = direction === TradeDirection.up ? bid : ask
  return calculatePnL(item, currentPrice) - swaps
}

export const getFloatingAmount = (
  position: IOpenTrade,
  result: number
): number => {
  if (result < 0) {
    const amount = position.userCurrencyStake
    const payout = position.payout
    return amount + (amount * payout) / 100
  } else if (result > 0) {
    return 0 // out of the money
  } else {
    return position.userCurrencyStake // at the money
  }
}

export const getMoneyState = (
  { strike, direction }: IOpenTrade,
  lastPrice: number
): number => (+strike - lastPrice) * direction

export const moneyStateGetColor = (moneyState: number, colors: any) => {
  if (moneyState === 0) {
    return colors.secondaryText
  }
  if (moneyState < 0) {
    return colors.accentDefault
  }
  return colors.secondary
}
