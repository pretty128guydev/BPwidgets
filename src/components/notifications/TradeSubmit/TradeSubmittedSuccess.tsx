import React from 'react'
import { TradeSubmittedModal } from './styled'
import { connect } from 'react-redux'
import {
  actionCloseNotification,
  INotification,
} from '../../../actions/notifications'
import { ITradeNotificationSuccessProps } from './interfaces'

interface ITradeSubmittedSuccess {
  isMobile: boolean
  colors: any
  notification: INotification<ITradeNotificationSuccessProps>
  actionCloseNotification: (id: number) => void
  message: string
}

const TradeSubmittedSuccess = (props: ITradeSubmittedSuccess) => {
  return (
    <TradeSubmittedModal
      colors={props.colors}
      success={true}
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
  TradeSubmittedSuccess
)
