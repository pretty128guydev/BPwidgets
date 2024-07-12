import { IOpenTrade } from '../core/interfaces/trades'
import { TradeDirection } from '../models/instrument'

export function calculateStopLoss(
  tradingData: {
    ask: number
    bid: number
    stake: number
    pendingOrder: number
    stopLossAmount: number
    direction: TradeDirection
    currentLeverage: number
  },
  markedDirection?: TradeDirection
) {
  const {
    ask,
    bid,
    stake,
    pendingOrder,
    stopLossAmount,
    direction,
    currentLeverage: leverage,
  } = tradingData
  if (!ask || !bid || !stake || !leverage) return ''
  let currentDirection
  if (markedDirection) {
    currentDirection = markedDirection
  } else if (direction) {
    currentDirection = direction
  } else {
    return ''
  }

  const totalStopLoss =
    stopLossAmount && typeof stopLossAmount === 'number'
      ? stopLossAmount
      : stake

  let referencePrice = 0
  if (pendingOrder === 0) {
    referencePrice = currentDirection === 1 ? ask : bid
  } else {
    referencePrice = pendingOrder
  }
  const orderQuantity = (stake * leverage) / referencePrice
  const stopLoss =
    referencePrice - currentDirection * (totalStopLoss / orderQuantity)

  return stopLoss
}

export function calculateTakeProfit(
  tradingData: {
    ask: number
    bid: number
    stake: number
    pendingOrder: number
    direction: TradeDirection
    currentLeverage: number
    takeProfitPayout: number
  },
  markedDirection?: TradeDirection
) {
  const {
    ask,
    bid,
    stake,
    // referencePrice,
    direction,
    takeProfitPayout,
    currentLeverage,
    pendingOrder,
  } = tradingData
  if (!ask || !bid || !stake || !currentLeverage) return ''
  let currentDirection
  if (markedDirection) {
    currentDirection = markedDirection
  } else if (direction) {
    currentDirection = direction
  } else {
    return ''
  }

  let referencePrice
  if (pendingOrder === 0) {
    referencePrice = currentDirection === 1 ? ask : bid
  } else {
    referencePrice = pendingOrder
  }
  const orderQuantity = (stake * currentLeverage) / referencePrice
  const takeProfitAmount = stake * (takeProfitPayout / 100)
  const takeProfit =
    referencePrice + currentDirection * (takeProfitAmount / orderQuantity)

  return takeProfit
}
export const calculateTakeProfitPayout = (
  takeProfit: number,
  stake: number
) => {
  return (takeProfit * 100) / stake
}

export function calculatePnL(trade: IOpenTrade, currentPrice: number) {
  if (!trade) return NaN
  const { direction, referencePrice, leverage, stake } = trade
  if (!direction || !currentPrice || !referencePrice || !leverage || !stake) {
    return NaN
  }
  const orderQuantity = (stake * leverage) / referencePrice
  const pnl = direction * (currentPrice - referencePrice) * orderQuantity

  return pnl
}

export function calculatePrices(
  originalAsk: number,
  originalBid: number,
  deltaSpread: number,
  fxRiskFactor: number
) {
  const ask = originalAsk + (deltaSpread * fxRiskFactor || 0) / 2
  const bid = originalBid - (deltaSpread * fxRiskFactor || 0) / 2

  return {
    ask,
    bid,
  }
}

export function calculateStopLossPrice({
  lastPrice,
  pips,
  pip,
  direction,
  deltaSpread,
}: {
  lastPrice: number
  pips: number
  pip: number
  direction: number
  deltaSpread: number
}) {
  if (!lastPrice || !pips || !pip) return 0
  if (!direction || direction === 1) return lastPrice - deltaSpread - pips * pip
  return lastPrice + deltaSpread + pips * pip
}

export function calculateProfitPrice({
  lastPrice,
  pips,
  pip,
  direction,
}: {
  lastPrice: number
  pips: number
  pip: number
  direction: number
}) {
  if (!lastPrice || !pips || !pip) return 0
  if (!direction || direction === 1) return lastPrice + pips * pip
  return lastPrice - pips * pip
}

export function calculateStopLossPipsFromCoeWhenOpenTrade({
  lastPrice,
  coe,
  pip,
  direction,
}: {
  lastPrice: number
  coe: number
  pip: number
  direction: number
}) {
  if (!lastPrice || !coe || !pip) return 0
  if (!direction || direction === 1) return (coe - lastPrice) / -pip
  return (coe - lastPrice) / pip
}

export function calculateStopLossPipsFromCoe({
  lastPrice,
  coe,
  pip,
  direction,
}: {
  lastPrice: number
  coe: number
  pip: number
  direction: number
}) {
  if (!lastPrice || !coe || !pip) return 0
  if (!direction || direction === 1) return (coe - lastPrice) / pip
  return (coe - lastPrice) / -pip
}

export function calculateProfitPipsFromCoe({
  lastPrice,
  coe,
  pip,
  direction,
}: {
  lastPrice: number
  coe: number
  pip: number
  direction: number
}) {
  if (!lastPrice || !coe || !pip) return 0
  if (!direction || direction === 1) return (coe - lastPrice) / pip
  return (coe - lastPrice) / -pip
}
