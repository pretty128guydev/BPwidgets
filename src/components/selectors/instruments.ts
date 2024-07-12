/**
 * Memoized selectors for instruments
 */
import { createSelector } from 'reselect'
import { IConversionChain, IInstrument, IUserInfo } from '../../core/API'
import { IGame } from '../../reducers/games'
import { InstrumentsMap } from '../../reducers/instruments'
import { IQuote, QuotesMap } from '../../reducers/quotes'
import { isLoggedIn } from './loggedIn'
import { IShortInstrument } from '../ChartContainer/InstrumentsBar'
import { convertObjectToArray } from '../../shares/functions'
import { InstrumentType } from '../../models/registry'

/**
 * Get selected instrument id
 * @param state
 */
const selectedInstrument = (state: any) => state.trading.selected
const chartInstruments = (state: any) => state.trading.chartInstruments
const conversionChain = (state: any) => state.trading.conversionChain
const conversionChainProfit = (state: any) =>
  state.trading.conversionChainProfit
const selectedFxRiskFactor = (state: any) =>
  state.account?.userInfo?.fxRiskFactor || state.trading.fxRiskFactor
const instrumentsFromRegistry = (state: any) => state.instruments
/**
 * Access quotes hash
 * @param state
 */
const quotes = (state: any) => state.quotes
const instruments = (state: any) => state.instruments
const instrumentTypes = (state: any) => state.registry.data.instrumentTypes
const userInfo = (state: any) => state.account.userInfo

const getInstrumentObject = createSelector(
  selectedInstrument,
  instruments,
  (selected: string, instruments: InstrumentsMap): IInstrument => {
    return instruments[selected]
  }
)

const getInstrumentName = createSelector(
  [getInstrumentObject],
  (instrument: IInstrument): string => instrument.name
)
/**
 * Return last price for selected instrument or 0 if not enough data
 */
const lastPriceForSelectedInstrument = createSelector(
  selectedInstrument,
  quotes,
  instruments,
  (selected: string, quotes: QuotesMap, instruments: InstrumentsMap) => {
    if (selected && quotes[selected]) {
      const { bid, ask } = quotes[selected]
      const { precision } = instruments[selected]
      /**
       * RoundUp with precision
       * Issue: https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
       */
      return parseFloat(String((bid + ask) / 2)).toFixed(Number(precision))
    }
    return 0.0
  }
)

const lastQuoteForSelectedInstrument = createSelector(
  selectedInstrument,
  quotes,
  (selected: string, quotes: QuotesMap) => {
    if (selected && quotes[selected]) {
      return quotes[selected]
    }
    return {}
  }
)

const lastQuoteRiskForSelectedInstrument = createSelector(
  selectedInstrument,
  getInstrumentObject,
  quotes,
  selectedFxRiskFactor,
  (
    selected: string,
    instrument: IInstrument,
    quotes: QuotesMap,
    fxRiskFactor: number
  ) => {
    if (selected && quotes[selected] && instrument) {
      const quote: IQuote = quotes[selected]
      const { deltaSpread } = instrument.tradingConfig
      const ask = quote.ask + (deltaSpread * fxRiskFactor || 0) / 2
      const bid = quote.bid - (deltaSpread * fxRiskFactor || 0) / 2
      return {
        ...quote,
        ask,
        bid,
      }
    }
    return {}
  }
)

const lastQuotesRiskForChartInstruments = createSelector(
  chartInstruments,
  quotes,
  selectedFxRiskFactor,
  (instruments: IInstrument[], quotes: QuotesMap, fxRiskFactor: number) => {
    if (instruments.length > 0) {
      return instruments.map((instrument) => {
        const quote: IQuote = quotes[instrument.instrumentID]
        if (!quote) return null
        const { deltaSpread } = instrument.tradingConfig
        const ask = quote.ask + (deltaSpread * fxRiskFactor || 0) / 2
        const bid = quote.bid - (deltaSpread * fxRiskFactor || 0) / 2
        return {
          ...quote,
          ask,
          bid,
        }
      })
    }
    return []
  }
)

