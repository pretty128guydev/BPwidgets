import React, { FC, useState, useEffect, useRef } from 'react'
import Highcharts, { Chart } from 'highcharts/highstock'

import { getChartOptions } from './options'
import { ILineChartData } from '../../../core/interfaces/highcharts'
import {
  IChallengeDashboardData,
  IChallengeDashboardHistory,
} from '../../Dashboard/interfaces'

const calculateLineChartData = (
  challengeDashboard: IChallengeDashboardData,
  color: string,
  isStatic?: boolean,
  value?: number
) => {
  const { history } = challengeDashboard

  return history.map((item: IChallengeDashboardHistory) => {
    const { startEquity } = item

    return {
      y: isStatic ? value : parseFloat(Number(startEquity).toFixed(2)),
    }
  })
}

interface ILineChartProps {
  challengeDashboard: IChallengeDashboardData
  currencySymbol: string
}

const LineChart: FC<ILineChartProps> = ({
  challengeDashboard,
  currencySymbol,
}) => {
  const chartContainer = useRef<HTMLDivElement | null>(null)
  const [, setChart] = useState<Chart | null>(null)

  useEffect(() => {
    if (chartContainer.current) {
      const { history, state } = challengeDashboard
      const { profitGoalPct, initialBalance, maxTotalLossPct } = state
      const dataProfitTarget: ILineChartData[] = calculateLineChartData(
        challengeDashboard,
        'rgba(52, 112, 232, 1)',
        true,
        parseFloat(
          (
            (Number(profitGoalPct) * Number(initialBalance)) / 100 +
            Number(initialBalance)
          ).toFixed(2)
        )
      )
      const dataEquity: ILineChartData[] = calculateLineChartData(
        challengeDashboard,
        'rgba(117, 249, 134, 1)'
      )
      const dataDrawdownLimit: ILineChartData[] = calculateLineChartData(
        challengeDashboard,
        'rgba(255, 0, 98, 1)',
        true,
        parseFloat(
          (
            Number(initialBalance) -
            (Number(initialBalance) * Number(maxTotalLossPct)) / 100
          ).toFixed(2)
        )
      )

      const categories = history.map((h: IChallengeDashboardHistory) => {
        const date = new Date(h.timeRange)

        return date.getTime()
      })

      const chart = new Highcharts.Chart(
        getChartOptions(
          chartContainer.current,
          dataProfitTarget,
          dataEquity,
          dataDrawdownLimit,
          currencySymbol,
          categories,
          ((100 - (Number(maxTotalLossPct) + 5)) * Number(initialBalance)) / 100
        )
      )
      setChart(chart)
    }
  }, [challengeDashboard, currencySymbol])

  return <div ref={chartContainer}></div>
}

export default LineChart
