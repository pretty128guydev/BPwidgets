/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { DashboardTopTradedAssetsSpace } from './styled'
import { DashboardCardTitle } from '../styled'
import { t } from 'ttag'

import DonutChart from './DonutChart'
import { IDashboardTradeInstrument } from '../interfaces'
import { IInstrument } from '../../../core/API'
import { IPieChartData } from '../../../core/interfaces/highcharts'

interface IDashboardTopTradesAssetsProps {
  colors: any
  isMobile: boolean
  instruments: IInstrument[] | any
  trades: IDashboardTradeInstrument
}

const DashboardTopTradesAssets = ({
  colors,
  isMobile,
  trades,
  instruments,
}: IDashboardTopTradesAssetsProps) => {
  const [chartData, setChartData] = useState<IPieChartData[] | null>(null)

  useEffect(() => {
    const { closedTrades = {}, openedTrades = {} } = trades

    const allTrades: string[] = [
      ...new Set([...Object.keys(closedTrades), ...Object.keys(openedTrades)]),
    ] as string[]

    const tradesData: IPieChartData[] = allTrades
      .map((key: string) => {
        const instrument: IInstrument = instruments.find(
          (instrument: IInstrument) => instrument.instrumentID === Number(key)
        )
        const openedTradesCount: number = openedTrades[key]?.count || 0
        const closedTradesCount: number = closedTrades[key]?.count || 0

        return {
          name: instrument?.name as string,
          y: openedTradesCount + closedTradesCount,
        }
      }, [])
      .sort((first, second) => second.y - first.y)

    const topTrades = tradesData.splice(0, 5)
    const otherTrades = tradesData.reduce(
      (prev, curr) => {
        return { ...prev, y: prev.y + curr.y }
      },
      { name: t`Other`, y: 0 }
    )

    if (otherTrades.y !== 0) {
      topTrades.push(otherTrades)
    }
    setChartData(topTrades)
  }, [trades])

  return (
    <DashboardTopTradedAssetsSpace colors={colors} isMobile={isMobile}>
      <DashboardCardTitle
        colors={colors}
      >{t`Top traded assets`}</DashboardCardTitle>
      <DonutChart data={chartData as IPieChartData[]} isMobile={isMobile} />
    </DashboardTopTradedAssetsSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
  instruments: Object.values(state.instruments),
})

export default connect(mapStateToProps)(DashboardTopTradesAssets)
