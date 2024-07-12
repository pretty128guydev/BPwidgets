import { IInstrument, IRegistry, IUserInfo } from '../API'
import { LightstreamerClient, Subscription } from 'lightstreamer-client-web'
import { store } from '../../store'
import { actionSetTime } from '../../actions/time'
import { actionForceUpdateInstruments } from '../../actions/trading'
import { actionUpdateQuotes } from '../../actions/quotes'
import { IQuote } from '../../reducers/quotes'
import {
  actionMarkClosed,
  actionMovePendingOrderToOpen,
  actionRemovePendingOrder,
  actionRefreshTrades,
} from '../../actions/trades'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import {
  actionGuestDemoExpired,
  actionRefreshAccount,
} from '../../actions/account'
import { actionRefreshWallets } from '../../actions/wallets'
import {
  actionShowNotification,
  NotificationTypes,
} from '../../actions/notifications'
import { PnlNotificationProps } from '../../components/notifications/TradeSubmit/interfaces'
import { isNaN, isNumber } from 'lodash'

/**
 * Main feed singleton class
 * Implemented as a singleton to be one item per window holding subscription state
 */
class LSFeed {
  private static instance: LSFeed

  /**
   * Call once, access everywhere
   */
  public static initialize(data: IRegistry) {
    const instance = new LSFeed(data)
    instance.connect()
    LSFeed.instance = instance
  }
  public static getInstance = (): LSFeed => LSFeed.instance

  registry: IRegistry
  assetsInitialized: boolean
  topPicksInitialized: boolean
  LS: any
  currentInstrumentSubscription: any
  currentDistancesSubscription: any
  quoteUpdateList: IQuote[]
  lastQuotesUpdate: number
  firstInitRiskFactor = true
  currentRiskFactorSubscription: any
  constructor(registry: IRegistry) {
    this.registry = registry
    LSFeed.instance = this
    this.assetsInitialized = false
    this.topPicksInitialized = false
    this.LS = new LightstreamerClient(`https://${this.registry.lsHost}`, 'ts')

    // Aggregated update
    this.quoteUpdateList = []
    this.lastQuotesUpdate = 0
  }

  /**
   * Initial method which will be called in saga after registry will be loaded
   * @param registry
   */
  public connect = () => {
    this.LS.connect()
    this.LS.subscribe(this.getClockSubscription())
    this.LS.subscribe(this.getAssetsSubscription())
    this.LS.subscribe(this.getToppicksSubscription())
  }

  /**
   * Personal subscriptions
   * GuestDemo subscription will be called in different call
   */
  public userSubscriptions = (practiceMode: boolean, userID: any) => {
    this.LS.subscribe(this.getTradesSubscription(practiceMode, userID))
    this.LS.subscribe(this.getOpenTradeSubscription(userID))

    if (practiceMode) {
      this.LS.subscribe(this.getPracticeSubscription(userID))
    }
  }

  /**
   * Log response
   * @param args
   */
  noop = (...args: any) => console.log(args)

  /**
   * Subscriptions
   */
  getGuestDemoSubscription = () => {
    const demoAccountID = localStorage.getItem('demoAccountID')
    const subscription = new Subscription(
      'MERGE',
      [`demo_status_${demoAccountID}`],
      ['time', 'status']
    )
    subscription.setDataAdapter('demo')
    subscription.addListener({
      onItemUpdate: this.onGuestDemo,
    })

    this.LS.subscribe(subscription)
    return
  }

  getTradesSubscription = (practiceMode: boolean, userID: string): any => {
    const prefix = practiceMode ? 'practice_' : ''
    const subscription = new Subscription(
      'RAW',
      [`${prefix}trades_${userID}`],
      ['trades', 'time']
    )
    subscription.setDataAdapter('trades')
    subscription.addListener({
      onItemUpdate: this.onTrades,
    })

    return subscription
  }

  getOpenTradeSubscription = (userID: string) => {
    const subscription = new Subscription(
      'RAW',
      [`open_trades_${userID}`],
      ['trade', 'time']
    )
    subscription.setDataAdapter('open_trades')
    subscription.addListener({ onItemUpdate: this.noop })

    return subscription
  }

  getToppicksSubscription = (): any => {
    const subscription = new Subscription(
      'MERGE',
      [`site${this.registry.siteID}`],
      ['time']
    )
    subscription.setDataAdapter('toppicks')
    subscription.addListener({
      onItemUpdate: this.onTopPicks,
    })

    return subscription
  }

  getPracticeSubscription(userID: any): any {
    const subscription = new Subscription(
      'MERGE',
      [`practice_status_${userID}`],
      ['time', 'status']
    )
    subscription.setDataAdapter('practice')
    subscription.addListener({
      onItemUpdate: this.onPracticeUpdate,
    })

    return subscription
  }

  getAssetsSubscription = (): any => {
    const subscription = new Subscription(
      'MERGE',
      [`site${this.registry.siteID}`],
      ['time']
    )
    subscription.setDataAdapter('assets')
    subscription.addListener({
      onItemUpdate: this.onHandleAssets,
    })

    return subscription
  }

