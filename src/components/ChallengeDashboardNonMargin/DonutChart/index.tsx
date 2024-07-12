import React, { FC, useState, useEffect, useRef } from 'react'
import Highcharts, { Chart } from 'highcharts/highstock'
import { getChartOptions } from './options'
import { IPieChartData } from '../../../core/interfaces/highcharts'

interface ITopDonutChartProps {
  data: IPieChartData[]
}

const DonutChart: FC<ITopDonutChartProps> = ({ data }) => {
  const chartContainer = useRef<HTMLDivElement | null>(null)
  const [, setChart] = useState<Chart | null>(null)

  useEffect(() => {
    if (chartContainer.current) {
      const donutChart = new Highcharts.Chart(
        getChartOptions(chartContainer.current, data)
      )
      setChart(donutChart)
    }
  }, [data])

  return <div ref={chartContainer}></div>
}

export default DonutChart
