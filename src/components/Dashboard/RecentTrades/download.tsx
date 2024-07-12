import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { RecentTradesDownload } from './styled'
import { LocaleDate } from '../../../core/localeFormatDate'
import { api } from '../../../core/createAPI'
import { TradeDirection } from '../../../models/instrument'
import { FakeData } from '../../../shares/fakeData'
import { openPnlCal } from '../../../core/utils'
import { IClosedTrade, IOpenTrade } from '../../../core/interfaces/trades'
import { AvailableCurrencies } from '../../../models/registry'
import { IInstrument, IWalletDetails } from '../../../core/API'
import { QuotesMap } from '../../../reducers/quotes'
import { formatCurrencyFn } from '../../../core/currency'

interface IDashboardRecentTradesProps {
  closedTrades: IClosedTrade[]
  openTrades: IOpenTrade[]
  currencies: AvailableCurrencies
  wallets: any
  instruments: IInstrument[]
  quotes: QuotesMap
  colors: any
  checkedLots: boolean
}

// const fetchTrades = async () => {
//   try {
//     const {
//       closed: { rows },
//     } = await api.fetchTrades()

//     return rows || []
//   } catch (err) {
//     console.log(err)
//   }
// }

const DashboardDownload = ({
  closedTrades,
  openTrades,
  currencies,
  wallets,
  instruments,
  quotes,
  colors,
  checkedLots,
}: IDashboardRecentTradesProps) => {
  // const colors = FakeData.theme
  const { wallets: wls, activeWallet } = wallets

  const onDownloadClick = async () => {
    // const trades = await fetchTrades()

    const trades = [...openTrades, ...closedTrades]
      .sort((a: any, b: any) => Number(a.tradeTime) - Number(b.tradeTime))
      .reverse()

    if (trades) {
      const universalBOM = '\uFEFF'
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        encodeURIComponent(
          universalBOM +
            'ID,' +
            'Open Time,' +
            'Close Time,' +
            'Direction,' +
            'Symbol,' +
            (checkedLots ? 'Lots,' : 'Units,') +
            'Amount,' +
            'Commission,' +
            'Swap,' +
            'P&L,' +
            'Net Result\n' +
            trades
              .map((item: any) => {
                if (!item.walletID || item.walletID !== activeWallet.walletID)
                  return []
                const wallet = wls.find(
                  (w: IWalletDetails) => w.walletID === item.walletID
                )
                const currency = currencies[wallet.baseCurrency]
                const instrument = instruments[item.instrumentID]
                if (!instrument) return []
                const quote = quotes[item.instrumentID]
                const pnlValue = item.closeTime
                  ? item.pnl
                  : openPnlCal(item, quote)

                return [
                  item.tradeID,
                  LocaleDate.format(item.tradeTime, 'dd/MM/u HH:mm'),
                  item.closeTime
                    ? LocaleDate.format(item.closeTime, 'dd/MM/u HH:mm')
                    : '',
                  item.direction === TradeDirection.up ? t`Buy` : t`Sell`,
                  item.instrumentName,
                  formatCurrencyFn(
                    checkedLots
                      ? item.units / instrument.contractSize
                      : item.units,
                    {
                      currencySymbol: '',
                      precision: 2,
                    },
                    false
                  ),
                  formatCurrencyFn(
                    item.stake,
                    {
                      currencySymbol: currency?.currencySymbol || '$',
                      precision: 2,
                    },
                    false
                  ),
                  formatCurrencyFn(
                    item.commission,
                    {
                      currencySymbol: currency?.currencySymbol || '$',
                      precision: 2,
                    },
                    false
                  ),
                  formatCurrencyFn(
                    item.swaps,
                    {
                      currencySymbol: currency?.currencySymbol || '$',
                      precision: 2,
                    },
                    false
                  ),
                  formatCurrencyFn(
                    pnlValue,
                    {
                      currencySymbol: currency?.currencySymbol || '$',
                      precision: 2,
                    },
                    false
                  ),
                  formatCurrencyFn(
                    pnlValue - item.swaps - item.commission,
                    {
                      currencySymbol: currency?.currencySymbol || '$',
                      precision: 2,
                    },
                    false
                  ),
                ]
              })
              .join('\n')
        )
      const link = document.createElement('a')
      link.setAttribute('href', csvContent)
      link.setAttribute('download', 'transactions.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <RecentTradesDownload
      colors={colors}
      onClick={() => onDownloadClick()}
    >{t`Download`}</RecentTradesDownload>
  )
}

const mapStateToProps = (state: any) => ({
  closedTrades: state.trades.closed,
  openTrades: state.trades.open,
  wallets: state.wallets,
  currencies: state.registry.data.availableCurrencies,
  instruments: state.instruments,
  quotes: state.quotes,
  colors: state.theme,
  checkedLots: state.trading.checkedLots,
})

export default connect(mapStateToProps)(DashboardDownload)
