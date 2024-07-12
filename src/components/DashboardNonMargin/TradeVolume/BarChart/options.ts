import { Options } from 'highcharts/highstock'

import { IPieChartData } from '../../../../core/interfaces/highcharts'

export const getChartOptions = (
  renderTo: HTMLDivElement,
  data: IPieChartData[],
  currencySymbol: string,
  colors: any
): Options => ({
  chart: {
    renderTo,
  },
  title: {
    text: void 0,
  },
  yAxis: {
    title: {
      text: void 0,
    },
    labels: {
      format: `${currencySymbol} {value:,.0f}`,
      style: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'normal',
        fontSize: '10px',
        color: colors.primaryHue3,
      },
    },
    tickColor: colors.primaryHue3,
    gridLineColor: colors.primaryHue3,
  },
  xAxis: {
    tickColor: colors.primaryHue3,
    lineColor: colors.primaryHue3,
    labels: {
      style: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'normal',
        fontSize: '10px',
        color: colors.primaryHue3,
      },
    },
    type: 'datetime',
    tickInterval: 3600 * 1000 * 24,
  },
  tooltip: {
    formatter() {
      return `
				<span style="display: block; margin-right: 2px; color: ${this.point.color}">\u25CF</span>
				<span>${this.point.name}</span>: <span style="font-weight: bold">${this.point.y}</span>`
    },
  },
  plotOptions: {
    column: {
      borderWidth: 0,
    },
  },
  legend: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      type: 'column',
      data,
    },
  ],
})
