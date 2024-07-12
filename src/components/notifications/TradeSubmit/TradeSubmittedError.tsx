import React from 'react'
import { connect } from 'react-redux'
import { TradeSubmittedModal } from './styled'
import {
  actionCloseNotification,
  INotification,
} from '../../../actions/notifications'
import { ITradeNotificationErrorProps } from './interfaces'

interface ITradeSubmittedErrorProps {
  isMobile: boolean
  colors: any
  notification: INotification<ITradeNotificationErrorProps>
  actionCloseNotification: (id: number) => void
  message: string
}

/**
 * Sanitize input: replace <br> to '\n'
 * @param input
 */

const TradeSubmittedError = (props: ITradeSubmittedErrorProps) => {
  return (
    <TradeSubmittedModal
      colors={props.colors}
      success={false}
      isMobile={props.isMobile}
    >
      <div
        className="closeButton"
        onClick={() => props.actionCloseNotification(props.notification.id)}
      />
      <span>{props.message}</span>
    </TradeSubmittedModal>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, { actionCloseNotification })(
  TradeSubmittedError
)
