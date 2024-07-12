import { action } from 'typesafe-actions'

const entity = `notification`

export interface INotification<T> {
	type: NotificationTypes
	id: number
	props: T
}

enum NotificationTypes {
	TRADE_EDIT_STOP_LOSS_SUCCESS = 'TRADE_EDIT_STOP_LOSS_SUCCESS',
	TRADE_EDIT_STOP_LOSS_ERROR = 'TRADE_EDIT_STOP_LOSS_ERROR',
	TRADE_EDIT_TAKE_PROFIT_SUCCESS = 'TRADE_EDIT_TAKE_PROFIT_SUCCESS',
	TRADE_EDIT_TAKE_PROFIT_ERROR = 'TRADE_EDIT_TAKE_PROFIT_ERROR',
	TRADE_CLOSE_SUCCESS = 'TRADE_CLOSE_SUCCESS',
	TRADE_CLOSE_ERROR = 'TRADE_CLOSE_ERROR',
	TRADE_SUBMITTED_SUCCESS = 'TRADE_SUBMITTED_SUCCESS',
	TRADE_SUBMITTED_ERROR = 'TRADE_SUBMITTED_ERROR',
	TRADE_SUBMITTED_POSITION_CLOSED = 'TRADE_SUBMITTED_POSITION_CLOSED',
}

const SHOW = `${entity}/SHOW`
const HIDE = `${entity}/HIDE`
const CLEAR = `${entity}/CLEAR`

const actionShowNotification = <T>(type: NotificationTypes, props: T) => {
	const id = new Date().getTime()
	return action(SHOW, { id, type, props })
}

const actionCloseNotification = (id: number) => action(HIDE, { id })

const actionClearNotifications = () => action(CLEAR, {})

export {
	SHOW,
	HIDE,
	CLEAR,
	NotificationTypes,
	actionShowNotification,
	actionCloseNotification,
	actionClearNotifications,
}