  getClockSubscription = (): any => {
    const subscription = new Subscription('MERGE', ['clock'], ['time'])
    subscription.setDataAdapter('clock')
    subscription.addListener({
      onItemUpdate: this.onSetClock,
    })

    return subscription
  }

  getQuotesSubscription = (instruments: IInstrument[]): any => {
    const items: string[] = instruments.map(
      (instrument: IInstrument) => `item${instrument.instrumentID}`
    )
    const subscription = new Subscription('MERGE', items, [
      'lastPrice',
      'time',
      'high',
      'low',
      'open',
      'bid',
      'ask',
    ])
    subscription.setDataAdapter('quotes')
    subscription.addListener({
      onItemUpdate: this.onQuote,
    })
    return subscription
  }

  getDistancesSubscription = (id: any): any => {
    const distanceInstrumentIDs: string[] = [`distance_${id}`]
    const subscription = new Subscription('MERGE', distanceInstrumentIDs, [
      'distance',
      'time',
    ])
    subscription.setDataAdapter('distance')
    subscription.addListener({
      onItemUpdate: this.onDistance,
    })

    return subscription
  }

  getOpenPendingOrdersSubscription = (userID: string): any => {
    const subscription = new Subscription(
      'RAW',
      [`open_orders_${userID}`],
      ['time', 'trades']
    )

    subscription.setDataAdapter('trades')
    subscription.addListener({
      onItemUpdate: this.handleOpenPendingOrders,
    })

    return subscription
  }

  getCancelledPendingOrdersSubscription = (userID: string): any => {
    const subscription = new Subscription(
      'RAW',
      [`cancel_orders_${userID}`],
      ['time', 'trades']
    )

    subscription.setDataAdapter('trades')
    subscription.addListener({
      onItemUpdate: this.handleCancelledPendingOrders,
    })

    return subscription
  }

  /**
   * Adapters
   */
  onSetClock = (itemUpdate: any): void => {
    const time = +itemUpdate.getValue('time')
    if (time) {
      store.dispatch(actionSetTime(time))
    }
  }

  /**
   * Fetch assets from CDN when received this event
   * Usually this means that risk department changes something
   * and to avoid overload of fetchAdvanced we should go to CDN
   *
   * assetsInitialized - don't go to CDN on first event
   */
  onHandleAssets = (itemUpdate: any) => {
    if (this.assetsInitialized) {
      const timestamp = itemUpdate.getValue('time')
      if (timestamp) {
        store.dispatch(actionForceUpdateInstruments(timestamp))
      }
    } else {
      this.assetsInitialized = true
    }
  }

  onQuote = (itemUpdate: any) => {
    const itemName = itemUpdate.getItemName()
    const last = parseFloat(itemUpdate.getValue('lastPrice'))
    const timestamp = itemUpdate.getValue('time')
    const high = parseFloat(itemUpdate.getValue('high'))
    const low = parseFloat(itemUpdate.getValue('low'))
    const open = parseFloat(itemUpdate.getValue('open'))
    const bid = parseFloat(itemUpdate.getValue('bid'))
    const ask = parseFloat(itemUpdate.getValue('ask'))

    const instrumentID = itemName.substr(4) * 1

    const data = {
      instrumentID: +instrumentID,
      timestamp: timestamp * 1000,
      last,
      high,
      low,
      open,
      ask,
      bid,
    }

    const state: any = store.getState()

    if (state.registry?.instrumentsHistory?.[instrumentID]) {
      const instrumentHistory = state.registry.instrumentsHistory[instrumentID]
      if (isNaN(data.last))
        data.last = instrumentHistory[instrumentHistory.length - 1][1]
      if (isNaN(data.ask))
        data.ask = instrumentHistory[instrumentHistory.length - 1][1]
      if (isNaN(data.bid))
        data.bid = instrumentHistory[instrumentHistory.length - 1][1]
    }

    this.onAggregatedQuoteUpdate(data)
  }

  /**
   * Update quotes state each 650ms
   * @param quote
   */
  onAggregatedQuoteUpdate = (quote: any) => {
    const now = Number(new Date())
    this.quoteUpdateList.push(quote)

    if (this.lastQuotesUpdate + 650 <= now) {
      store.dispatch(actionUpdateQuotes(this.quoteUpdateList))
      this.quoteUpdateList = []
      this.lastQuotesUpdate = Number(new Date())
    }
  }

  /**
   * Receive distances per instrument
   * @param itemUpdate
   */
  onDistance = (itemUpdate: any) => {
    // ignore this, it is not used
    // const itemName = itemUpdate.getItemName();
    // const rawDistance: string = itemUpdate.getValue("distance");
    // const timestamp = itemUpdate.getValue("time");
    // const rawDistances: any = JSON.parse(rawDistance);
    // /**
    //  * Convert distances
    //  */
    // const distances: any = {};
    // Object.keys(rawDistances).forEach((expiry: string) => {
    //   distances[Math.floor(Number(expiry) / 1000) * 1000] = rawDistances[Number(expiry)];
    // });
    // store.dispatch(actionSetDistances(itemName, distances))
  }

