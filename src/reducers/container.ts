import {
  SET_COLLAPSED_SIDE_MENU,
  SET_CONTAINER,
  SET_FIRST_TIME_OPEN_WEB,
  SET_SHOW_SIDE_MENU,
  SET_SHOW_TOP_MENU,
  SET_SIDE_MENU_ITEMS,
  SET_TOP_MENU_ITEMS,
  SET_SHOW_CHALLENGE,
  SET_CURRENT_ASSETS_PAGE,
  SET_LOADING_MORE_ASSETS,
} from '../actions/container'

export enum ContainerState {
  trade,
  dashboard,
  assets,
  challengeDashboard,
}

export interface IContainerState {
  content: ContainerState
}

export interface IPlatformMenu {
  label: string
  show: boolean | number
  link: string
  order: number
  afterLoginOnly?: boolean | number
  subItems?: IPlatformMenu[]
  platform: string
}

const defaultState = {
  content: ContainerState.assets,
  isFirstTimeOpenWeb: true,
  showSideMenu: false,
  sideMenuItems: [],
  collapsedSideMenu: true,
  showTopMenu: false,
  topMenuItems: [],
  showChallenge: false,
  currentAssetsPage: 1,
  loadingMoreAssets: false,
}

const containerReducer = (
  state: IContainerState = defaultState,
  action: any
) => {
  switch (action.type) {
    case SET_CONTAINER:
    case SET_FIRST_TIME_OPEN_WEB:
    case SET_COLLAPSED_SIDE_MENU:
    case SET_SHOW_SIDE_MENU:
    case SET_SIDE_MENU_ITEMS:
    case SET_SHOW_TOP_MENU:
    case SET_TOP_MENU_ITEMS:
    case SET_SHOW_CHALLENGE:
    case SET_CURRENT_ASSETS_PAGE:
    case SET_LOADING_MORE_ASSETS:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default containerReducer
