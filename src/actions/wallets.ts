import { action } from 'typesafe-actions'
import { IWalletDetails } from '../core/API'
import { IChallengeDashboardData } from '../components/Dashboard/interfaces'

const entity = 'wallets'

const SET_WALLETS = `${entity}/SET_WALLETS`
const RESET_WALLETS = `${entity}/RESET_WALLETS`
const REFRESH_WALLETS = `${entity}/REFRESH_WALLETS`
const SET_ACTIVE_WALLET = `${entity}/SET_ACTIVE_WALLET`
const SET_OPEN_STAKE_PER_INSTRUMENT = `${entity}/SET_OPEN_STAKE_PER_INSTRUMENT`
const SET_EQUITY = `${entity}/SET_EQUITY`
const SET_MARGIN_USED = `${entity}/SET_MARGIN_USED`
const SET_OPEN_PNL = `${entity}/SET_OPEN_PNL`
const SET_INVESTED = `${entity}/SET_INVESTED`
const SET_CHALLENGE_DASHBOARD = `${entity}/SET_CHALLENGE_DASHBOARD`

const actionSetWallets = (
  wallets: IWalletDetails[],
  setActiveWallet?: number
) => action(SET_WALLETS, { wallets, setActiveWallet })
const actionResetWallets = () => action(RESET_WALLETS)
const actionRefreshWallets = () => action(REFRESH_WALLETS)
const actionSetActiveWallet = (walletIndex: number) =>
  action(SET_ACTIVE_WALLET, walletIndex)
const actionSetOpenStakePerInstrument = (value: any) =>
  action(SET_OPEN_STAKE_PER_INSTRUMENT, value)
const actionSetEquity = (value: number) => action(SET_EQUITY, value)
const actionSetMarginUsed = (value: number) => action(SET_MARGIN_USED, value)
const actionSetOpenPnL = (value: number) => action(SET_OPEN_PNL, value)
const actionSetInvested = (value: number) => action(SET_INVESTED, value)
const actionSetChallengeDashboard = (value: IChallengeDashboardData) =>
  action(SET_CHALLENGE_DASHBOARD, value)

export {
  SET_WALLETS,
  RESET_WALLETS,
  REFRESH_WALLETS,
  SET_ACTIVE_WALLET,
  SET_OPEN_STAKE_PER_INSTRUMENT,
  SET_EQUITY,
  SET_MARGIN_USED,
  SET_OPEN_PNL,
  SET_INVESTED,
  SET_CHALLENGE_DASHBOARD,
  actionSetWallets,
  actionResetWallets,
  actionRefreshWallets,
  actionSetActiveWallet,
  actionSetOpenStakePerInstrument,
  actionSetEquity,
  actionSetMarginUsed,
  actionSetOpenPnL,
  actionSetInvested,
  actionSetChallengeDashboard,
}
