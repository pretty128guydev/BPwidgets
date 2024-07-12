export interface IEditTrade {
    walletID: number
    platformID: number
    tradeID: number
    stopLossPrice?: number
    stopLoss?: number
    takeProfitPrice?: number
    takeProfit?: number
    appId: string
  }
