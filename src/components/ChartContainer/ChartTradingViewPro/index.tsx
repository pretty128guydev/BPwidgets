/* eslint-disable no-restricted-globals */
import * as React from 'react'
import './index.scss'
import {
  widget,
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  LayoutType,
  Bar,
} from '../../../charting_library_pro/charting_library'
import { connect } from 'react-redux'
import {
  reRenderTradingChart,
  subscribeOnStream,
  unsubscribeFromStream,
} from './datafeed/stream'
import { api } from '../../../core/createAPI'
import axios from 'axios'
import { chartPeriodOptions } from '../period'
import {
  compact,
  delay,
  filter,
  find,
  includes,
  // orderBy,
  sortBy,
  toLower,
  toNumber,
  // uniqBy,
} from 'lodash'
import {
  getInstrumentObject,
  lastPriceForSelectedInstrument,
  lastQuoteForSelectedInstrument,
  lastQuoteRiskForSelectedInstrument,
  lastQuotesRiskForChartInstruments,
} from '../../selectors/instruments'
import {
  actionSelectInstrument,
  actionSetDefaultLayout,
  actionSetChartsCount,
  actionSetActiveChartIndex,
  actionSetChartInstruments,
  actionSetChartHistory,
} from '../../../actions/trading'
import { IInstrument } from '../../../core/API'
import { IClosedTrade, IOpenTrade } from '../../../core/interfaces/trades'
import { formatCurrency } from '../../selectors/currency'
import ChartPositionInfo from '../ChartPositionInfo'
import { actionSetSelectedTrade } from '../../../actions/trades'
import Backdrop from '../../Backdrop'
import { t } from 'ttag'
import { renderPendingOrder } from './render-pending-order'
import { localeForChart } from '../../../core/i18n'
import UserStorage from '../../../core/UserStorage'
import { isLoggedIn } from '../../selectors/loggedIn'
import { convertHexToRGBA } from '../../../core/utils'
import { actionSetAppReady } from '../../../actions/registry'

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol']
  interval: ChartingLibraryWidgetOptions['interval']

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string
  libraryPath: ChartingLibraryWidgetOptions['library_path']
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
  clientId: ChartingLibraryWidgetOptions['client_id']
  userId: ChartingLibraryWidgetOptions['user_id']
  fullscreen: ChartingLibraryWidgetOptions['fullscreen']
  autosize: ChartingLibraryWidgetOptions['autosize']
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
  container: ChartingLibraryWidgetOptions['container']

  instrument: any
  trading: any
  state: any
  quote: any
  lastQuote: any
  actionSelectInstrument: (id: any) => void
  theme: any
  isMobile: boolean
  lastPrice: number | string
  openTrades: IOpenTrade[]
  formatCurrency: (value: number) => string
  actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => any
  currentInstrumentProps: IInstrument | null
  actionSetDefaultLayout: (layout: LayoutType) => void
  actionSetActiveChartIndex: (index: number) => void
  actionSetChartsCount: (count: number) => void
  actionSetChartInstruments: (instruments: IInstrument[]) => void
  defaultLayout: LayoutType
  isLoggedIn: boolean
  activeChartIndex: number
  chartInstrumentsLastQuote: any
  chartInstruments: IInstrument[]
  instruments: IInstrument[]
  onChartReady: (isChartReady: boolean) => void
  chartReady: boolean
  actionSetAppReady: (ready: boolean) => void
  actionSetChartHistory: (chartHistory: any) => void
}

export interface ChartContainerState {
  clientX: number
  clientY: number
  clickedTrade?: IOpenTrade
  showTradeInfo: boolean
  isChartReady: boolean
}

// Instruments id not existed: 5, 114, 117, 119, 334, 104, 280, 178
// const WATCH_LIST_INITIAL_IDS = [
//   1, 2, 3, 5, 116, 115, 118, 114, 117, 119, 139, 243, 248, 334, 18, 15, 113,
//   104, 7, 8, 281, 280, 127, 128, 178,
// ]

const DEFAULT_CHART_INSTRUMENT_IDS = [
  { id: 1, resolution: '15' },
  { id: 14, resolution: '240' },
  { id: 115, resolution: '1D' },
  { id: 139, resolution: '60' },
]

class ChartTradingViewPro extends React.PureComponent<
  Partial<ChartContainerProps>,
  ChartContainerState
