/**
 * Ported from fxcfd
 */
import { ICurrency } from './API'

/**
 * formats number value to specified currency
 * @param value number value of money
 * @param currency currency used for formatting
 */
export const formatCurrencyFn = (
  value: number,
  currency: any,
  space: boolean = true
): string => {
  try {
    if (value === null || isNaN(value)) return ''

    const transformedValue = value.toFixed(currency.precision).split('.')[1]
      ? value.toFixed(currency.precision).replace(/\B(?=(\d{3})+(?!\d).)/g, ',')
      : value.toLocaleString('en')

    return `${currency.currencySymbol}${space ? ' ' : ''}${transformedValue}`
  } catch (err) {
    console.warn('Currency object is not valid', err)
    return String(value)
  }
}