const lastQuotesRiskForConversionChainInstruments = createSelector(
  conversionChain,
  instruments,
  quotes,
  selectedFxRiskFactor,
  (
    conversionChain: IConversionChain,
    instruments: IInstrument[],
    quotes: QuotesMap,
    fxRiskFactor: number
  ) => {
    if (instruments && quotes) {
      const { operations } = conversionChain

      if (operations && operations.length > 0) {
        return operations.map((o) => {
          const instrument = instruments[o.instrumentID]
          const quote: IQuote = quotes[o.instrumentID]
          if (!instrument || !quote) return {}
          const { deltaSpread } = instrument.tradingConfig
          const ask = quote.ask + (deltaSpread * fxRiskFactor || 0) / 2
          const bid = quote.bid - (deltaSpread * fxRiskFactor || 0) / 2
          return {
            ...quote,
            ask,
            bid,
          }
        })
      }
    }
    return []
  }
)

const lastQuotesRiskForConversionChainProfitInstruments = createSelector(
  conversionChainProfit,
  instruments,
  quotes,
  selectedFxRiskFactor,
  (
    conversionChain: IConversionChain,
    instruments: IInstrument[],
    quotes: QuotesMap,
    fxRiskFactor: number
  ) => {
    if (instruments && quotes) {
      const { operations } = conversionChain

      if (operations && operations.length > 0) {
        return operations.map((o) => {
          const instrument = instruments[o.instrumentID]
          const quote: IQuote = quotes[o.instrumentID]
          if (!instrument || !quote) return {}
          const { deltaSpread } = instrument.tradingConfig
          const ask = quote.ask + (deltaSpread * fxRiskFactor || 0) / 2
          const bid = quote.bid - (deltaSpread * fxRiskFactor || 0) / 2
          return {
            ...quote,
            ask,
            bid,
          }
        })
      }
    }
    return []
  }
)

/**
 * Return list of games for selected asset as hash
 * @param state
 */
const games = (state: any) => state.games

const getActiveExpiries = createSelector(
  selectedInstrument,
  games,
  (selected: string, games: any) => {
    if (games && games[selected]) {
      return games[selected].filter((game: IGame) => !game.disabled)
    }
    return []
  }
)

const featuredInstrumentsIds = (state: any) => state.registry.data.featured

const defaultTopAssets = (state: any) => {
  return convertObjectToArray(state.instruments)
    .filter((item: any) => item && item.isOpen)
    .slice(0, 5)
}

const getUserInfo = (state: any) => state.account.userInfo

/**
 * Prioritize open vs closed
 * @param collection
 */
// const sortOpen = (collection: IInstrument[]) =>
//   collection.sort(
//     (a: IInstrument, b: IInstrument) => Number(a.isOpen) - Number(b.isOpen)
//   )
/**
 * Prioritize open vs closed
 * @param collection
 */
const sortOpenReversed = (collection: IInstrument[]) =>
  collection.sort(
    (a: IInstrument, b: IInstrument) => Number(b.isOpen) - Number(a.isOpen)
  )

/**
 * Return 1 if we are practicing and 0 if not
 * @param state
 */
const practiceModeBinary = (state: any) =>
  state.account.userInfo ? (state.account.userInfo.practiceMode ? 1 : 0) : 0

/**
 * User Currency selector from wallet
 * Don't expose this to any component, because there is a formatter function
 * @param state
 */
// const userCurrencySelector = (state: any) =>
// 	state.wallets ? state.wallets.userCurrency : '$'

/**
 * Returns array of opened and than closed instruments
 * @param state
 */
const openInstruments = (state: any) => {
  const collection: any = {
    open: [],
    close: [],
  }
  convertObjectToArray(state).forEach((i: IInstrument) =>
    i.isOpen ? collection.open.push(i) : collection.close.push(i)
  )
  return [...collection.open, ...collection.close]

  // Asset list order - Wrong order:
  // The order list should be divided to 2:
  // Assets that their isOpen status = true - Those assets should be first in order and not grayed out:
  // In here the assets on the left should be first the assets in get-registry → Featured
  // Then the rest of the isOpen assets according to instrumentID order
  // Assets that their isOpen status = false - Those assets should be last in order and grayed out
  // In here the assets order should be according to instrumentID order
}

