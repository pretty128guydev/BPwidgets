import React from 'react'
import { t } from 'ttag'
import { TradeSubmittedPositionClosedModal } from './styled'
import { connect } from 'react-redux'
import {
  actionCloseNotification,
  INotification,
} from '../../../actions/notifications'
import { ITradeNotificationSuccessProps } from './interfaces'
import { ReactComponent as SuccessIcon } from './success.svg'

interface ITradeSubmittedSuccess {
  isMobile: boolean
  colors: any
  notification: INotification<ITradeNotificationSuccessProps>
  actionCloseNotification: (id: number) => void
}

const TradeSubmittedPositionClosed = (props: ITradeSubmittedSuccess) => {
  return (
    <TradeSubmittedPositionClosedModal
      colors={props.colors}
      isMobile={props.isMobile}
    >
      <div
        className="closeButton"
        onClick={() => props.actionCloseNotification(props.notification.id)}
      />
      <SuccessIcon className="icon-success" fill={props.colors.primaryText} />
      <span>{t`Trade Closed`}</span>
    </TradeSubmittedPositionClosedModal>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, { actionCloseNotification })(
  TradeSubmittedPositionClosed
)