> {
  public static defaultProps: Omit<ChartContainerProps, 'container'> = {
    symbol: '',
    interval: '1' as ResolutionString,
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/charting_library_pro/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    instrument: '',
    trading: null,
    state: null,
    quote: null,
    lastQuote: null,
    actionSelectInstrument: (id: any) => {},
    theme: null,
    isMobile: false,
    lastPrice: 0,
    openTrades: [],
    formatCurrency: (value: number) => '',
    actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => {},
    currentInstrumentProps: null,
    actionSetDefaultLayout: (layout: LayoutType) => {},
    actionSetActiveChartIndex: (index: number) => {},
    actionSetChartsCount: (count: number) => {},
    actionSetChartInstruments: (instruments: IInstrument[]) => {},
    defaultLayout: '4',
    isLoggedIn: false,
    activeChartIndex: 0,
    chartInstrumentsLastQuote: [],
    chartInstruments: [],
    instruments: [],
    onChartReady: (isChartReady: boolean) => {},
    chartReady: false,
    actionSetAppReady: (ready: boolean) => {},
    actionSetChartHistory: (chartHistory: any) => {},
  }

  private tvWidget: IChartingLibraryWidget | null = null
  private idPendingLine: any = null
  private ref: React.RefObject<HTMLDivElement> = React.createRef()
  private fetchCandlesCancelToken: any = {}
  private currentInstrument: string = ''

  public componentDidMount(): void {
    this.onInitChart()
  }

  public componentWillUnmount(): void {
    if (this.tvWidget !== null) {
      this.tvWidget.remove()
      this.tvWidget = null
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<Partial<ChartContainerProps>>,
    prevState: Readonly<ChartContainerState>,
    snapshot?: any
  ): void {
    if (this.currentInstrument !== this.props.instrument) {
      this.currentInstrument = this.props.instrument
      if (this.state?.isChartReady && this.props.currentInstrumentProps?.name) {
        this.tvWidget
          ?.activeChart()
          ?.setSymbol(this.props.currentInstrumentProps?.name, () =>
            this.props.activeChartIndex === prevProps.activeChartIndex
              ? this.tvWidget?.activeChart().resetData()
              : {}
          )
      }
    }

    try {
      if (prevProps.openTrades && this.props.openTrades) {
        if (prevProps.openTrades.length !== this.props.openTrades.length) {
          this.tvWidget?.activeChart().clearMarks()
          this.tvWidget?.activeChart().refreshMarks()
        }
      }

      if (
        prevProps.trading.tradeIfReachPending !==
          this.props.trading.tradeIfReachPending ||
        prevProps.trading.selectedDirection !==
          this.props.trading.selectedDirection ||
        prevProps.trading.pendingOrder !== this.props.trading.pendingOrder
      ) {
        this.idPendingLine = renderPendingOrder({
          colors: this.props.theme,
          selectedDirection: this.props.trading.selectedDirection,
          widget: this.tvWidget,
          pendingOrder: this.props.trading.pendingOrder,
          lastQuote: this.props.lastQuote,
          loadedChart: this.state.isChartReady,
          tradeIfReachPending: this.props.trading.tradeIfReachPending,
          precision: this.props.currentInstrumentProps?.precision,
          t,
        })
      }
    } catch (error) {
      console.error(error)
    }

    reRenderTradingChart(
      this.props.chartInstruments,
      this.props.chartInstrumentsLastQuote
    )
  }

  updateClickPosition = (mouseEvent: any) => {
    this.setState({
      clientX: mouseEvent.clientX,
      clientY: mouseEvent.clientY,
    })
  }

  updateSelectedTrade = (markId: number) => {
    const openTrades = this.props.openTrades

    const selected = find(openTrades, ['tradeID', markId])
    if (selected) {
      this.setState({ showTradeInfo: true, clickedTrade: selected })
      this.props.actionSetSelectedTrade &&
        this.props.actionSetSelectedTrade(selected)
    }
  }

  onInitChart = () => {
    if (!this.ref.current) {
      return
    }

    const instrument = find(this.props.trading?.instruments, [
      'instrumentID',
      this.props.instrument,
    ])

    const widgetOptions: any = {
      symbol: instrument?.name || '',
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      datafeed: this.DataFeed,
      interval: this.props.interval,
      container: this.ref.current,
      library_path: this.props.libraryPath as string,
      locale: localeForChart(),
      disabled_features: [
        'use_localstorage_for_settings',
        'trading_account_manager',
        'header_saveload',
        'right_toolbar',
        'order_panel',
        'popup_hints',
        'legend_context_menu',
        'header_symbol_search',
        'display_market_status',
        'create_volume_indicator_by_default',
        'create_volume_indicator_by_default_once',
      ],
      enabled_features: this.props.isMobile
        ? ['hide_left_toolbar_by_default']
        : [],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      // widgetbar: {
      //   details: false,
      //   news: false,
      //   watchlist: true,
      //   datawindow: true,
      //   watchlist_settings: {
      //     default_symbols: defaultSymbols,
      //   },
      // },
      overrides: {
        'paneProperties.legendProperties.showSeriesTitle': false,
        'mainSeriesProperties.candleStyle.wickUpColor':
          this.props.theme?.chart.candleStyle.wickUpColor,
        'mainSeriesProperties.candleStyle.borderUpColor':
          this.props.theme?.chart.candleStyle.borderUpColor,
        'mainSeriesProperties.candleStyle.upColor':
          this.props.theme?.chart.candleStyle.upColor,
        'mainSeriesProperties.candleStyle.wickDownColor':
          this.props.theme?.chart.candleStyle.wickDownColor,
        'mainSeriesProperties.candleStyle.borderDownColor':
          this.props.theme?.chart.candleStyle.borderDownColor,
        'mainSeriesProperties.candleStyle.downColor':
          this.props.theme?.chart.candleStyle.downColor,
        'mainSeriesProperties.areaStyle.color1': convertHexToRGBA(
          this.props.theme?.chart.areaStyle.color1,
          1
        ),
        'mainSeriesProperties.areaStyle.color2':
          this.props.theme?.chart.areaStyle.color2,
        'mainSeriesProperties.areaStyle.linecolor':
          this.props.theme?.chart.areaStyle.lineColor,
        'mainSeriesProperties.lineStyle.color':
          this.props.theme?.chart.lineStyle.color,
        'paneProperties.background':
          this.props.theme?.chart.paneProperties.background,
        'paneProperties.vertGridProperties.color':
          this.props.theme?.chart.paneProperties.verticalGridColor,
        'paneProperties.horzGridProperties.color':
          this.props.theme?.chart.paneProperties.horizontalGridColor,
        'scalesProperties.textColor':
          this.props.theme?.chart.paneProperties.textAxisChart,
      },
    }

    const tvWidget = new widget(widgetOptions)
    this.tvWidget = tvWidget

    tvWidget.onChartReady(() => {
      this.setState({ isChartReady: true })
      let myiFrame: any = document.querySelector(
        '.ChartTradingView > div > iframe'
      )
      if (myiFrame) {
        const background = this.props.theme?.chart.paneProperties.background
        const textAxisChart =
          this.props.theme?.chart.paneProperties.textAxisChart
        const primaryText = this.props.theme?.accentHue1
        const secondaryText = this.props.theme?.accentDefault
        const defaultText = this.props.theme?.accentHue2
        const panelBorder = this.props.theme?.backgroundHue3
        const chartToolbarHover = this.props.theme?.backgroundChartHue1
        const accentHue3 = this.props.theme?.accentHue3

        let doc = myiFrame.contentDocument
        const style = document.createElement('style')
        style.type = 'text/css'

        const css = `
          .container-pgo9gj31.with-highlight-pgo9gj31:hover, .container-pgo9gj31.with-highlight-pgo9gj31.focused-pgo9gj31 {
            --ui-lib-intent-highlight-color: ${primaryText} !important;
          }
          .layout-with-border-radius {
            background-color: ${panelBorder} !important;
          }
          .group-3e32hIe9, .fill-3e32hIe9 {
            background-color: ${background} !important;
          }
          .wrapper-5Xd5conM .input-5Xd5conM:checked+.box-5Xd5conM {
            background-color: ${primaryText} !important;
            border-color: ${primaryText} !important;
          }
          .fill-Kbdz4qEM, .group-T57LDNqT {
            background-color: ${background} !important;
          }
          .chart-controls-bar {
            background-color: ${background} !important;
            border-top-color: ${textAxisChart} !important;
          }
          .tab-DggvOZTm.active-DggvOZTm,
          .tab-DggvOZTm.active-DggvOZTm span,
          .button-xRobF0EE.size-small-xRobF0EE.color-brand-xRobF0EE.variant-primary-xRobF0EE {
            background-color: ${primaryText} !important;
            color: #ffffff !important;
            border-color: ${primaryText} !important;
          }
          .button-xRobF0EE.size-small-xRobF0EE.color-brand-xRobF0EE.variant-secondary-xRobF0EE {
            color: ${primaryText} !important;
            border-color: ${primaryText} !important;
            cursor: pointer;
          }
          .button-xRobF0EE.size-small-xRobF0EE.color-brand-xRobF0EE.variant-secondary-xRobF0EE:hover {
            color: #ffffff !important;
            border-color: ${primaryText} !important;
            background-color: ${primaryText} !important;
            cursor: pointer;
          }
          .inline-2yU8ifXU .isActive-2Vpz_LXc .js-button-text,
          .inline-2yU8ifXU .isActive-2Vpz_LXc .icon-2Vpz_LXc,
          .sliderRow-1emAA4_D.tabs-3I2ohC86 .isActive-3SbREAgE,
          .button-5-QHyx-s.isActive-5-QHyx-s  .icon-5-QHyx-s,
          .highlighted-1Qud56dI.highlightedText-ZzQNZGNo,
          .symbolTitle-ZzQNZGNo .highlighted-1Qud56dI,
          .title-1gYObTuJ .highlighted-1Qud56dI,
          .tab-1KEqJy8_.tab-3I2ohC86.active-3I2ohC86,
          .tab-1KEqJy8_.tab-3I2ohC86.active-3I2ohC86:hover,
          .tab-1KEqJy8_.withHover-1KEqJy8_:hover
          {
            color: ${primaryText} !important;
          }
          .day-3r0qUNSu.selected-3r0qUNSu.currentDay-3r0qUNSu,
          .item-2IihgTnv.withIcon-2IihgTnv.isActive-2IihgTnv,
          .centerElement-RnpzRzG6 .container-113jHcZc,
          .sliderRow-1emAA4_D.tabs-3I2ohC86 .slider-3I2ohC86.slider-3GYrNsPp .inner-3GYrNsPp,
          .dropdown-2R6OKuTS .item-2IihgTnv.isActive-2IihgTnv,
          .slider-3RfwXbxu.inner-3RfwXbxu,
          .item-2IihgTnv.isActive-2IihgTnv.hovered-2IihgTnv,
          .day-3r0qUNSu.selected-3r0qUNSu.isOnHighlightedEdge-3r0qUNSu,
          .day-3r0qUNSu.isOnHighlightedEdge-3r0qUNSu.currentDay-3r0qUNSu,
          .day-3r0qUNSu::after,
          .day-3r0qUNSu.isOnHighlightedEdge-3r0qUNSu,
          .day-3r0qUNSu.selected-3r0qUNSu,
          .inner-3RfwXbxu
          {
            background-color: ${primaryText} !important;
            border-color: ${primaryText} !important;
            color: #ffffff !important;
          }
          .box-2eXD4rIf.check-2eXD4rIf {
            background-color: ${background} !important;
            border-color: ${primaryText} !important;
            color: #ffffff !important;
          }
          .highlight-QDd7xRJ1.shown-QDd7xRJ1
          {
            border-color: ${primaryText} !important;
          }
          .day-3r0qUNSu.withinSelectedRange-3r0qUNSu {
            background-color: ${background} !important;
            border-color: ${background} !important;
            color: #ffffff !important;
          }
          .day-3r0qUNSu.currentDay-3r0qUNSu {
            color: #ffffff !important;
          }
          .inner-3e32hIe9 {
            background-color: ${panelBorder} !important;
          }
          .active-Zcmov9JL {
            background-color: ${background} !important;
          }
          .item-4TFSfyGO.isActive-4TFSfyGO {
            background-color: ${chartToolbarHover} !important;
            color: ${secondaryText} !important;
          }
          .color-brand-YKkCvwjV.variant-primary-YKkCvwjV {
            background-color: ${secondaryText} !important;
            border-color: ${secondaryText} !important;
          }
          .color-brand-YKkCvwjV.variant-secondary-YKkCvwjV {
            color: ${primaryText} !important;
            border-color: ${primaryText} !important;
          }
          .day-U9DgB4FB.selected-U9DgB4FB {
            background-color: ${chartToolbarHover} !important;
            color: ${primaryText} !important;
          }
          .container-pgo9gj31.focused-pgo9gj31 {
            border-color: ${primaryText} !important;
          }
          html.theme-dark:root, html.theme-light:root {
            --tv-color-toolbar-button-text-active: ${primaryText};
            --tv-color-toolbar-button-text-active-hover: ${primaryText};
            --tv-color-toolbar-toggle-button-background-active: ${chartToolbarHover};
            --tv-color-toolbar-toggle-button-background-active-hover: ${chartToolbarHover};
          }
          html.theme-dark .chart-page .chart-container.multiple.active:after,
          html.theme-light .chart-page .chart-container.multiple.active:after {
            border-color: ${primaryText} !important;
          }
          html.theme-dark .button-G7o5fBfa.isActive-G7o5fBfa .icon-G7o5fBfa,
          html.theme-light .button-G7o5fBfa.isActive-G7o5fBfa .icon-G7o5fBfa {
            color: ${primaryText} !important;
          }
          .toggleButton-5IlBhjdP:hover .arrow-68Nk42BD {
            stroke: ${defaultText} !important;
          }
          .background-68Nk42BD {
            cursor: pointer;
            fill: ${background} !important;
            stroke: ${defaultText} !important;
          }
          .background-68Nk42BD:hover {
            fill: ${secondaryText} !important;
            stroke: ${secondaryText} !important;
          }
          .arrow-68Nk42BD {
            stroke: ${primaryText} !important;
          }
          .button-G7o5fBfa,
          .button-9pA37sIi,
          .button-khcLBZEz,
          .item-G1QqQDLk,
          .button-wNyKS1Qc,
          .button-WhrIKIq9 {
            color: ${accentHue3} !important;
          }
          .button-G7o5fBfa:hover,
          .button-9pA37sIi:hover,
          .button-khcLBZEz:hover,
          .item-G1QqQDLk:hover,
          .button-wNyKS1Qc:hover,
          .button-WhrIKIq9:hover {
            color: ${secondaryText} !important;
          }
          .button-G7o5fBfa:hover .bg-G7o5fBfa,
          .button-9pA37sIi.isInteractive-9pA37sIi:hover:before,
          .button-khcLBZEz:hover:before,
          .item-G1QqQDLk:hover:before,
          .button-wNyKS1Qc:hover:before,
          .button-WhrIKIq9:hover:before {
            background-color: ${chartToolbarHover} !important;
          }
          .button-khcLBZEz.isOpened-khcLBZEz.hover-khcLBZEz .button-9pA37sIi,
          .button-khcLBZEz.isOpened-khcLBZEz:active .button-9pA37sIi,
          .button-khcLBZEz.isOpened-khcLBZEz .button-9pA37sIi {
            color: ${secondaryText} !important;
          }
          .button-khcLBZEz.isOpened-khcLBZEz.hover-khcLBZEz:before,
          .button-khcLBZEz.isOpened-khcLBZEz:active:before,
          .button-khcLBZEz.isOpened-khcLBZEz:before {
            background-color: ${chartToolbarHover} !important;
          }
          .button-9pA37sIi.isInteractive-9pA37sIi.isOpened-9pA37sIi.hover-9pA37sIi,
          .button-9pA37sIi.isInteractive-9pA37sIi.isOpened-9pA37sIi:active,
          .button-9pA37sIi.isInteractive-9pA37sIi.isOpened-9pA37sIi {
            color: ${secondaryText} !important;
          }
          .button-9pA37sIi.isInteractive-9pA37sIi.isOpened-9pA37sIi.hover-9pA37sIi:before,
          .button-9pA37sIi.isInteractive-9pA37sIi.isOpened-9pA37sIi:active:before,
          .button-9pA37sIi.isInteractive-9pA37sIi.isOpened-9pA37sIi:before {
            background-color: ${chartToolbarHover} !important;
          }
          .item-4TFSfyGO:hover, .item-tPYeYcJa.interactive-tPYeYcJa:hover,
          .container-FkkXGK5n:not(.disabled-FkkXGK5n):hover,
          .flagWrap-7I0uFLqE:hover {
            color: ${secondaryText} !important;
            background-color: ${chartToolbarHover} !important;
          }
          .title-hoa11YwL, .item-9Mqd4dY6, .shortcut-4TFSfyGO {
            color: ${primaryText} !important;
          }
          .item-9Mqd4dY6:hover {
            color: ${secondaryText} !important;
          }
          .item-4TFSfyGO:hover .title-hoa11YwL, .item-tPYeYcJa.interactive-tPYeYcJa:hover .title-hoa11YwL {
            color: ${secondaryText} !important;
          }
          .button-G7o5fBfa.isTransparent-G7o5fBfa.isActive-G7o5fBfa:hover .icon-G7o5fBfa {
            color: ${secondaryText} !important;
          }
          .arrow-m5d9X7vB:hover {
            color: ${secondaryText} !important;
            background-color: ${chartToolbarHover} !important;
          }
          .control-m5d9X7vB:hover .arrow-m5d9X7vB.hover-m5d9X7vB {
            background-color: ${chartToolbarHover} !important;
          }
          .button-G7o5fBfa:hover .bg-G7o5fBfa,
          .button-9pA37sIi.isInteractive-9pA37sIi:hover:before,
          .button-khcLBZEz:hover:before,
          .item-G1QqQDLk:hover:before,
          .button-wNyKS1Qc:hover:before,
          .button-WhrIKIq9:hover:before,
          .tab-Zcmov9JL:hover {
            background-color: ${chartToolbarHover} !important;
          }
          .tab-Zcmov9JL:hover, .title-24x04noU {
            color: ${primaryText} !important;
          }
          .item-4TFSfyGO, .item-tPYeYcJa.interactive-tPYeYcJa, .footer-C0oTZgbU {
            color: ${primaryText} !important;
            background-color: ${background} !important;
          }
          .wrapper-5Xd5conM .input-5Xd5conM:checked+.box-5Xd5conM.check-5Xd5conM .icon-5Xd5conM {
            stroke: ${primaryText} !important;
          }
          .tv-floating-toolbar {
            color: ${primaryText} !important;
            background-color: ${background} !important;
            border-color: ${background} !important;
          }
          .floating-toolbar-react-widgets__button {
            border-left-color: ${background} !important;
          }
          .item-4TFSfyGO:hover, .item-tPYeYcJa.interactive-tPYeYcJa:hover {
            background-color: ${chartToolbarHover} !important;
            color: ${secondaryText} !important;
          }
          .menuWrap-8MKeZifP {
            background-color: ${background} !important;
          }
          .dialog-Nh5Cqdeo, .calendar-U9DgB4FB, .month-U9DgB4FB .weekdays-U9DgB4FB {
            background-color: ${background} !important;
            color: ${primaryText} !important;
          }
          .title-tuOy5zvD, .title-eFiUyD3Z {
            color: ${primaryText} !important;
          }
          .tab-VabV7Fn8, .tab-Zcmov9JL {
            cursor: pointer;
            color: ${defaultText} !important;
          }
          .tab-rKFlMYkc.active-rKFlMYkc {
            color: ${primaryText} !important;
          }
          .slider-Q7h4o6oW .inner-Q7h4o6oW {
            background-color: ${secondaryText} !important;
          }
          .input-uGWFLwEy, .input-CcsqUMct {
            color: ${primaryText} !important;
          }
          .header-U9DgB4FB .switchBtn-U9DgB4FB:hover {
            background-color: ${chartToolbarHover} !important;
          }
          .header-U9DgB4FB .switchBtn-U9DgB4FB:hover path {
            stroke: ${secondaryText} !important;
          }
          .month-U9DgB4FB .weeks-U9DgB4FB .week-U9DgB4FB .day-U9DgB4FB:hover:not(.disabled-U9DgB4FB):not(.selected-U9DgB4FB) {
            background-color: ${chartToolbarHover} !important;
            color: ${primaryText} !important;
          }
          .marketType-uhHv1IHJ, .itemRow-uhHv1IHJ.multiLine-uhHv1IHJ .symbolDescription-uhHv1IHJ {
            color: ${primaryText} !important;
          }
          .itemRow-uhHv1IHJ:hover .cell-uhHv1IHJ {
            background-color: ${chartToolbarHover} !important;
          }
          .cell-uhHv1IHJ {
            border-bottom-color: ${chartToolbarHover} !important;
          }
          .item-LlwUhJDs, .wrap-LlwUhJDs.small-LlwUhJDs {
            background-color: ${background} !important;
          }
          .text-LlwUhJDs, .symbolDescription-uhHv1IHJ, .symbolTitle-uhHv1IHJ, .container-pgo9gj31 {
            color: ${primaryText} !important;
          }
          .wrap-hEebyvPo.dialog-hEebyvPo {
            background-color: ${chartToolbarHover} !important;
          }
          .wrap-hEebyvPo .title-hEebyvPo, .wrap-hEebyvPo .icon-hEebyvPo {
            color: ${secondaryText} !important;
          }
          .headerBottomSeparator-VabV7Fn8 {
            border-bottom-color: ${chartToolbarHover} !important;
          }
          .tabs-VabV7Fn8:before {
            background: ${chartToolbarHover} !important;
          }
          .footer-xe9kH1lJ, .content-26RvWdey {
            border-top-color: ${chartToolbarHover} !important;
          }
          .container-Zcmov9JL {
            border-right-color: ${chartToolbarHover} !important;
          }
          .separator-jtAq6E4V {
            background-color: ${chartToolbarHover} !important;
          }
          .container-CcsqUMct {
            border-top-color: ${chartToolbarHover} !important;
            border-bottom-color: ${chartToolbarHover} !important;
          }
          .inner-slot-QpAAIiaV.interactive-QpAAIiaV {
            color: ${primaryText} !important;
          }
          .button-1ARG85Og:hover:not(.disabled-1ARG85Og) {
            background-color: ${chartToolbarHover} !important;
          }
          .time-axis canvas:last-child {
            border-top: 1px solid ${textAxisChart} !important;
          }
          .fixed-gear-MAhpkWoV {
            background-color: ${background} !important;
            border-top: 1px solid ${textAxisChart} !important;
          }
          .fixed-gear-MAhpkWoV canvas {
            display: none !important;
          }
          .fadeLeft-sfzcrPlH {
            background-image: linear-gradient(to left, ${convertHexToRGBA(
              background,
              0
            )}, ${background}) !important;
          }
          .fadeRight-sfzcrPlH {
            background-image: linear-gradient(to right, ${convertHexToRGBA(
              background,
              0
            )}, ${background}) !important;
          }
        `

        style.appendChild(document.createTextNode(css))

        const head = doc.head || doc.getElementsByTagName('head')[0]
        if (head) {
          head.appendChild(style)
        }

        if (!this.props.isMobile) {
          // this.tvWidget?.widgetbar().then((widgetbar) => {
          //   widgetbar?.hidePage('watchlist_details_news')
          // })

          this.tvWidget?.setLayout(
            (this.props.defaultLayout ?? '4') as LayoutType
          )

          const chartsCount = this.tvWidget?.chartsCount() || 4
          const instrumentsProps = Object.values(this.props?.instruments || {})
          const initialInstruments = new Array(chartsCount)

          Array.from(Array(chartsCount).keys()).forEach((idx) => {
            if (idx <= DEFAULT_CHART_INSTRUMENT_IDS.length - 1) {
              const index = DEFAULT_CHART_INSTRUMENT_IDS.length - 1 - idx
              const value = DEFAULT_CHART_INSTRUMENT_IDS[index]
              const { id, resolution } = value
              const instrument = find(instrumentsProps, ['instrumentID', id])
              initialInstruments[index] = instrument
              if (index <= chartsCount - 1)
                delay(() => {
                  this.tvWidget
                    ?.chart?.(index)
                    ?.setSymbol?.(instrument?.name as string, () => {
                      this.tvWidget
                        ?.chart?.(index)
                        ?.setResolution?.(resolution as ResolutionString)
                    })
                }, idx * 500)
            } else {
              const { id } = DEFAULT_CHART_INSTRUMENT_IDS[0]
              const instrument = find(instrumentsProps, ['instrumentID', id])
              initialInstruments[idx] = instrument
            }
            this.props?.actionSetChartInstruments?.(initialInstruments)
          })

          delay(() => {
            this.props?.onChartReady?.(true)
          }, chartsCount * 500)
        }

        if (this.props.isMobile) {
          this.props?.onChartReady?.(true)
        }

        setTimeout(() => {
          this.props.actionSetAppReady?.(true)
        }, 1000)

        delay(() => {
          if (this.props.trading.tradeIfReachPending)
            this.idPendingLine = renderPendingOrder({
              colors: this.props.theme,
              selectedDirection: this.props.trading.selectedDirection,
              widget: this.tvWidget,
              pendingOrder: this.props.trading.pendingOrder,
              lastQuote: this.props.lastQuote,
              loadedChart: this.state.isChartReady,
              tradeIfReachPending: this.props.trading.tradeIfReachPending,
              precision: this.props.currentInstrumentProps?.precision,
              t,
            })
        }, 500)
      }
    })

    this.tvWidget.subscribe('mouse_up', (event) => {
      this.updateClickPosition(event)
    })

    this.tvWidget.subscribe('onMarkClick', (markId) => {
      this.updateSelectedTrade(markId as number)
    })

    this.tvWidget.subscribe('panes_height_changed', () => {
      if (this.props.trading.tradeIfReachPending)
        this.idPendingLine = renderPendingOrder({
          colors: this.props.theme,
          selectedDirection: this.props.trading.selectedDirection,
          widget: this.tvWidget,
          pendingOrder: this.props.trading.pendingOrder,
          lastQuote: this.props.lastQuote,
          loadedChart: this.state.isChartReady,
          tradeIfReachPending: this.props.trading.tradeIfReachPending,
          precision: this.props.currentInstrumentProps?.precision,
          t,
        })
    })

    this.tvWidget.subscribe(
      'layout_about_to_be_changed',
      (layout: LayoutType) => {
        const chartsCount = this.tvWidget?.chartsCount() || 4
        UserStorage.setDefaultLayout(layout)
        UserStorage.setChartsCount(chartsCount)
        this.props.actionSetDefaultLayout?.(layout)
        this.props.actionSetChartsCount?.(chartsCount)
      }
    )

    this.tvWidget.subscribe('layout_changed', () => {
      if (this.props.chartReady) {
        const chartsCount = this.tvWidget?.chartsCount() || 4
        const instruments =
          compact(
            Array.from(Array(chartsCount).keys()).map((c) => {
              const symbol = this.tvWidget?.chart(c)?.symbol()?.toLowerCase()
              const instrument = Object.values(
                this.props?.instruments || {}
              ).find(({ name }) => name?.toLowerCase() === symbol)
              return instrument
            })
          ) || []
        this.props?.actionSetChartInstruments?.(instruments)
      }
    })

    this.tvWidget.subscribe('activeChartChanged', (index) => {
      if (this.props.chartReady) {
        this.props?.actionSetActiveChartIndex?.(index)
        const symbolName = this.tvWidget?.activeChart().symbol() || ''
        const instruments = this.props.trading?.instruments
        const selectedSymbol: IInstrument = instruments?.find(
          (inst: any) => inst?.name?.toLowerCase() === symbolName?.toLowerCase()
        )
        if (selectedSymbol) {
          this.props?.actionSelectInstrument?.(selectedSymbol.instrumentID)
          this.tvWidget?.activeChart().resetData()
        }
      }
    })
  }

  formatPeriod(period: string) {
    if (
      period.includes('h') ||
      period.includes('w') ||
      period.includes('d') ||
      period.includes('H') ||
      period.includes('W') ||
      period.includes('D')
    ) {
      return period
    } else {
      if (toNumber(period) >= 60) {
        return toNumber(period) / 60 + 'h'
      }
      return period + 'm'
    }
  }

  getPriceScale(precision: number) {
    let scale = ''
    for (let index = 0; index < precision; index++) {
      scale = `${scale}0`
    }
    return Number('1' + scale)
  }

  onFetchCandles = async (
    instrumentID: number,
    period: string,
    periodParams: { to: number; firstDataRequest: boolean }
  ) => {
    if (this.fetchCandlesCancelToken[instrumentID]) {
      this.fetchCandlesCancelToken[instrumentID].cancel(
        'Operation canceled due to new request.'
      )
    }

    const CancelToken = axios.CancelToken
    this.fetchCandlesCancelToken[instrumentID] = CancelToken.source()
    const periodFomarted = this.formatPeriod(period)
    const selectPeriod = find(chartPeriodOptions, [
      'period',
      toLower(periodFomarted),
    ])
    const { firstDataRequest } = periodParams

    let data

    if (firstDataRequest) {
      data = await api.chartHistory(
        instrumentID,
        selectPeriod?.period || '1m',
        1000,
        this.fetchCandlesCancelToken[instrumentID]
      )
    } else {
      data = await api.chartHistory(
        instrumentID,
        selectPeriod?.period || '1m',
        300,
        this.fetchCandlesCancelToken[instrumentID],
        periodParams.to
      )
    }

    this.props.actionSetChartHistory?.(data)

    this.fetchCandlesCancelToken[instrumentID] = null

    if (firstDataRequest) {
      return sortBy(
        filter(data?.aggs, (item) => item.timestamp),
        ['timestamp', 'asc']
      )
    } else {
      return sortBy(
        filter(
          data?.aggs,
          (item) => item.timestamp && item.timestamp < periodParams.to * 1000
        ),
        ['timestamp', 'asc']
      )
    }
  }

  lastBarsCache = new Map()
  supportedResolutions = ['1', '5', '15', '30', '1h', '2h', '4h', '1d']
  config: any = {
    supported_resolutions: this.supportedResolutions,
    exchanges: [],
    symbols_types: [],
    supports_marks: true,
  }
  DataFeed = {
    onReady: (cb: any) => {
      // const exchanges: any[] = orderBy(
      //   uniqBy(
      //     (this.props.trading?.instruments || []).map((inst: any) => ({
      //       value: inst.exchangeName.toUpperCase(),
      //       name: inst.exchangeName.toUpperCase(),
      //       desc: inst.exchangeName,
      //     })),
      //     ({ value }) => value
      //   ),
      //   'value',
      //   'asc'
      // )
      const exchanges = (this.props.trading?.instruments || []).map(
        (inst: any) => ({
          value: inst.name,
          name: inst.name,
          desc: inst.description,
        })
      )
      this.config.exchanges = exchanges
      setTimeout(() => cb(this.config), 0)
    },
    searchSymbols: (
      userInput: any,
      exchange: any,
      symbolType: any,
      onResultReadyCallback: any
    ) => {
      // const allSymbols = filter(
      //   this.props.trading?.instruments || [],
      //   ({ exchangeName }) => exchangeName.toUpperCase() === exchange
      // ).map((inst: any) => ({
      //   symbol: inst.name,
      //   full_name: inst.name,
      //   description: inst.description,
      //   exchange: inst.exchangeName.toUpperCase(),
      //   type: '',
      // }))
      let allSymbols = (this.props.trading?.instruments || []).map(
        (inst: any) => ({
          symbol: inst.name,
          full_name: inst.name,
          description: inst.description,
          exchange: '',
          type: '',
        })
      )
      const newSymbols = allSymbols.filter((symbol: any) => {
        const isFullSymbolContainsInput = includes(
          toLower(symbol.full_name),
          toLower(userInput)
        )
        return isFullSymbolContainsInput
      })
      onResultReadyCallback(newSymbols)
    },
    resolveSymbol: (
      symbolName: any,
      onSymbolResolvedCallback: (symbol: any) => void,
      onResolveErrorCallback: any
    ) => {
      setTimeout(() => {
        const instruments = this.props.trading?.instruments || []
        const oldInstrument = find(instruments, [
          'instrumentID',
          this.props.instrument,
        ])
        const instrument = instruments.find(
          ({ name }: { name: string }) =>
            name.toLowerCase() === symbolName.toLowerCase()
        )

        // expects a symbolInfo object in response
        if (
          symbolName?.toLowerCase() !== oldInstrument?.name?.toLowerCase() &&
          symbolName !== ''
        ) {
          const selectedSymbol: IInstrument = instruments?.find(
            (inst: any) => inst.name === symbolName
          )
          if (selectedSymbol && this.props.chartReady)
            this.props?.actionSelectInstrument?.(selectedSymbol.instrumentID)
        }
        const symbol_stub = {
          name: instrument?.name,
          description: instrument?.description,
          type: '',
          session: '24x7',
          timezone: 'Etc/UTC',
          ticker: '',
          // exchange: instrument?.exchangeName?.toUpperCase() || '',
          // listed_exchange: instrument?.exchangeName?.toUpperCase() || '',
          exchange: '',
          minmov: 1,
          minmove2: 0,
          pricescale: this.getPriceScale(instrument?.precision || 100),
          supported_resolution: this.supportedResolutions,
          data_status: 'streaming',
          visible_plots_set: true,
          has_weekly_and_monthly: false,
          volume_precision: 2,
          has_intraday: true,
          instrumentID: instrument?.instrumentID,
        }
        onSymbolResolvedCallback(symbol_stub)
      }, 0)
    },
    getBars: async (
      symbolInfo: any,
      resolution: string,
      periodParams: any,
      onHistoryCallback: (arg0: any[], arg1: { noData: boolean }) => void,
      onErrorCallback: (arg0: unknown) => void
    ) => {
      try {
        const data = await this.onFetchCandles(
          symbolInfo.instrumentID,
          resolution,
          periodParams
        )
        const bars = data.map((his: any) => {
          return {
            time: his.timestamp,
            open: his.open,
            high: his.high,
            low: his.low,
            close: his.close,
          }
        })
        if (bars.length === 0) {
          onHistoryCallback([], {
            noData: true,
          })
          return
        } else {
          if (periodParams.firstDataRequest) {
            this.lastBarsCache.delete(`${symbolInfo.full_name}${resolution}`)
            this.lastBarsCache.set(`${symbolInfo.full_name}${resolution}`, {
              ...bars,
            })
          }
          onHistoryCallback(bars, {
            noData: false,
          })
        }
      } catch (err) {
        onErrorCallback(err)
      }
    },
    subscribeBars: (
      symbolInfo: { full_name: any },
      resolution: any,
      onRealtimeCallback: any,
      subscribeUID: any,
      onResetCacheNeededCallback: any
    ) => {
      onResetCacheNeededCallback?.()
      subscribeOnStream(
        symbolInfo,
        resolution,
        (e: Bar) => {
          onRealtimeCallback(e)
          // const chartType = this.tvWidget?.chart?.().chartType?.()
          // const { open, close } = e
          // try {
          //   if (this.idPendingLine) {
          //     const pendingLine = this.tvWidget
          //       ?.chart()
          //       .getShapeById(this.idPendingLine)
          //     if (pendingLine) {
          //       if (chartType === 2) {
          //         pendingLine.setProperties({
          //           linecolor: this.props.theme?.chart.lineStyle.color,
          //           textcolor: this.props.theme?.chart.lineStyle.color,
          //         })
          //         return
          //       }
          //       if (chartType === 3) {
          //         pendingLine.setProperties({
          //           linecolor: this.props.theme?.chart.areaStyle.lineColor,
          //           textcolor: this.props.theme?.chart.areaStyle.lineColor,
          //         })
          //         return
          //       }
          //       if (close >= open) {
          //         pendingLine.setProperties({
          //           linecolor: this.props.theme?.chart.candleStyle.upColor,
          //           textcolor: this.props.theme?.chart.candleStyle.upColor,
          //         })
          //       } else {
          //         pendingLine.setProperties({
          //           linecolor: this.props.theme?.chart.candleStyle.downColor,
          //           textcolor: this.props.theme?.chart.candleStyle.downColor,
          //         })
          //       }
          //     }
          //   }
          // } catch (error) {}
        },
        subscribeUID,
        this.lastBarsCache.get(`${symbolInfo.full_name}${resolution}`)
      )
    },
    unsubscribeBars: (subscriberUID: any) => {
      unsubscribeFromStream(subscriberUID)
    },
    calculateHistoryDepth: (
      resolution: number,
      resolutionBack: any,
      intervalBack: any
    ) => {
      // while optional, this makes sure we request 24 hours of minute data at a time
      // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
      return resolution < 60
        ? { resolutionBack: 'D', intervalBack: '1' }
        : undefined
    },
    getMarks: (
      symbolInfo: any,
      startDate: any,
      endDate: any,
      onDataCallbacks: (arg0: any[]) => void,
      resolution: any
    ) => {
      const openTrades = this.props.openTrades

      let result = (openTrades || []).filter(
        (trade) => symbolInfo.name === trade.instrumentName
      )

      const upColor = this.props.theme?.chart.plotOptions.candlestick.upColor
      const downColor = this.props.theme?.chart.plotOptions.candlestick.color

      onDataCallbacks(
        result.map((item) => ({
          id: item.tradeID,
          time: item.tradeTime / 1000,
          color: {
            border: item.direction === 1 ? upColor : downColor,
            background: item.direction === 1 ? upColor : downColor,
          },
          text: '', //'▲',
          label: item.direction === 1 ? '▲' : '▼',
          labelFontColor: '#000000',
          minSize: 20,
        }))
      )
    },
    getTimeScaleMarks: (
      symbolInfo: any,
      startDate: any,
      endDate: any,
      onDataCallback: any,
      resolution: any
    ) => {},
    getServerTime: (cb: any) => {},
  }

  public render(): JSX.Element {
    return (
      <>
        <div className="trading-chart-header-mobile">
          <div className={'ChartTradingView'}>
            <div ref={this.ref}></div>
          </div>
        </div>
        {this.state?.showTradeInfo && !!this.state?.clickedTrade && (
          <>
            <ChartPositionInfo
              trade={this.state.clickedTrade}
              timeleft={5}
              x={this.state.clientX}
              y={Math.min(870, this.state.clientY + 50)}
              onClose={() => {
                this.setState({ showTradeInfo: false, clickedTrade: undefined })
              }}
            />
            <Backdrop
              onClick={() => {
                this.setState({ showTradeInfo: false, clickedTrade: undefined })
              }}
            />
          </>
        )}
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  instrument: state.trading.selected,
  currentInstrumentProps: getInstrumentObject(state),
  trading: state.trading,
  instruments: state.trading.instruments,
  quote: lastQuoteForSelectedInstrument(state),
  lastQuote: lastQuoteRiskForSelectedInstrument(state),
  chartInstrumentsLastQuote: lastQuotesRiskForChartInstruments(state),
  theme: state.theme,
  lastPrice: lastPriceForSelectedInstrument(state),
  openTrades: state.trades.open,
  formatCurrency: formatCurrency(state),
  defaultLayout: state.trading.defaultLayout,
  userInfo: state.account.userInfo,
  activeChartIndex: state.trading.activeChartIndex,
  isLoggedIn: isLoggedIn(state),
  chartInstruments: state.trading.chartInstruments,
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionSetSelectedTrade,
  actionSetDefaultLayout,
  actionSetChartsCount,
  actionSetActiveChartIndex,
  actionSetChartInstruments,
  actionSetAppReady,
  actionSetChartHistory,
})(ChartTradingViewPro)