  /**
   * This feed receives ids of trades which are going to be closed
   * @param itemUpdate
   */
  onTrades = (itemUpdate: any) => {
    try {
      const trades = JSON.parse(itemUpdate.getValue('trades'))
      /**
       * Trades is key-value object 1234: { result: -1, expiryPrice: ... , returnedAmount: 0}
       * Lets take key and move it to expired, all the other details will be catched by request
       */
      const ids: string[] = Object.keys(trades)
      const profit = Object.values(trades).reduce((acc: number, curr: any) => {
        return acc + parseFloat(curr.returnedAmount)
      }, 0)

      store.dispatch(
        actionShowNotification<PnlNotificationProps>(
          NotificationTypes.TRADE_SUBMITTED_POSITION_CLOSED,
          {
            amount: ids.length,
            profit,
          }
        )
      )
      store.dispatch(actionMarkClosed(ids))
      /**
       * Sync state, by gracefully refresh
       */
      store.dispatch(actionRefreshTrades())
      store.dispatch(actionRefreshWallets())
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Set Featured instruments
   * Not used
   * @param itemUpdate
   */
  onTopPicks = (itemUpdate: any) => {
    // const timestamp = itemUpdate.getValue('time')
    // if (!this.topPicksInitialized) {
    // 	console.log('onTopPicks', timestamp)
    // 	//   store.dispatch(setFeaturedInstruments(timestamp));
    // }
    this.topPicksInitialized = true
  }

  /**
   * Practice feed switching
   * @param itemUpdate
   */
  onPracticeUpdate = (itemUpdate: any) => {
    const practiceModeStatus = JSON.parse(itemUpdate.getValue('status'))
    const practiceModeTime = JSON.parse(itemUpdate.getValue('time'))
    // {"expired":true}
    if (practiceModeStatus.expired) {
      store.dispatch(
        actionShowModal(ModalTypes.PRACTICE_EXPIRED, {
          practiceModeStatus,
          practiceModeTime,
        })
      )
    }
    // {"changeMode":true}
    if (practiceModeStatus.changeMode) {
      store.dispatch(actionRefreshAccount())
    }
  }

  /**
   * Received guest demo event
   * @param itemUpdate
   */
  onGuestDemo = (itemUpdate: any) => {
    const status = JSON.parse(itemUpdate.getValue('status'))
    if (['{"disabled":true}', '{"expired":true}'].includes(status)) {
      store.dispatch(actionGuestDemoExpired())
    }
  }

  handleOpenPendingOrders = (itemUpdate: any) => {
    const trades = JSON.parse(itemUpdate.getValue('trades'))

    if (trades && Object.keys(trades).length !== 0) {
      trades.forEach((key: any) => {
        store.dispatch(actionMovePendingOrderToOpen(trades[key]))
      })
    }
  }

  handleCancelledPendingOrders = (itemUpdate: any) => {
    const trades = JSON.parse(itemUpdate.getValue('trades'))

    if (trades && Object.keys(trades).length !== 0) {
      trades.forEach((key: any) => {
        store.dispatch(actionRemovePendingOrder(key))
      })
    }
  }

  /**
   * Methods
   */
  subscribeInstruments = (instruments: IInstrument[]) => {
    if (this.currentInstrumentSubscription) {
      this.LS.unsubscribe(this.currentInstrumentSubscription)
    }
    this.currentInstrumentSubscription = this.getQuotesSubscription(instruments)
    this.LS.subscribe(this.currentInstrumentSubscription)

    return this
  }
  handleRiskFactor = (itemUpdate: any) => {
    const fxRiskFactor = itemUpdate.getValue('factor')
    if (!this.firstInitRiskFactor && fxRiskFactor) {
      // to do dispatch update factor
    }
    this.firstInitRiskFactor = false
  }
  getRiskFactorSubscription(userId: string) {
    const subscription = new Subscription(
      'MERGE',
      [`fx_risk_status_${userId}`],
      ['factor']
    )
    subscription.setDataAdapter('risk_groups')
    subscription.addListener({
      onItemUpdate: this.handleRiskFactor,
    })

    return subscription
  }
  updateTradesSubscriptions = (user: IUserInfo) => {
    // Listen for risk factor change
    if (user.id && !this.currentRiskFactorSubscription) {
      this.currentRiskFactorSubscription = this.getRiskFactorSubscription(
        user.id
      )
      this.LS.subscribe(this.currentRiskFactorSubscription)
    } else if (this.currentRiskFactorSubscription) {
      this.LS.unsubscribe(this.currentRiskFactorSubscription)
      this.currentRiskFactorSubscription = null
    }
  }
}

export default LSFeed
