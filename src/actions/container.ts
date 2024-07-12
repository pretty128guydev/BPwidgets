import { action } from 'typesafe-actions'
import { ContainerState, IPlatformMenu } from '../reducers/container'
import { IInstrument } from '../core/API'

const entity = 'container'

const SET_CONTAINER = `${entity}/SET`
const SET_FIRST_TIME_OPEN_WEB = `${entity}/SET_FIRST_TIME_OPEN_WEB`
const SET_SHOW_SIDE_MENU = `${entity}/SET_SHOW_SIDE_MENU`
const SET_COLLAPSED_SIDE_MENU = `${entity}/SET_COLLAPSED_SIDE_MENU`
const SET_SHOW_TOP_MENU = `${entity}/SET_SHOW_TOP_MENU`
const SET_SIDE_MENU_ITEMS = `${entity}/SET_SIDE_MENU_ITEMS`
const SET_TOP_MENU_ITEMS = `${entity}/SET_TOP_MENU_ITEMS`
const SET_SHOW_CHALLENGE = `${entity}/SET_SHOW_CHALLENGE`
const SET_ASSETS_PAGE = `${entity}/SET_ASSETS_PAGE`
const SET_CURRENT_ASSETS_PAGE = `${entity}/SET_CURRENT_ASSETS_PAGE`
const SET_LOADING_MORE_ASSETS = `${entity}/SET_LOADING_MORE_ASSETS`

const actionSetContainer = (content: ContainerState) =>
  action(SET_CONTAINER, { content })

const actionSetFirstTimeOpenWeb = (isFirstTimeOpenWeb: boolean) =>
  action(SET_FIRST_TIME_OPEN_WEB, { isFirstTimeOpenWeb })

const actionSetShowSideMenu = (showSideMenu: boolean) =>
  action(SET_SHOW_SIDE_MENU, { showSideMenu })

const actionSetCollapsedSideMenu = (collapsedSideMenu: boolean) =>
  action(SET_COLLAPSED_SIDE_MENU, { collapsedSideMenu })

const actionSetShowTopMenu = (showTopMenu: boolean) =>
  action(SET_SHOW_TOP_MENU, { showTopMenu })

const actionSetSideMenuItems = (sideMenuItems: IPlatformMenu[]) =>
  action(SET_SIDE_MENU_ITEMS, { sideMenuItems })

const actionSetTopMenuItems = (topMenuItems: IPlatformMenu[]) =>
  action(SET_TOP_MENU_ITEMS, { topMenuItems })

const actionSetShowChallenge = (showChallenge: boolean) =>
  action(SET_SHOW_CHALLENGE, { showChallenge })

const actionSetCurrentAssetsPage = (currentAssetsPage: number) =>
  action(SET_CURRENT_ASSETS_PAGE, { currentAssetsPage })

const actionSetAssetsPage = (
  currentAssetsPage: number,
  searchInstruments?: IInstrument[]
) => action(SET_ASSETS_PAGE, { currentAssetsPage, searchInstruments })

const actionSetLoadingMoreAssets = (loadingMoreAssets: boolean) =>
  action(SET_LOADING_MORE_ASSETS, { loadingMoreAssets })

export {
  SET_CONTAINER,
  actionSetContainer,
  SET_FIRST_TIME_OPEN_WEB,
  actionSetFirstTimeOpenWeb,
  SET_SHOW_SIDE_MENU,
  actionSetShowSideMenu,
  SET_COLLAPSED_SIDE_MENU,
  actionSetCollapsedSideMenu,
  SET_SHOW_TOP_MENU,
  actionSetShowTopMenu,
  SET_SIDE_MENU_ITEMS,
  actionSetSideMenuItems,
  SET_TOP_MENU_ITEMS,
  actionSetTopMenuItems,
  SET_SHOW_CHALLENGE,
  actionSetShowChallenge,
  SET_CURRENT_ASSETS_PAGE,
  actionSetCurrentAssetsPage,
  SET_ASSETS_PAGE,
  actionSetAssetsPage,
  SET_LOADING_MORE_ASSETS,
  actionSetLoadingMoreAssets,
}
