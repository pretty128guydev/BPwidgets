/* eslint-disable react-hooks/exhaustive-deps */
/**
 * This modal is shown only when trade was accepted by backend
 * Allows to cancel trade in some period of time
 */

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import TradeSubmittedError from './TradeSubmittedError'
import TradeSubmittedSuccess from './TradeSubmittedSuccess'
import TradeSubmittedPositionClosed from './TradeSubmittedPositionClosed'
import {
  actionCloseNotification,
  INotification,
  NotificationTypes,
} from '../../../actions/notifications'
import {
  ITradeNotificationErrorProps,
  ITradeNotificationSuccessProps,
  PnlNotificationProps,
} from './interfaces'
import { t } from 'ttag'
import { formatStringCurrency } from '../../selectors/currency'

interface ITradeSubmitProps {
  formatCurrency: (input: string) => string

  notifications: INotification<
    | ITradeNotificationSuccessProps
    | PnlNotificationProps
    | ITradeNotificationErrorProps
  >[]

  actionCloseNotification: (id: number) => void
}

const NOTIFICATION_TIME = 3000

/**
 * Data layer with effect
 * @param notifications
 * @param actionCloseNotification
 */
const useNotification = (
  notifications: any[],
  actionCloseNotification: any
) => {
  const [current, setCurrent] = useState<any | null>(null)
  /**
   * Each time array changes we pick NEW current notification
   */
  useEffect(() => {
    const [currentNotification] = notifications
    if (currentNotification) {
      if (current?.id !== currentNotification.id) {
        setCurrent(currentNotification)
      }
    } else {
      setCurrent(null)
    }
  }, [notifications])
  /**
   * When we pick new notification, start timer
   */
  useEffect(() => {
    if (current) {
      let timer1 = setTimeout(
        () => actionCloseNotification(current.id),
        NOTIFICATION_TIME
      )
      return () => {
        clearTimeout(timer1)
      }
    }
  }, [current])

  return {
    current,
  }
}

const sanitizeMessage = (input: string | undefined): string => {
  if (input) {
    return input.replace(/<br>/gi, '\n')
  }
  return ''
}

/**
 * Render layer
 * @param props
 * @constructor
 */
const TradeSubmitModal = (props: ITradeSubmitProps) => {
  const { current } = useNotification(
    props.notifications,
    props.actionCloseNotification
  )

  if (!current) {
    return null
  }

  const message = current?.props.message
    ? sanitizeMessage(current?.props.message)
    : current.props.minStake
    ? `${t`Minimum investment amount`}: ${props.formatCurrency(
        String(current?.props.minStake)
      )}`
    : `${t`Maximum investment amount`}: ${props.formatCurrency(
        String(current?.props.maxStake)
      )}`

  switch (current.type) {
    case NotificationTypes.TRADE_SUBMITTED_ERROR:
    case NotificationTypes.TRADE_EDIT_STOP_LOSS_ERROR:
    case NotificationTypes.TRADE_EDIT_TAKE_PROFIT_ERROR:
    case NotificationTypes.TRADE_CLOSE_ERROR:
      return <TradeSubmittedError notification={current} message={message} />
    case NotificationTypes.TRADE_SUBMITTED_SUCCESS:
    case NotificationTypes.TRADE_EDIT_STOP_LOSS_SUCCESS:
    case NotificationTypes.TRADE_EDIT_TAKE_PROFIT_SUCCESS:
      return (
        <TradeSubmittedSuccess
          notification={current}
          message={
            current?.props.message
              ? current?.props.message
              : t`The trade was successfully opened`
          }
        />
      )
    case NotificationTypes.TRADE_SUBMITTED_POSITION_CLOSED:
      return <TradeSubmittedPositionClosed notification={current} />
    default:
      return null
  }
}

const mapStateToProps = (state: any) => ({
  notifications: state.notifications.notifications,
  formatCurrency: formatStringCurrency(state),
})

export default connect(mapStateToProps, { actionCloseNotification })(
  TradeSubmitModal
)
