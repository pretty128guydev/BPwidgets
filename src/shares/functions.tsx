import { difference, filter, keys, map, round, split, toLower } from 'lodash'
import { IShortInstrument } from '../components/ChartContainer/InstrumentsBar'
import { IWalletDetails } from '../core/API'

export function searchInstruments(
  instruments: IShortInstrument[],
  searchValue: string
): IShortInstrument[] {
  const lowerSearch = toLower(searchValue)
  let result = instruments.filter((i: IShortInstrument) =>
    toLower(i.name).includes(lowerSearch)
  )
  if (result.length === 0) {
    const lowerSearchSpit = filter(
      split(lowerSearch, ''),
      (i: string) => i !== ' '
    )
    result = instruments.filter((i: IShortInstrument) => {
      const nameSplit = split(toLower(i.name), '')
      return difference(lowerSearchSpit, nameSplit).length === 0
    })
  }
  return result
}

export const convertObjectToArray = (object: any): any[] => {
  const stringKeys = keys(object)
  if (stringKeys.length) {
    return map(stringKeys, (key) => {
      return {
        ...object[key],
        _id: key,
      }
    })
  }
  return []
}

export const currencyToString = (
  number: number,
  precision: number,
  options?: {
    addCurrencySymbol: string
  }
) => {
  if (number === Infinity) return ''
  if (number && precision) {
    return `${
      options?.addCurrencySymbol ? options.addCurrencySymbol : ''
    }${round(number, precision)}`
  } else {
    return ''
  }
}

export const calculatePipValue = ({
  stake,
  lastQuote,
  leverage,
  pip,
}: {
  stake: number
  lastQuote: number
  leverage: number
  pip: number
}) => {
  if (lastQuote === 0) return 0
  return (stake / lastQuote) * leverage * pip
}

export function getPriceStep(precision: number) {
  let scale = '0.'
  for (let index = 1; index < precision; index++) {
    scale = `${scale}0`
  }
  scale += '1'
  return Number(scale)
}

export function calculateEquity(wallet: IWalletDetails, openPnL: number) {
  if (!wallet) return NaN
  const { availableCash, bonus } = wallet
  const availableBonus = bonus?.tradeable || 0

  return availableCash + availableBonus + openPnL
}
