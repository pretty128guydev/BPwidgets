import { Options } from 'highcharts/highstock'
import { IPieChartData } from '../../../core/interfaces/highcharts'

export const getChartOptions = (
  renderTo: HTMLDivElement,
  data: IPieChartData[]
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
  },
  plotOptions: {
    pie: {
      shadow: false,
      borderColor: '#1d2834',
      borderWidth: 2,
    },
  },
  legend: {
    width: '50%',
    align: 'left',
    verticalAlign: 'bottom',
    layout: 'vertical',
    itemMarginTop: 5,
    itemMarginBottom: 5,
    useHTML: true,
    symbolRadius: 0,
    itemStyle: {
      color: '#ffffff',
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'normal',
    },
    itemHoverStyle: {
      color: '#646e79',
    },
    labelFormatter: function (this: any) {
      const percent = (this.y / this.total) * 100
      const y = Math.round(percent * 10) / 10

      return `<div style="display: flex; justify-content: space-between; width: ${
        document.body.clientWidth * 0.1 - 30
      }px;">
					<div>${this.name}</div>
					<div style="color: #75f986; margin-left: 10px">${y}%</div>
				</div>`
    },
  },
  tooltip: {
    formatter() {
      return `
				<span style="display: block; margin-right: 2px; color: ${this.point.color}">\u25CF</span>
				<span>${this.point.name}</span>: <span style="font-weight: bold">${this.point.y}</span>`
    },
  },
  credits: {
    enabled: false,
  },
  series: [
    {
      type: 'pie',
      data,
      size: '100%',
      innerSize: '70%',
      showInLegend: true,
      dataLabels: {
        enabled: false,
      },
    },
  ],
})
