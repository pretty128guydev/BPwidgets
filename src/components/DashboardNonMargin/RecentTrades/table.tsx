import React from 'react'
import { connect } from 'react-redux'
import { IClosedTrade, IOpenTrade } from '../../../core/interfaces/trades'
import { t } from 'ttag'
import {
  RecentTradesTableColumn,
  RecentTradesTableHeader,
  RecentTradesTableRow,
  RecentTradesTableSpace,
  RecentTradesTableTBody,
  RecentTradesTableTHead,
} from './styled'
import { LocaleDate } from '../../../core/localeFormatDate'
import { AvailableCurrencies } from '../../../models/registry'
import { IInstrument, IWalletDetails } from '../../../core/API'
import { TradeDirection } from '../../../models/instrument'
import { openPnlCal } from '../../../core/utils'
import { QuotesMap } from '../../../reducers/quotes'
import { formatCurrencyFn } from '../../../core/currency'

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

const RecentTradesTable = ({
  colors,
  closedTrades,
  openTrades,
  currencies,
  wallets,
  instruments,
  quotes,
  checkedLots,
}: IRecentTradesTableProps) => {
  const trades = [...openTrades, ...closedTrades]
    .sort((a: any, b: any) => Number(a.tradeTime) - Number(b.tradeTime))
    .reverse()

  const { wallets: wls, activeWallet } = wallets

  return (
    <RecentTradesTableSpace>
      <RecentTradesTableTHead>
        <RecentTradesTableRow>
          <RecentTradesTableHeader colors={colors} widthPercent={6}>
            <span>{t`ID`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader colors={colors} widthPercent={11}>
            <span>{t`Open Time`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader colors={colors} widthPercent={11}>
            <span>{t`Close Time`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader
            colors={colors}
            widthPercent={9}
            className="text-center"
          >
            <span>{t`Direction`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader
            colors={colors}
            widthPercent={9}
            className="text-center"
          >
            <span>{t`Symbol`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader
            colors={colors}
            widthPercent={9}
            className="text-center"
          >
            <span>{checkedLots ? t`Lots` : t`Units`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader
            colors={colors}
            widthPercent={9}
            className="text-center"
          >
            <span>{t`Amount`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader
            colors={colors}
            widthPercent={9}
            className="text-center"
          >
            <span>{t`Commission`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader
            colors={colors}
            widthPercent={9}
            className="text-center"
          >
            <span>{t`Swap`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader
            colors={colors}
            widthPercent={9}
            className="text-center"
          >
            <span>{t`P&L`}</span>
          </RecentTradesTableHeader>
          <RecentTradesTableHeader
            colors={colors}
            widthPercent={9}
            className="text-center"
          >
            <span>{t`Net Result`}</span>
          </RecentTradesTableHeader>
        </RecentTradesTableRow>
      </RecentTradesTableTHead>
      <RecentTradesTableTBody className="scrollable">
        {trades.map((item: any, key) => {
          if (!item.walletID || item.walletID !== activeWallet.walletID)
            return <></>
          const wallet = wls.find(
            (w: IWalletDetails) => w.walletID === item.walletID
          )
          const currency = currencies[wallet.baseCurrency]
          const instrument = instruments[item.instrumentID]
          if (!instrument) return <></>
          const quote = quotes[item.instrumentID]
          const pnlValue = item.closeTime ? item.pnl : openPnlCal(item, quote)

          return (
            <RecentTradesTableRow key={key}>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={6}
                minWidth={50}
              >
                <span>{item.tradeID}</span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={11}
                minWidth={111}
              >
                <span>
                  {LocaleDate.format(item.tradeTime, 'dd/MM/u HH:mm')}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={11}
                minWidth={111}
              >
                <span>
                  {item.closeTime
                    ? LocaleDate.format(item.closeTime, 'dd/MM/u HH:mm')
                    : ''}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={9}
                minWidth={70}
                className="text-center"
              >
                <span
                  className={
                    item.direction === TradeDirection.up
                      ? 'high-color'
                      : 'low-color'
                  }
                  style={{ fontWeight: 'bold' }}
                >
                  <span className="icon-arrow-down">▾</span>
                  {item.direction === TradeDirection.up ? t`BUY` : t`SELL`}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={9}
                minWidth={70}
                className="text-center"
              >
                <span style={{ fontWeight: 'bold' }}>
                  {item.instrumentName}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={9}
                minWidth={70}
                className="text-center"
              >
                <span>
                  {formatCurrencyFn(
                    checkedLots
                      ? item.units / instrument.contractSize
                      : item.units,
                    {
                      currencySymbol: '',
                      precision: 2,
                    },
                    false
                  )}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={9}
                minWidth={70}
                className="text-center"
              >
                <span>
                  {formatCurrencyFn(item.stake, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  } as any)}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={9}
                minWidth={70}
                className="text-center"
              >
                <span>
                  {formatCurrencyFn(item.commission, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  } as any)}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={9}
                minWidth={70}
                className="text-center"
              >
                <span>
                  {formatCurrencyFn(item.swaps, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  } as any)}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={9}
                minWidth={70}
                className="text-center"
              >
                <span className={pnlValue >= 0 ? 'high-color' : 'low-color'}>
                  {formatCurrencyFn(pnlValue, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  } as any)}
                </span>
              </RecentTradesTableColumn>
              <RecentTradesTableColumn
                colors={colors}
                widthPercent={9}
                minWidth={70}
                className="text-center"
              >
                <span>
                  {formatCurrencyFn(pnlValue - item.swaps - item.commission, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  } as any)}
                </span>
              </RecentTradesTableColumn>
            </RecentTradesTableRow>
          )
        })}
      </RecentTradesTableTBody>
    </RecentTradesTableSpace>
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

export default connect(mapStateToProps)(RecentTradesTable)
