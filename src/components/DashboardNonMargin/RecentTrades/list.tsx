import React from 'react'
import { connect } from 'react-redux'
import { IClosedTrade, IOpenTrade } from '../../../core/interfaces/trades'
import OpenPositionItem from '../../Sidebar/PositionsPanel/OpenPositionItem'
import ClosedPositionItem from '../../Sidebar/PositionsPanel/ClosedPositionItem'
import { RecentTradesListSpace } from './styled'
import { IInstrument, IWalletDetails } from '../../../core/API'
import { AvailableCurrencies } from '../../../models/registry'
import { QuotesMap } from '../../../reducers/quotes'
import { openPnlCal } from '../../../core/utils'

interface IRecentTradesTableProps {
  colors: any
  closedTrades: IClosedTrade[]
  openTrades: IOpenTrade[]
  currencies: AvailableCurrencies
  wallets: any
  instruments: IInstrument[]
  quotes: QuotesMap
  checkedLots: boolean
}

const RecentTradesList = ({
  colors,
  closedTrades,
  openTrades,
  wallets,
  currencies,
  instruments,
  quotes,
  checkedLots,
}: IRecentTradesTableProps) => {
  const trades = [...openTrades, ...closedTrades].sort(
    (a: any, b: any) => Number(a.tradeTime) - Number(b.tradeTime)
  )
  const { wallets: wls, activeWallet } = wallets

  return (
    <RecentTradesListSpace>
      {trades.map((item: any, index: number) => {
        if (!item.walletID || item.walletID !== activeWallet.walletID)
          return <></>
        const wallet = wls.find(
          (w: IWalletDetails) => w.walletID === item.walletID
        )
        const currency = currencies[wallet.baseCurrency]
        const instrument = instruments[item.instrumentID]
        if (!instrument) return <></>
        const quote = quotes[item.instrumentID]
        const pnl = item.closeTime ? item.pnl : openPnlCal(item, quote)

        if (item.closeTime)
          return (
            <ClosedPositionItem
              colors={colors}
              key={index}
              position={item}
              currency={currency}
              isMargin={wallet.isMargin}
              instrument={instrument}
            />
          )

        return (
          <OpenPositionItem
            colors={colors}
            key={index}
            position={item}
            currency={currency}
            openPnL={pnl}
            updatable={false}
            isMargin={wallet.isMargin}
            instrument={instrument}
          />
        )
      })}
    </RecentTradesListSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  closedTrades: state.trades.closed,
  openTrades: state.trades.open,
  wallets: state.wallets,
  currencies: state.registry.data.availableCurrencies,
  instruments: state.instruments,
  quotes: state.quotes,
  checkedLots: state.trading.checkedLots,
})

export default connect(mapStateToProps)(RecentTradesList)
