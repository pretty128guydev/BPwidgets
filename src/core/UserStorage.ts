import { LayoutType } from '../charting_library_pro/charting_library/charting_library'

/**
 * Implements a wrapper over localStorage
 * why? LocalStorage is available only in browser,
 * so in future having one place to save/load preferences will save much time
 * like if react-native than use AsyncStorage
 */
enum StorageKeys {
  language = 'userLanguage', // backward compability with old platform
  chartType = 'wow.chartType',
  typeOfChart = 'typeOfChart',
  lastInstrumentID = 'wow.lastInstrumentID',
  chartIndicators = 'wow.chart_indicators',
  defaultLayout = 'wow.defaultLayout',
  chartsCount = 'wow.chartsCount',
  challengeWallet = 'wow.challengeWallet',
}

class UserStorage {
  public static getLanguage = (): string | null => {
    try {
      return localStorage.getItem(StorageKeys.language)
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setLanguage = (language: string): void => {
    try {
      localStorage.setItem(StorageKeys.language, language)
    } catch (err) {
      console.warn(err)
    }
  }

  public static resetLanguage = (): void => {
    try {
      localStorage.removeItem(StorageKeys.language)
    } catch (err) {
      console.warn(err)
    }
  }

  public static getChartType = (): string | null => {
    try {
      return localStorage.getItem(StorageKeys.chartType)
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setChartType = (chartType: string): void => {
    try {
      localStorage.setItem(StorageKeys.chartType, chartType)
    } catch (err) {
      console.warn(err)
    }
  }

  public static setTypeOfChart = (typeOfChart: string): void => {
    try {
      localStorage.setItem(StorageKeys.typeOfChart, typeOfChart)
    } catch (err) {
      console.warn(err)
    }
  }

  public static getTypeOfChart = (): string | null => {
    try {
      return localStorage.getItem(StorageKeys.typeOfChart)
    } catch (err) {
      console.warn(err)
      return null
    }
  }

  public static setFavouriteIndicators = (indicators: any[]): void => {
    try {
      localStorage.setItem(
        StorageKeys.chartIndicators,
        JSON.stringify(indicators)
      )
    } catch (err) {
      console.warn(err)
    }
  }

  public static getFavouriteIndicators = (): any[] => {
    try {
      const value = localStorage.getItem(StorageKeys.chartIndicators)
      return value ? JSON.parse(value) : []
    } catch (err) {
      console.warn(err)
      return []
    }
  }

  public static setDefaultLayout = (layout: LayoutType): void => {
    try {
      localStorage.setItem(StorageKeys.defaultLayout, layout)
    } catch (err) {
      console.warn(err)
    }
  }

  public static getDefaultLayout = () => {
    try {
      return localStorage.getItem(StorageKeys.defaultLayout) || '4'
    } catch (err) {
      console.warn(err)
    }
  }

  public static setChartsCount = (count: number): void => {
    try {
      localStorage.setItem(StorageKeys.chartsCount, `${count}`)
    } catch (err) {
      console.warn(err)
    }
  }

  public static getChartsCount = () => {
    try {
      const value = localStorage.getItem(StorageKeys.chartsCount) || 4
      return Number(value)
    } catch (err) {
      console.warn(err)
    }
  }

  public static setChallengeWallet = (wallet: string): void => {
    try {
      localStorage.setItem(StorageKeys.challengeWallet, wallet)
    } catch (err) {
      console.warn(err)
    }
  }

  public static getChallengeWallet = () => {
    try {
      const value = localStorage.getItem(StorageKeys.challengeWallet)
      return value ? JSON.parse(value) : null
    } catch (err) {
      console.warn(err)
    }
  }

  public static removeChallengeWallet = () => {
    try {
      localStorage.removeItem(StorageKeys.challengeWallet)
    } catch (err) {
      console.warn(err)
    }
  }
}

export default UserStorage
