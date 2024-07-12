import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { t } from 'ttag'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { isLoggedIn } from '../selectors/loggedIn'
import {
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromFavorites,
} from '../../actions/account'
import { FavoritesActiveIcon } from '../ChartContainer/InstrumentsBar/favoritesActiveIcon'
import { FavoritesIcon } from '../ChartContainer/InstrumentsBar/favoritesIcon'

interface IFavIconProps {
  instrumentId: number
  isFav: boolean
  isLoggedIn: boolean
  actionAddInstrumentToFavorites: (id: any) => void
  actionRemoveInstrumentFromFavorites: (id: any) => void
  actionShowModal: (mt: ModalTypes, props?: any) => void
  colors: any
  hideTooltip?: boolean
}

const FavIcon = ({
  isFav,
  instrumentId,
  isLoggedIn,
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromFavorites,
  actionShowModal,
  colors,
  hideTooltip,
}: IFavIconProps) => {
  const updateFavInstruments = (): void => {
    if (!isLoggedIn) {
      actionShowModal(ModalTypes.SESSION_EXPIRED, {})
      return
    }

    !isFav
      ? actionAddInstrumentToFavorites(instrumentId)
      : actionRemoveInstrumentFromFavorites(instrumentId)
  }

  const iconId = Math.floor(Math.random() * 999901 + 1000)

  return (
    <div
      style={{ display: 'inline-block', cursor: 'pointer' }}
      data-tip=""
      data-for={'fav-icon' + iconId}
    >
      {isFav ? (
        <FavoritesActiveIcon
          width="16"
          height="16"
          fill={colors.primaryText}
          onClick={(e: React.SyntheticEvent<any>) => {
            e.stopPropagation()
            updateFavInstruments()
          }}
        />
      ) : (
        <FavoritesIcon
          width="16"
          height="16"
          stroke={colors.primaryText}
          onClick={(e: React.SyntheticEvent<any>) => {
            e.stopPropagation()
            updateFavInstruments()
          }}
        />
      )}
      {!hideTooltip && (
        <ReactTooltip
          id={'fav-icon' + iconId}
          place="top"
          className="react-tooltip-small"
          offset={{ top: 5 }}
        >
          {isFav ? t`Remove from Favorites` : t`Add to Favorites`}
        </ReactTooltip>
      )}
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  colors: state.theme,
})

export default connect(mapStateToProps, {
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromFavorites,
  actionShowModal,
})(FavIcon)
