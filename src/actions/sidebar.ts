import { action } from 'typesafe-actions'
import { SidebarState } from '../reducers/sidebar'

const entity = 'sidebar'

const SET_SIDEBAR = `${entity}/SET`
const SET_BOTTOM_TAB = `${entity}/SET_BOTTOM_TAB`
const SET_OPEN_BOTTOM_TAB = `${entity}/SET_OPEN_BOTTOM_TAB`

const actionSetSidebar = (panel: SidebarState, props?: any) =>
  action(SET_SIDEBAR, { panel, props })

const actionSetBottomTab = (bottomTab: string) =>
  action(SET_BOTTOM_TAB, { bottomTab })

const actionSetOpenBottomTab = (openBottomTab: boolean) =>
  action(SET_OPEN_BOTTOM_TAB, { openBottomTab })

export {
  SET_SIDEBAR,
  SET_BOTTOM_TAB,
  SET_OPEN_BOTTOM_TAB,
  actionSetSidebar,
  actionSetBottomTab,
  actionSetOpenBottomTab,
}
