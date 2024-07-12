/**
 * Showing extended list of instrument group
 */

import React from 'react'
import { SubGroup, SubGroupItem } from './styled'
import { List } from 'react-virtualized'
import { selectedInstrument } from '../../selectors/instruments'
import { connect } from 'react-redux'
import { actionSelectInstrument } from '../../../actions/trading'
import { IShortInstrument } from '../InstrumentsBar'
import InstrumentFavorite from './instrumentFavorite'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../InstrumentsBar/asset-placeholder.svg'
import { actionAddInstrumentToTop } from '../../../actions/account'

interface InstrumentSubGroupProps {
  subgroup: IShortInstrument[]
  colors: any
  isMobile: boolean
  selectedInstrument: number
  top: number
  onClose: () => void
  actionSelectInstrument: (id: number) => void
  actionAddInstrumentToTop: (id: number) => void
}

const InstrumentSubGroup = ({
  subgroup,
  isMobile,
  selectedInstrument,
  colors,
  top,
  onClose,
  actionSelectInstrument,
  actionAddInstrumentToTop,
}: InstrumentSubGroupProps) => {
  const subGroupList = ({ index, style }: any) => {
    const item = subgroup[index]

    return (
      <SubGroupItem
        key={item.instrumentID}
        onClick={() => {
          actionSelectInstrument(item.instrumentID)
          actionAddInstrumentToTop(item.instrumentID)
          onClose()
        }}
        active={selectedInstrument === item.instrumentID}
        isOpen={item.isOpen}
        style={style}
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
    )
  }

  return (
    <SubGroup top={top}>
      <List
        width={334}
        height={182}
        rowCount={subgroup.length}
        rowHeight={35}
        rowRenderer={subGroupList}
        className="scrollable"
      />
    </SubGroup>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
  selectedInstrument: selectedInstrument(state),
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
})(InstrumentSubGroup)
