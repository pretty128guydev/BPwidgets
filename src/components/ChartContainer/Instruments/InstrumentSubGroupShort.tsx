/**
 * Showing simple list of instrument group, used for mobile
 */

import React from 'react'
import { SubGroup, SubGroupItem } from './styled'
import { selectedInstrument } from '../../selectors/instruments'
import { connect } from 'react-redux'
import { actionSelectInstrument } from '../../../actions/trading'
import { IShortInstrument } from '../InstrumentsBar'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../InstrumentsBar/asset-placeholder.svg'
import { actionAddInstrumentToTop } from '../../../actions/account'
import InstrumentFavorite from './instrumentFavorite'

interface InstrumentSubGroupShortProps {
  subgroup: IShortInstrument[]
  colors: any
  isMobile: boolean
  selectedInstrument: number
  onClose: () => void
  actionSelectInstrument: (id: number) => void
  actionAddInstrumentToTop: (id: number) => void
}

const InstrumentSubShortGroup = ({
  selectedInstrument,
  subgroup,
  colors,
  isMobile,
  onClose,
  actionSelectInstrument,
  actionAddInstrumentToTop,
}: InstrumentSubGroupShortProps) => {
  return (
    <SubGroup className="scrollable">
      {subgroup.map((item: IShortInstrument) => (
        <SubGroupItem
          key={item.instrumentID}
          onClick={() => {
            actionSelectInstrument(item.instrumentID)
            actionAddInstrumentToTop(item.instrumentID)
            onClose()
          }}
          active={selectedInstrument === item.instrumentID}
          isOpen={item.isOpen}
          colors={colors}
          isMobile={isMobile}
        >
          <ImageWrapper
            alt={item.name}
            src={`${process.env.PUBLIC_URL}/static/icons/instruments/${item.instrumentID}.svg`}
            placeholderSrc={AssetPlaceholder}
          />
          <span>{item.description}</span>
          <InstrumentFavorite instrumentId={item.instrumentID} />
        </SubGroupItem>
      ))}
    </SubGroup>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  selectedInstrument: selectedInstrument(state),
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
})(InstrumentSubShortGroup)
