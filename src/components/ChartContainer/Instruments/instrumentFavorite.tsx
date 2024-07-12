import React from 'react'
import { getFavoriteInstruments } from '../../selectors/instruments'
import { connect } from 'react-redux'
import {
  actionAddInstrumentToFavorites,
  actionRemoveInstrumentFromFavorites,
} from '../../../actions/account'
import { ReactComponent as FavoriteSvg } from './starred.svg'
import { ReactComponent as NotFavoriteSvg } from './not_starred.svg'
import { isLoggedIn } from '../../selectors/loggedIn'
import { actionShowModal, ModalTypes } from '../../../actions/modal'

interface IInstrumentFavoriteProps {
  instrumentId: number
  isLoggedIn: boolean
  favoriteInstruments: number[]
  actionRemoveInstrumentFromFavorites: (id: any) => void
  actionAddInstrumentToFavorites: (id: any) => void
  actionShowModal: any
}

const InstrumentFavorite = ({
  instrumentId,
  isLoggedIn,
  favoriteInstruments,
  actionRemoveInstrumentFromFavorites,
  actionAddInstrumentToFavorites,
  actionShowModal,
}: IInstrumentFavoriteProps) => {
  const favorite = favoriteInstruments.includes(instrumentId)
  const Favorite = favorite ? FavoriteSvg : NotFavoriteSvg

  const updateFavorite = (e: React.SyntheticEvent<any>) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      actionShowModal(ModalTypes.SESSION_EXPIRED)
      return
    }

    const action = favorite
      ? actionRemoveInstrumentFromFavorites
      : actionAddInstrumentToFavorites

    action(instrumentId)
  }

  return (
    <span onClick={(e) => updateFavorite(e)}>
      <Favorite />
    </span>
  )
}

const mapStateToProps = (state: any) => ({
  favoriteInstruments: getFavoriteInstruments(state),
  isLoggedIn: isLoggedIn(state),
})

export default connect(mapStateToProps, {
  actionRemoveInstrumentFromFavorites,
  actionAddInstrumentToFavorites,
  actionShowModal,
})(InstrumentFavorite)
