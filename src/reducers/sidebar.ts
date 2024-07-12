import {
  SET_SIDEBAR,
  SET_BOTTOM_TAB,
  SET_OPEN_BOTTOM_TAB,
} from '../actions/sidebar'

export enum SidebarState {
  dashboard,
  none,
  positions,
  news,
  video,
  tutorial,
  signals,
  social,
  analysis,
  markets,
  trade,
  leaderboard,
  challengeDashboard,
}

export interface ISidebarState {
  panel: SidebarState
  bottomTab: string
  props?: any | undefined
  openBottomTab: boolean
}

const defaultState = {
  panel: SidebarState.trade,
  bottomTab: 'open',
  props: null,
  openBottomTab: false,
}

const sidebarReducer = (state: ISidebarState = defaultState, action: any) => {
  switch (action.type) {
    case SET_SIDEBAR:
    case SET_BOTTOM_TAB:
    case SET_OPEN_BOTTOM_TAB:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default sidebarReducer
