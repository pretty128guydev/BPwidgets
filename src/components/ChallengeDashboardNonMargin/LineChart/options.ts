import { ILineChartData } from '../../../core/interfaces/highcharts'

export const getChartOptions = (
  renderTo: HTMLDivElement,
  dataProfitTarget: ILineChartData[],
  dataEquity: ILineChartData[],
  dataDrawdownLimit: ILineChartData[],
  currencySymbol: string,
  categories: number[],
  min: number
): any => ({
  chart: {
    renderTo,
  },
  time: {
    useUTC: false,
  },
  title: {
    text: void 0,
  },
  yAxis: {
    title: {
      text: void 0,
    },
    labels: {
      format: `{value:,.0f}`,
      style: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'normal',
        fontSize: '9px',
      },
    },
    tickColor: '#263346',
    gridLineColor: '#263346',
    min,
  },
  xAxis: {
    tickColor: '#263346',
    lineColor: '#263346',
    labels: {
      format: '{value:%H:%M %d %b %Y}',
      style: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'normal',
        fontSize: '9px',
      },
    },
    type: 'datetime',
    categories,
  },
  legend: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom',
    borderWidth: 0,
    showInLegend: false,
    itemStyle: { color: '#ffffff' },
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    area: {
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 2,
        states: {
          hover: {
            enabled: true,
          },
        },
      },
    },
  },
  series: [
    {
      name: 'Profit Target',
      type: 'line',
      color: 'rgba(52, 112, 232, 1)',
      marker: {
        fillColor: 'rgba(52, 112, 232, 1)',
        lineColor: 'rgba(52, 112, 232, 1)',
      },
      data: dataProfitTarget,
    },
    {
      name: 'Equity',
      type: 'area',
      color: '#75f986',
      fillColor: {
        linearGradient: [0, 0, 0, 200],
        stops: [
          [0, 'rgba(117, 249, 134, 0.5)'],
          [1, 'rgba(117, 249, 134, 0.05)'],
        ],
      },
      marker: {
        fillColor: 'rgba(117, 249, 134, 1)',
        lineColor: 'rgba(117, 249, 134, 1)',
      },
      data: dataEquity,
    },
    {
      name: 'Drawdown Limit',
      type: 'line',
      color: 'rgba(255, 0, 98, 1)',
      marker: {
        fillColor: 'rgba(255, 0, 98, 1)',
        lineColor: 'rgba(255, 0, 98, 1)',
      },
      data: dataDrawdownLimit,
    },
  ],
})
