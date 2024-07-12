import React from 'react'
import { connect } from 'react-redux'
import { DashboardRecentTradesSpace } from './styled'
import { DashboardCardTitle } from '../styled'
import { t } from 'ttag'
import RecentTradesTable from './table'
import RecentTradesList from './list'
import { actionLoadMoreClosedTradesRequest } from '../../../actions/trades'
import { IClosedTrade, IOpenTrade } from '../../../core/interfaces/trades'
import DashboardDownload from './download'

interface IDashboardRecentTradesProps {
  colors: any
  isMobile: boolean
  closedTrades: IClosedTrade[]
  openTrades: IOpenTrade[]
  actionLoadMoreClosedTradesRequest: () => void
}

const DashboardRecentTrades = ({
  colors,
  isMobile,
  closedTrades,
  openTrades,
  actionLoadMoreClosedTradesRequest,
}: IDashboardRecentTradesProps) => {
  const Content = isMobile ? RecentTradesList : RecentTradesTable

  return (
    <DashboardRecentTradesSpace colors={colors} isMobile={isMobile}>
      <DashboardCardTitle colors={colors}>
        <span>{t`Recent Trades`}</span>
        <DashboardDownload />
      </DashboardCardTitle>
      <Content />
    </DashboardRecentTradesSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
  closedTrades: state.trades.closed,
  openTrades: state.trades.open,
})

export default connect(mapStateToProps, { actionLoadMoreClosedTradesRequest })(
  DashboardRecentTrades
)
