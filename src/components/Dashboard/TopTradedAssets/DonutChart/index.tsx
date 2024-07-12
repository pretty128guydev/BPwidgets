import React, { FC, useState, useEffect, useRef } from 'react'
import Highcharts, { Chart } from 'highcharts/highstock'

import { getChartOptions } from './options'
import { IPieChartData } from '../../../../core/interfaces/highcharts'

interface ITopDonutChartProps {
  data: IPieChartData[]
  isMobile: boolean
}

const DonutChart: FC<ITopDonutChartProps> = ({ data, isMobile }) => {
  const chartContainer = useRef<HTMLDivElement | null>(null)
  const [, setChart] = useState<Chart | null>(null)

  useEffect(() => {
    if (chartContainer.current) {
      const donutChart = new Highcharts.Chart(
        getChartOptions(chartContainer.current, data, isMobile)
      )
      setChart(donutChart)
    }
  }, [data])

  return <div ref={chartContainer}></div>
}

export default DonutChart
