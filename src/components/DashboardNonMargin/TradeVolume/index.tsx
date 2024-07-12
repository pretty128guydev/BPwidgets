import React from 'react'
import { connect } from 'react-redux'
import { DashboardTradeVolumeSpace, TradeVolumeInfo } from './styled'
import TradeVolumeChart from './chart'
import {
  DashboardCardName,
  DashboardCardValue,
  DashboardCardWrapper,
} from '../styled'
import { t } from 'ttag'
import { IDashboardTrades } from '../interfaces'
import { formatCurrency } from '../../selectors/currency'
import { FakeData } from '../../../shares/fakeData'

interface IDashboardTradeVolumeProps {
  colors: any
  isMobile: boolean
  trades: IDashboardTrades
  formatCurrency: (input: number) => string
}

const DashboardTradeVolume = ({
  colors,
  isMobile,
  trades,
  formatCurrency,
}: IDashboardTradeVolumeProps) => {
  // const colors = FakeData.theme

  const { tradedVolume, totalTrades } = Object.values(
    trades.byDateWithOffset.dates
  ).reduce(
    (prev, curr) => {
      return {
        tradedVolume: prev.tradedVolume + curr.volume,
        totalTrades: prev.totalTrades + curr.count,
      }
    },
    { tradedVolume: 0, totalTrades: 0 }
  )

  const openTradesCount = Object.values(
    trades.byInstrumentId.openedTrades
  ).reduce((prev, curr) => {
    return prev + curr.count
  }, 0)

  const closedTradesCount = Object.values(
    trades.byInstrumentId.closedTrades
  ).reduce((prev, curr) => {
    return prev + curr.count
  }, 0)

  return (
    <DashboardTradeVolumeSpace isMobile={isMobile}>
      <TradeVolumeChart trades={trades.byDateWithOffset.dates} />
      <TradeVolumeInfo isMobile={isMobile}>
        <DashboardCardWrapper colors={colors}>
          <DashboardCardName
            colors={colors}
          >{t`total traded volume`}</DashboardCardName>
          <DashboardCardValue
            color={colors.secondaryText}
            style={{ opacity: 0.8 }}
          >
            {formatCurrency(tradedVolume)}
          </DashboardCardValue>
        </DashboardCardWrapper>
        <DashboardCardWrapper colors={colors}>
          <DashboardCardName
            colors={colors}
          >{t`number of trades`}</DashboardCardName>
          <DashboardCardValue
            color={colors.secondaryText}
            style={{ opacity: 0.8 }}
          >
            {closedTradesCount} / {openTradesCount}
          </DashboardCardValue>
        </DashboardCardWrapper>
        <DashboardCardWrapper colors={colors}>
          <DashboardCardName
            colors={colors}
          >{t`average volume`}</DashboardCardName>
          <DashboardCardValue
            color={colors.secondaryText}
            style={{ opacity: 0.8 }}
          >
            {formatCurrency(tradedVolume / totalTrades)}
          </DashboardCardValue>
        </DashboardCardWrapper>
      </TradeVolumeInfo>
    </DashboardTradeVolumeSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
  formatCurrency: formatCurrency(state),
})

export default connect(mapStateToProps)(DashboardTradeVolume)
