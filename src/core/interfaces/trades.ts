/**
 * Our open/closed trades are little bit different
 * Lets create interfaces
 */

export interface IOpenTrade {
  allowSellback: boolean // true
  currency: number // 1
  direction: number // 1
  distance: number // 0
  expiryTimestamp: number // 1612791000000
  followedTrade: number // 0
  gameType: number // 1
  instrumentID: number // 1
  instrumentName: string // "EUR/USD"
  payout: number // 60
  quotePrecision: number // 5
  rebate: number // 0
  stake: number // 100
  status: number // 1
  strike: number // 1.20242
  units: number // 1.20242
  tradeID: number // 6777591
  userCurrency: number // 1
  userCurrencyStake: number // 100
  optionValue?: number
  optionManualCloseAllowed: number // 0
  tradeTime: number // 1612791000000
  leverage: number
  referencePrice: number
  swaps: number
  walletID: number
  platformID: number
  stopLossPrice: number
  stopLossAmount: number
  takeProfitPrice: number
  takeProfitAmount: number
}

export interface IClosedTrade {
  tradeID: number // 1780713,
  action: string // "",
  instrumentName: string // "EUR\/USD",
  tradeTime: number // 1612524768000,
  currency: number // 1,
  direction: number // -1,
  distance: number // 0,
  expiryTimestamp: number // 1612525200000,
  closedPrice: number // 1.19772,
  instrumentID: number // 1,
  quotePrecision: number // 5,
  payout: number // 78,
  rebate: number // 0,
  return: number // 0,
  status: number // -1,
  strike: number // 1.19735,
  units: number // 1.20242
  userCurrency: number // 1,
  userCurrencyReturn: number // 0,
  userCurrencyStake: number // 400,
  stake: number // 400
  gameType: number // 1
  followedTrade: number // 0
  optionValue?: number
  referencePrice?: number
  walletID: number
  expiryPrice: number
  pnl: number
  closeTime: number
  swaps: number
}
