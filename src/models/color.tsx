export interface High {
  backgroundColor: string
  textColor: string
}

export interface Low {
  backgroundColor: string
  textColor: string
}

export interface Balloon {
  high: High
  low: Low
}

export interface XAxis {
  gridLineColor: string
  lineColor: string
}

export interface CountDown {
  filledColorUp: string
  filledColorMiddle: string
  filledColorDown: string
  normalColor: string
  textColor: string
  backgroundColor: string
}

export interface Crosshair {
  color: string
}

export interface YAxis {
  gridLineColor: string
  lineColor: string
}

export interface Series {
  markerFillColor: string
}

export interface Line {
  color: string
}

export interface Area {
  color: string
  linearGradientUp: string
  linearGradientDown: string
}

export interface Ohlc {
  color: string
}

export interface Candlestick {
  color: string
  lineColor: string
  upColor: string
  upLineColor: string
}

export interface Flags {
  backgroundColor: string
  closedColor: string
  breakEvenColor: string
}

export interface PlotOptions {
  line: Line
  area: Area
  ohlc: Ohlc
  candlestick: Candlestick
  flags: Flags
}

export interface Tooltip {
  backgroundColor: string
  color: string
}

export interface Navigator {
  seriesLineColor: string
  outlineColor: string
  maskFill: string
}

export interface PulseMarker {
  color: string
}

export interface PriceLine {
  color: string
}

export interface ExpiryLine {
  color: string
}

export interface DeadPeriodLine {
  color: string
}

export interface QuoteBand {
  upGradient0: string
  upGradient1: string
  downGradient0: string
  downGradient1: string
}

export interface Indicators {
  sma: string
  bb: string
  rsi: string
  macd: string
  aroon: string
  aroonoscillator: string
  dpo: string
  ema: string
  dema: string
  tema: string
  trix: string
  apo: string
  ppo: string
  roc: string
  wma: string
  linearRegression: string
  linearRegressionSlope: string
  linearRegressionIntercept: string
  linearRegressionAngle: string
  abands: string
  ao: string
  atr: string
  cci: string
  momentum: string
  pivotpoints: string
  pc: string
  priceenvelopes: string
  psar: string
}

export interface High2 {
  backgroundColor: string
  textColor: string
  highlight: string
  sellBackColor: string
}

export interface Low2 {
  backgroundColor: string
  textColor: string
  highlight: string
  sellBackColor: string
}

export interface TradeInfo {
  high: High2
  low: Low2
}

export interface Chart {
  balloon: Balloon
  xAxis: XAxis
  countDown: CountDown
  crosshair: Crosshair
  yAxis: YAxis
  series: Series
  plotOptions: PlotOptions
  tooltip: Tooltip
  navigator: Navigator
  pulseMarker: PulseMarker
  priceLine: PriceLine
  expiryLine: ExpiryLine
  deadPeriodLine: DeadPeriodLine
  quoteBand: QuoteBand
  plotBorderColor: string
  indicators: Indicators
  tradeInfo: TradeInfo
}

export interface Tradebox {
  background: string
  fieldBackground: string
  expiryBackground: string
  widgetBackground: string
  highText: string
  lowText: string
  highlowDepressedTextColor: string
  highActive: string
  highNormal: string
  highHover: string
  highDepressed: string
  lowActive: string
  lowNormal: string
  lowHover: string
  lowDepressed: string
  btnDisabled: string
  btnDisabledText: string
  btnNormal: string
  btnNormalText: string
  investmentButton: string
  marketPrice: string
  oneClickTradeText: string
}

export interface LeftPanel {
  itemBackground: string
}
export interface Colors {
  background: string
  panelBackground: string
  panelBorder: string
  modalBackground: string
  listBackgroundActive: string
  listBackgroundNormal: string
  sidebarBorder: string
  sidebarElementActive: string
  sidebarLabelText: string
  sidebarDisabled: string
  primary: string
  primaryText: string
  primaryTextContrast: string
  secondaryText: string
  secondarySubText: string
  fieldBackground: string
  textfieldText: string
  expiryGroupBackground: string
  assetsSelector: string
  chart: Chart
  payout: string
  secondary: string
  tradebox: Tradebox
  leftPanel?: LeftPanel
}

export interface FxColors {
  [props: string]: ColorFxPalette
  // primaryPalette: ColorFxPalette
  // accentPalette: ColorFxPalette
  // backgroundPalette: ColorFxPalette
  // winPalette: ColorFxPalette
  // breakEvenPalette: ColorFxPalette
  // lossPalette: ColorFxPalette
  // warnPalette: ColorFxPalette
  // upPalette: ColorFxPalette
  // downPalette: ColorFxPalette
  // dark: boolean
}

export interface ColorFxPalette {
  name: string
  hues: Hues
  colors: ColorValues
}

export interface Hues {
  default: string
  'hue-1': string
  'hue-2': string
  'hue-3': string
}

export interface ColorValues {
  '50': string
  '100': string
  '200': string
  '300': string
  '400': string
  '500': string
  '600': string
  '700': string
  '800': string
  '900': string
  A100: string
  A200: string
  A400: string
  A700: string
  contrastDefaultColor: string
}
