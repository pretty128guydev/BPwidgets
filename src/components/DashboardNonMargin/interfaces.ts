export interface IDashboardTrade {
  count: number
  volume: number
}

export interface IDashboardBonus {
  totalBonusReceived: number
  totalTradedVolume: number
}

export interface IDashboardTradeDate {
  dates: {
    [key: string]: IDashboardTrade
  }
}

export interface IDashboardTradeInstrument {
  closedTrades: { [key: string]: IDashboardTrade }
  openedTrades: { [key: string]: IDashboardTrade }
}

export interface IDashboardTrades {
  byDateWithOffset: IDashboardTradeDate
  byInstrumentId: IDashboardTradeInstrument
}

export interface IDashboardData {
  walletStats: {
    bonus: IDashboardBonus
    trade: IDashboardTrade
  }
}

export interface IChallengePackageInfo {
  challengeConfigID: string
  siteID: string
  title: string
  initialBalance: string
  leverageCap: string
  maxDailyLossPct: string
  maxTotalLossPct: string
  profitGoalPct: string
  expiryDate: string
  maxDailyTrades: string
  maxTradingDays: string
  enabled: string
  userChallenge: string
  price: string
  minOverallTrades: string
  profitSharePct: string
}

export interface IChallengeDashboardHistory {
  timeRange: string
  minEquity: string
  maxEquity: string
}

export interface IChallengeDashboardData {
  history: IChallengeDashboardHistory[]
  state: {
    challengeID: number
    walletID: number
    title: string
    currentTradingDays: number
    initialBalance: string
    startTime: string
    expiryTime: string
    leverageCap: string
    status: string
    maxDailyLossPct: string
    maxTotalLossPct: string
    profitGoalPct: string
    maxDailyTrades: string
    maxTradingDays: string
    totalPnl: string
    lastDayLoss: string
    dailyLossReached: string
    maxDailyTradesReached: string
    maxTotalLossReached: string
    maxTradingDaysReached: string
    expirationReached: string
  }
}