const simplify = (
  collection: IInstrument[],
  fav: number[],
  selectedInstrument: number
): IShortInstrument[] =>
  collection.map(
    ({
      instrumentID,
      name,
      isOpen,
      type,
      tradingHours,
      description,
      referencePrice,
      starred,
    }: IInstrument) => ({
      instrumentID,
      name,
      isOpen,
      selected: instrumentID === selectedInstrument,
      favorite: starred,
      type,
      tradingHours: tradingHours?.[0] || { opensAt: 0, isOpen },
      description,
      referencePrice,
      starred,
    })
  )

/**
 * Performance effective structure
 * Avoid rendering on each quote
 */
const shortOpenInstruments = createSelector(
  isLoggedIn,
  instrumentsFromRegistry,
  // featuredInstrumentsIds,
  getUserInfo,
  selectedInstrument,
  (
    loggedIn: boolean,
    instrumentsFromRegistry: any,
    userInfo: IUserInfo,
    selectedInstrument: number
  ): IShortInstrument[] => {
    const instruments: IInstrument[] = Object.values(instrumentsFromRegistry)
    if (instruments.length > 0) {
      if (loggedIn && userInfo) {
        return simplify(
          sortOpenReversed(instruments),
          userInfo.favAssets,
          selectedInstrument
        )
      }

      const result = simplify(
        sortOpenReversed([...instruments]),
        [],
        selectedInstrument
      )
      return result
    }

    return []
  }
)

/**
 * Return first open instrument object
 */
const firstOpenInstrument = createSelector(
  openInstruments,
  (instruments) => instruments[0]
)

/**
 * Return defaultGameType for current instrument
 */
const defaultGameTypeSelector = createSelector(
  getInstrumentObject,
  (instrument: IInstrument) => Number(instrument.defaultGameType)
)

/**
 * Return max payout from instrument
 * @param payouts
 */
const getInstrumentPayout = ({ payouts }: IInstrument) => {
  if (!payouts) {
    return
  }

  return Math.max.apply(
    Math,
    payouts.map((item) => item.payout)
  )
}

/**
 * Return Payout and price of instrument if exist
 */
const getPriceAndPayoutForInstrument = createSelector(
  quotes,
  instruments,
  (quotes: any, instruments: any) => {
    return (instrumentID: number) => {
      const result: { payout: any; price: any } = {
        price: '...',
        payout: '...',
      }

      if (instrumentID && quotes[instrumentID] && instruments[instrumentID]) {
        const { bid, ask } = quotes[instrumentID]
        const { precision } = instruments[instrumentID]
        result.price = parseFloat(String((bid + ask) / 2)).toFixed(
          Number(precision)
        )
      }
      result.payout = getInstrumentPayout(instruments[instrumentID])
      return result
    }
  }
)

/**
 * Return array of favorites instruments
 */
const getFavoriteInstruments = createSelector(
  userInfo,
  (userInfo: IUserInfo) => userInfo?.favAssets ?? []
)

/**
 * Return availble instruments
 */
const availbleInstrumentTypes = createSelector(
  instrumentTypes,
  (instrumentTypes: InstrumentType[]) =>
    instrumentTypes.filter((ins) => ins.id !== 5)
)

export {
  selectedInstrument,
  getInstrumentObject,
  getInstrumentName,
  lastPriceForSelectedInstrument,
  lastQuoteForSelectedInstrument,
  getActiveExpiries,
  getUserInfo,
  practiceModeBinary,
  openInstruments,
  firstOpenInstrument,
  defaultGameTypeSelector,
  getPriceAndPayoutForInstrument,
  getFavoriteInstruments,
  shortOpenInstruments,
  featuredInstrumentsIds,
  defaultTopAssets,
  lastQuoteRiskForSelectedInstrument,
  availbleInstrumentTypes,
  selectedFxRiskFactor,
  lastQuotesRiskForChartInstruments,
  lastQuotesRiskForConversionChainInstruments,
  lastQuotesRiskForConversionChainProfitInstruments,
}
