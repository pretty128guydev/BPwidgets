import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { t } from 'ttag'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { isLoggedIn } from '../selectors/loggedIn'
import {
  actionAddInstrumentToTop,
  actionRemoveInstrumentFromTop,
} from '../../actions/account'
import { TopActiveIcon as AddTopIcon } from '../ChartContainer/InstrumentsBar/topActiveIcon'
import { TopIcon as RemoveTopIcon } from '../ChartContainer/InstrumentsBar/topIcon'

interface ITopIconProps {
  instrumentId: number
  isTop: boolean
  isLoggedIn: boolean
  actionAddInstrumentToTop: (id: any) => void
  actionRemoveInstrumentFromTop: (id: any) => void
  actionShowModal: (mt: ModalTypes, props?: any) => void
  colors: any
}

const TopIcon = ({
  isTop,
  instrumentId,
  isLoggedIn,
  actionAddInstrumentToTop,
  actionRemoveInstrumentFromTop,
  actionShowModal,
  colors,
}: ITopIconProps) => {
  const updateTopInstruments = (): void => {
    if (!isLoggedIn) {
      actionShowModal(ModalTypes.SESSION_EXPIRED, {})
      return
    }

    !isTop
      ? actionAddInstrumentToTop(instrumentId)
      : actionRemoveInstrumentFromTop(instrumentId)
  }

  const iconId = Math.floor(Math.random() * 999901 + 1000)

  return (
    <div
      className="top-icon-container"
      style={{ display: 'inline-flex' }}
      data-tip=""
      data-for={'top-icon' + iconId}
    >
      {isTop ? (
        <RemoveTopIcon
          width="16"
          height="16"
          fill={colors.primaryText}
          stroke={colors.primaryText}
          onClick={(e: React.SyntheticEvent<any>) => {
            e.stopPropagation()
            updateTopInstruments()
          }}
        />
      ) : (
        <AddTopIcon
          width="16"
          height="16"
          fill={colors.primaryText}
          stroke={colors.primaryText}
          onClick={(e: React.SyntheticEvent<any>) => {
            e.stopPropagation()
            updateTopInstruments()
          }}
        />
      )}
      <ReactTooltip
        offset={{ top: 5 }}
        id={'top-icon' + iconId}
        place="top"
        className="react-tooltip-small"
      >
        {isTop ? t`Remove from chart` : t`Add to chart`}
      </ReactTooltip>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  colors: state.theme,
})

export default connect(mapStateToProps, {
  actionAddInstrumentToTop,
  actionShowModal,
  actionRemoveInstrumentFromTop,
})(TopIcon)
