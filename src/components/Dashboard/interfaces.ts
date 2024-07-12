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

export interface IChallengeInfo {
  challengeConfigID: string
  siteID: string
  title: string
  initialBalance: string
  leverageCap: string
  maxDailyLossPct: string
  maxTotalLossPct: string
  profitGoalPct: string
  maxDailyTrades: string
  maxTradingDays: string
  minOverallTrades: string
  expiryDate: string
  price: string
  currency: string
}

export interface IChallengePackageInfo {
  packageConfigID: string
  siteID: string
  title: string
  stepIDs: string[]
  stepsInitialBalance: string
  price: string
  enabled: string
  userPackage: string
  profitSharePct: string
  steps: IChallengeInfo[]
}

export interface IChallengeDashboardHistory {
  timeRange: string
  minEquity: string
  maxEquity: string
  startEquity: string
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
    currency: string
    packageID: string
  }
}
