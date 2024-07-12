/**
 * Holds wallets as an object from server
 */
import {
  SET_WALLETS,
  RESET_WALLETS,
  SET_ACTIVE_WALLET,
  SET_OPEN_STAKE_PER_INSTRUMENT,
  SET_EQUITY,
  SET_MARGIN_USED,
  SET_OPEN_PNL,
  SET_INVESTED,
  SET_CHALLENGE_DASHBOARD,
} from '../actions/wallets'

export const initState = {
  wallets: [],
  loaded: false,
  activeWallet: {},
  activeWalletIndex: 0,
  openStakePerInstrument: 0,
  equity: 0,
  marginUsed: 0,
  openPnL: 0,
  invested: 0,
  challengeDashboard: {
    history: [],
    state: {
      challengeID: 0,
      packageID: '0',
      walletID: 0,
      title: '',
      initialBalance: '0.00000',
      startTime: '',
      leverageCap: '0.00000',
      status: '1',
      maxDailyLossPct: '0.00000',
      maxTotalLossPct: '0.00000',
      profitGoalPct: '0.00000',
      maxDailyTrades: '',
      maxTradingDays: '',
      currency: '1',
      currentTradingDays: 0,
      totalPnl: '',
      lastDayLoss: '',
      dailyLossReached: '',
      maxDailyTradesReached: '',
      maxTotalLossReached: '',
      maxTradingDaysReached: '',
      expirationReached: '',
      expiryTime: '',
    },
  },
}
const walletsReducer = (state = initState, action: any) => {
  switch (action.type) {
    case SET_WALLETS:
      let activeWallet = {}
      let activeWalletIndex = state.activeWalletIndex
      const { wallets, setActiveWallet } = action.payload
      if (setActiveWallet && setActiveWallet !== -1) {
        activeWallet = wallets[setActiveWallet]
        activeWalletIndex = setActiveWallet
      } else {
        if (!wallets[state.activeWalletIndex]) {
          activeWallet = {
            availableBonus: 0,
            availableCash: 0,
            baseCurrency: 1,
            bonus: {
              tradeable: 0,
              pending: 0,
              promotional: 0,
            },
            bonusesInfo: [],
            currency: '',
            displayCurrency: 0,
            pendingBonusDetails: [],
            reserved: 0,
            userCurrency: 0,
            userID: 0,
            walletID: 0,
            walletType: 0,
            walletName: '',
            accountTypeLabel: '',
            isMargin: false,
            challengeID: 0,
            challengeStatus: 0,
            packageID: 0,
          }
        } else {
          activeWallet = wallets[state.activeWalletIndex]
        }
      }

      return {
        ...state,
        wallets,
        loaded: true,
        activeWallet,
        activeWalletIndex,
      }
    case SET_ACTIVE_WALLET:
      return {
        ...state,
        activeWalletIndex: action.payload,
        activeWallet: state.wallets[action.payload],
      }
    case RESET_WALLETS:
      return initState
    case SET_OPEN_STAKE_PER_INSTRUMENT:
      return { ...state, openStakePerInstrument: action.payload }
    case SET_EQUITY:
      return { ...state, equity: action.payload }
    case SET_MARGIN_USED:
      return { ...state, marginUsed: action.payload }
    case SET_OPEN_PNL:
      return { ...state, openPnL: action.payload }
    case SET_INVESTED:
      return { ...state, invested: action.payload }
    case SET_CHALLENGE_DASHBOARD:
      return { ...state, challengeDashboard: action.payload }
    default:
      return state
  }
}

export default walletsReducer
