import { action } from 'typesafe-actions'

const entity = `modal`

export enum ModalTypes {
  SIGN_IN = 'SIGN_IN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PRACTICE_EXPIRED = 'PRACTICE_EXPIRED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SELLBACK = 'SELLBACK',
  THEME_CONFIG = 'THEME_CONFIG',
  GUESTDEMO_EXPIRED = 'GUESTDEMO_EXPIRED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  KEYBOARD = 'KEYBOARD',
  CONFIRMCLOSETRADE = 'CONFIRMCLOSETRADE',
  OPEN_ACCOUNT = 'OPEN_ACCOUNT',
  CREATE_CHALLENGE_SUCCESS = 'CREATE_CHALLENGE_SUCCESS',
  PAYMENT_LINK = 'PAYMENT_LINK',
}

const SHOW = `${entity}/SHOW`
const HIDE = `${entity}/HIDE`

const actionShowModal = (modalName: ModalTypes, props: any) =>
  action(SHOW, { modalName, props })

const actionCloseModal = () => action(HIDE, {})

export { SHOW, HIDE, actionShowModal, actionCloseModal }
