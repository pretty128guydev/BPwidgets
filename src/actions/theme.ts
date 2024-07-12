import { action } from 'typesafe-actions'

const entity = 'theme'

const THEME_UPDATE = `${entity}/UPDATE`
const THEME_SET = `${entity}/SET`
const FX_THEME_SET = `${entity}/FX_THEME_SET`

const actionSetTheme = (theme: any) => action(THEME_SET, theme)
const actionSetFXTheme = (theme: any) => action(FX_THEME_SET, theme)
const actionUpdateTheme = (key: string, value: string) =>
  action(THEME_UPDATE, { key, value })

export {
  THEME_UPDATE,
  THEME_SET,
  FX_THEME_SET,
  actionSetTheme,
  actionSetFXTheme,
  actionUpdateTheme,
}
