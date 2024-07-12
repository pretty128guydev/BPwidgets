import { createSelector } from 'reselect'
import { IWalletDetails } from '../../core/API'
import { formatCurrencyFn } from '../../core/currency'

const wallets = (state: any) => state.wallets
const activeWalletIndex = (state: any) => state.wallets.activeWalletIndex
const currencies = (state: any) => state.registry.data.availableCurrencies
const partnerConfig = (state: any) => state.registry.data.partnerConfig
const userInfo = (state: any) => state.account.userInfo
const isGuestDemo = createSelector(userInfo, (userInfo: any) =>
  userInfo ? userInfo.isDemo && userInfo.isDemoActive : false
)
/**
 * Create a function that prioritzes baseCurrency before displayCurrency for guestDemo
 * issue: displayCurrency is not set for guestDemo
 */
const currencyAttributeNameFn = createSelector(isGuestDemo, (demo: boolean) => {
  return (wallets: any) => {
    return '$'
    // return demo
    //   ? wallets.baseCurrency || wallets.displayCurrency
    //   : wallets.displayCurrency || wallets.baseCurrency
  }
})

const getWalletCurrencySymbol = createSelector(
  wallets,
  currencies,
  partnerConfig,
  currencyAttributeNameFn,
  (wallets: any, currencies: any, partnerConfig: any, walletsFn: any) => {
    if (Object.keys(wallets.activeWallet).length > 0) {
      const baseCurrency = wallets.activeWallet?.baseCurrency
      const currencySymbol = currencies[baseCurrency]?.currencySymbol || '$'
      return currencySymbol
    } else {
      const { defaultCurrency } = partnerConfig
      const currencyIndex =
        Object.keys(currencies).find((key) => {
          return currencies[key].currencyName === defaultCurrency.toLowerCase()
        }) || 1
      return currencies[currencyIndex]?.currencySymbol || '$'
    }
  }
)

const getWalletCurrency = createSelector(
  wallets,
  currencies,
  partnerConfig,
  currencyAttributeNameFn,
  (wallets: any, currencies: any, partnerConfig: any, walletsFn: any) => {
    if (Object.keys(wallets.activeWallet).length > 0) {
      const baseCurrency = wallets.activeWallet?.baseCurrency
      const currency = currencies[baseCurrency]
      return currency
    } else {
      const { defaultCurrency } = partnerConfig
      const currencyIndex =
        Object.keys(currencies).find((key) => {
          return currencies[key].currencyName === defaultCurrency.toLowerCase()
        }) || 1
      return currencies[currencyIndex]
    }
  }
)

/**
 * Return precision as number
 * wallets object may not contain displayCurrency
 */
const getCurrencyPrecision = createSelector(
  wallets,
  currencies,
  partnerConfig,
  currencyAttributeNameFn,
  (wallets: any, currencies: any, partnerConfig: any, walletsFn: any) => {
    if (Object.keys(wallets.activeWallet).length > 0) {
      const baseCurrency = wallets.activeWallet?.baseCurrency
      const precision = currencies[baseCurrency]?.precision || 2
      return precision
    } else {
      const { defaultCurrency } = partnerConfig
      const currencyIndex =
        Object.keys(currencies).find((key) => {
          return currencies[key].currencyName === defaultCurrency.toLowerCase()
        }) || 1
      return currencies[currencyIndex]?.precision || 2
    }
  }
)

/**
 * Returns a function that formats currency in wallet format
 * Use this function from props
 * @param value
 */
const formatCurrency = createSelector(
  getWalletCurrencySymbol,
  getCurrencyPrecision,
  (currencySymbol: any, precision: any) => {
    return (value: number, space: boolean = true) => {
      return formatCurrencyFn(
        value,
        {
          currencySymbol,
          precision,
        } as any,
        space
      )
    }
  }
)
/**
 * Currency as string
 */
const formatStringCurrency = createSelector(
  getWalletCurrencySymbol,
  (symbol: any) => {
    return (value: string | number) => {
      return `${symbol} ${value}`
    }
  }
)
/**
 * Returns a function that formats currency in wallet format
 * Use this function from props
 * @param value
 */
const formatCurrencyById = createSelector(currencies, (currencies: any) => {
  return (value: string | number, currency: number): string => {
    const currencyObject = currencies[currency]
    if (value === '') {
      return ''
    }
    if (typeof value === 'string') {
      return formatCurrencyFn(parseFloat(value), currencyObject)
    }
    if (!Number.isNaN(value)) {
      return formatCurrencyFn(value, currencyObject)
    }
    return String(value)
  }
})

const activeWallet = createSelector(
  wallets,
  activeWalletIndex,
  (wallets: IWalletDetails[], activeWalletIndex: number) => {
    if (wallets) {
      return wallets[activeWalletIndex]
    }
  }
)

export {
  getWalletCurrencySymbol,
  getWalletCurrency,
  formatCurrency,
  formatStringCurrency,
  formatCurrencyById,
  getCurrencyPrecision,
  activeWallet,
}
