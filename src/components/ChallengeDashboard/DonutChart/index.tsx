import React, { FC, useState, useEffect, useRef } from 'react'
import Highcharts, { Chart } from 'highcharts/highstock'
import { getChartOptions } from './options'
import { IPieChartData } from '../../../core/interfaces/highcharts'
import { connect } from 'react-redux'

interface ITopDonutChartProps {
  data: IPieChartData[]
  theme: any
}

const DonutChart: FC<ITopDonutChartProps> = ({ data, theme }) => {
  const chartContainer = useRef<HTMLDivElement | null>(null)
  const [, setChart] = useState<Chart | null>(null)

  useEffect(() => {
    if (chartContainer.current) {
      const donutChart = new Highcharts.Chart(
        getChartOptions(chartContainer.current, data, theme)
      )
      setChart(donutChart)
    }
  }, [data])

  return <div ref={chartContainer}></div>
}

const mapStateToProps = (state: any) => ({ theme: state.theme })

export default connect(mapStateToProps)(DonutChart)
