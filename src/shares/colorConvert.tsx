import { FxColors } from '../models/color'

export const getThemeColor = (
  fxColors: any,
  name: string,
  property: string
) => {
  if (fxColors[name].hues[property]) {
    return `#${fxColors[name].colors[fxColors[name].hues[property]]}`
  } else {
    return `#${fxColors[name].colors[property]}`
  }
}
export const convertFxThemeToColors = (fxColors: FxColors): any => {
  return {
    background: getThemeColor(fxColors, 'backgroundPalette', 'default'),
    panelBackground: getThemeColor(fxColors, 'backgroundPalette', 'hue-1'),
    headerSummaryBackground: getThemeColor(
      fxColors,
      'backgroundPalette',
      'hue-2'
    ),
    componentBackground: getThemeColor(fxColors, 'backgroundPalette', 'hue-3'),
    primaryButton: getThemeColor(fxColors, 'primaryPalette', 'default'),
    secondaryButton: getThemeColor(fxColors, 'primaryPalette', 'hue-1'),
    priceBuy: getThemeColor(fxColors, 'primaryPalette', 'default'),
    priceSell: getThemeColor(fxColors, 'primaryPalette', 'hue-1'),
    greyOut: getThemeColor(fxColors, 'primaryPalette', 'hue-2'),
    panelBorder: getThemeColor(fxColors, 'backgroundPalette', 'hue-3'),
    modalBackground: getThemeColor(fxColors, 'backgroundPalette', 'hue-3'),
    defaultText: getThemeColor(fxColors, 'accentPalette', 'hue-2'),
    primaryText: getThemeColor(fxColors, 'accentPalette', 'default'),
    secondaryText: getThemeColor(fxColors, 'accentPalette', 'hue-1'),
    listBackgroundActive: getThemeColor(fxColors, 'backgroundPalette', '100'),
    listBackgroundNormal: getThemeColor(fxColors, 'backgroundPalette', '100'),
    sidebarBorder: getThemeColor(fxColors, 'backgroundPalette', '100'),
    sidebarElementActive: getThemeColor(fxColors, 'accentPalette', 'default'),
    sidebarLabelText: getThemeColor(fxColors, 'accentPalette', 'A700'),
    sidebarDisabled: getThemeColor(fxColors, 'backgroundPalette', '100'),
    primary: getThemeColor(fxColors, 'accentPalette', 'default'),
    pnlText: getThemeColor(fxColors, 'accentPalette', 'hue-3'),
    backgroundDefault: getThemeColor(fxColors, 'backgroundPalette', 'default'),
    backgroundHue1: getThemeColor(fxColors, 'backgroundPalette', 'hue-1'),
    backgroundHue2: getThemeColor(fxColors, 'backgroundPalette', 'hue-2'),
    backgroundHue3: getThemeColor(fxColors, 'backgroundPalette', 'hue-3'),
    backgroundChartDefault: getThemeColor(
      fxColors,
      'backgroundChart',
      'default'
    ),
    backgroundChartHue1: getThemeColor(fxColors, 'backgroundChart', 'hue-1'),
    backgroundChartHue2: getThemeColor(fxColors, 'backgroundChart', 'hue-2'),
    backgroundChartHue3: getThemeColor(fxColors, 'backgroundChart', 'hue-3'),
    primaryDefault: getThemeColor(fxColors, 'primaryPalette', 'default'),
    primaryHue1: getThemeColor(fxColors, 'primaryPalette', 'hue-1'),
    primaryHue2: getThemeColor(fxColors, 'primaryPalette', 'hue-2'),
    primaryHue3: getThemeColor(fxColors, 'primaryPalette', 'hue-3'),
    accentDefault: getThemeColor(fxColors, 'accentPalette', 'default'),
    accentHue1: getThemeColor(fxColors, 'accentPalette', 'hue-1'),
    accentHue2: getThemeColor(fxColors, 'accentPalette', 'hue-2'),
    accentHue3: getThemeColor(fxColors, 'accentPalette', 'hue-3'),
    chartTradingViewPrimary: getThemeColor(
      fxColors,
      'accentPalette',
      'default'
    ),
    chartTradingViewBackground: getThemeColor(
      fxColors,
      'backgroundPalette',
      'default'
    ),
    chartBorder: getThemeColor(fxColors, 'backgroundChart', 'hue-2'),
    primaryTextContrast: getThemeColor(fxColors, 'backgroundPalette', '100'),
    secondarySubText: getThemeColor(fxColors, 'backgroundPalette', '100'),
    fieldBackground: getThemeColor(fxColors, 'backgroundPalette', 'hue-2'),
    expiryGroupBackground: getThemeColor(fxColors, 'backgroundPalette', '100'),
    assetsSelector: getThemeColor(fxColors, 'backgroundPalette', '100'),
    payout: getThemeColor(fxColors, 'backgroundPalette', '100'),
    secondary: getThemeColor(fxColors, 'backgroundPalette', '100'),
    textfieldText: getThemeColor(fxColors, 'accentPalette', 'hue-1'),
    chartToolbarHover: getThemeColor(fxColors, 'backgroundChart', 'hue-1'),

    chart: {
      candleStyle: {
        wickUpColor: getThemeColor(fxColors, 'chart', 'hue-1'),
        borderUpColor: getThemeColor(fxColors, 'chart', 'hue-1'),
        upColor: getThemeColor(fxColors, 'chart', 'hue-1'),
        wickDownColor: getThemeColor(fxColors, 'chart', 'hue-2'),
        borderDownColor: getThemeColor(fxColors, 'chart', 'hue-2'),
        downColor: getThemeColor(fxColors, 'chart', 'hue-2'),
      },
      areaStyle: {
        color1: getThemeColor(fxColors, 'chart', 'hue-3'),
        color2: getThemeColor(fxColors, 'chart', 'default'),
        lineColor: getThemeColor(fxColors, 'chart', 'default'),
      },
      lineStyle: {
        color: getThemeColor(fxColors, 'chart', 'default'),
      },
      paneProperties: {
        background: getThemeColor(fxColors, 'backgroundChart', 'default'),
        textAxisChart: getThemeColor(fxColors, 'backgroundChart', 'hue-3'),
        verticalGridColor: getThemeColor(fxColors, 'backgroundChart', 'hue-3'),
        horizontalGridColor: getThemeColor(
          fxColors,
          'backgroundChart',
          'hue-3'
        ),
      },
      balloon: {
        high: {
          backgroundColor: '#06141f',
          textColor: '#75f896',
        },
        low: {
          backgroundColor: '#06141f',
          textColor: '#ff0062',
        },
      },
      xAxis: {
        gridLineColor: '#263346',
        lineColor: '#263346',
      },
      countDown: {
        filledColorUp: '#75f986',
        filledColorMiddle: '#ffda47',
        filledColorDown: '#ff0062',
        normalColor: 'transparent',
        textColor: '#75f986',
        backgroundColor: '#06141f',
      },
      crosshair: {
        color: '#141f2c',
      },
      yAxis: {
        gridLineColor: '#263346',
        lineColor: '#263346',
      },
      series: {
        markerFillColor: '#FFFFFF',
      },
      plotOptions: {
        line: {
          color: '#75f986',
        },
        area: {
          color: '#75f986',
          linearGradientUp: 'rgba(117, 249, 134, 0.5)',
          linearGradientDown: 'rgba(117, 249, 134, 0)',
        },
        ohlc: {
          color: '#75f986',
        },
        candlestick: {
          color: '#ff3364',
          lineColor: '#ff3364',
          upColor: '#75f986',
          upLineColor: '#75f986',
        },
        flags: {
          backgroundColor: '#1d2834',
          closedColor: '#FFFFFF',
          breakEvenColor: '#FFFFFF',
        },
      },
      tooltip: {
        backgroundColor: '#06141f',
        color: '#ffffff',
      },
      navigator: {
        seriesLineColor: '#75f986',
        outlineColor: 'transparent',
        maskFill: '#141f2c',
      },
      pulseMarker: {
        color: '#75f986',
      },
      priceLine: {
        color: '#75f986',
      },
      expiryLine: {
        color: '#df6e6e',
      },
      deadPeriodLine: {
        color: '#75f986',
      },
      quoteBand: {
        upGradient0: 'rgba(117, 249, 134, 0)',
        upGradient1: 'rgba(117, 249, 134, 0.2)',
        downGradient0: 'rgba(255, 51, 100, 0)',
        downGradient1: 'rgba(255, 51, 100, 0.2)',
      },
      plotBorderColor: '#1d2834',
      indicators: {
        sma: '#7cb5ec',
        bb: '#7cb5ec',
        rsi: '#7cb5ec',
        macd: '#7cb5ec',
        aroon: '#7cb5ec',
        aroonoscillator: '#7cb5ec',
        dpo: '#7cb5ec',
        ema: '#7cb5ec',
        dema: '#7cb5ec',
        tema: '#7cb5ec',
        trix: '#7cb5ec',
        apo: '#7cb5ec',
        ppo: '#7cb5ec',
        roc: '#7cb5ec',
        wma: '#7cb5ec',
        linearRegression: '#7cb5ec',
        linearRegressionSlope: '#7cb5ec',
        linearRegressionIntercept: '#7cb5ec',
        linearRegressionAngle: '#7cb5ec',
        abands: '#7cb5ec',
        ao: '#7cb5ec',
        atr: '#7cb5ec',
        cci: '#7cb5ec',
        momentum: '#7cb5ec',
        pivotpoints: '#7cb5ec',
        pc: '#7cb5ec',
        priceenvelopes: '#7cb5ec',
        psar: '#7cb5ec',
      },
      tradeInfo: {
        high: {
          backgroundColor: 'rgba(9, 50, 30, 1)',
          textColor: '#75f986',
          highlight: '#1d6b45',
          sellBackColor: '#75f986',
        },
        low: {
          backgroundColor: 'rgba(70, 23, 40, 1)',
          textColor: '#ff0062',
          highlight: '#61253a',
          sellBackColor: '#ff0062',
        },
      },
    },
    tradebox: {
      background: getThemeColor(fxColors, 'backgroundPalette', 'default'),
      fieldBackground: getThemeColor(fxColors, 'backgroundPalette', 'hue-2'),
      expiryBackground: getThemeColor(fxColors, 'backgroundPalette', 'default'),
      widgetBackground: '#1D2834',
      highText: getThemeColor(fxColors, 'upPalette', 'default'),
      lowText: getThemeColor(fxColors, 'downPalette', 'default'),
      highActive: getThemeColor(fxColors, 'primaryPalette', 'default'),
      highNormal: '#1d6b45',
      highHover:
        'linear-gradient(to bottom, rgba(117, 249, 134, 0.8), #3d9f5d 53%, #1d6b45)',
      lowActive: getThemeColor(fxColors, 'primaryPalette', 'hue-1'),
      lowNormal: '#61253a',
      lowHover:
        'linear-gradient(to bottom, rgba(255, 0, 98, 0.8), #a6154c 49%, #61253a)',
      btnDisabled: '#1d6b45',
      btnDisabledText: 'rgba(3, 20, 32, 0.8)',
      btnNormal: '#75f986',
      btnNormalText: '#031420',
      investmentButton: '#031420',
      marketPrice: '#031420',
      oneClickTradeText: '#A2A2A2',
    },
    leftPanel: {
      itemBackground: getThemeColor(fxColors, 'backgroundPalette', 'default'),
      textColor: getThemeColor(fxColors, 'accentPalette', 'default'),
    },
  }
}
