/**
 * Showing instruments group and open short or extended subgroup
 */

import React, { useState } from 'react'
import ThemedIcon from '../../ui/ThemedIcon'
import { InstrumentGroup, InstrumentGroupsBox } from './styled'
import {
  availbleInstrumentTypes,
  shortOpenInstruments,
} from '../../selectors/instruments'
import { connect } from 'react-redux'
import InstrumentSubGroup from './InstrumentSubGroup'
import InstrumentSubGroupShort from './InstrumentSubGroupShort'
import { IShortInstrument } from '../InstrumentsBar'
import { InstrumentType } from '../../../models/registry'

interface InstrumentGroupsProps {
  types: InstrumentType[]
  isMobile: boolean
  instruments: IShortInstrument[]
  onClose: () => void
}

const InstrumentGroups = ({
  types,
  isMobile,
  instruments,
  onClose,
}: InstrumentGroupsProps) => {
  const [subgroup, setSubgroup] = useState<{
    top: number
    group: IShortInstrument[]
  }>({ top: 0, group: [] })

  const Subgroup = isMobile ? InstrumentSubGroupShort : InstrumentSubGroup

  const updateSubgroup = (typeId: number, target: any) => {
    const group = instruments.filter((i: IShortInstrument) => i.type === typeId)
    setSubgroup({ top: target.offsetTop - 32, group })
  }

  return (
    <InstrumentGroupsBox>
      {types?.map((group: InstrumentType) => (
        <InstrumentGroup
          key={group.id}
          isOpen={true}
          onMouseEnter={({ target }) => updateSubgroup(group.id, target)}
          onClick={({ target }) => updateSubgroup(group.id, target)}
        >
          <ThemedIcon
            width={24}
            height={24}
            fill="#FFFFFF"
            src={`${process.env.PUBLIC_URL}/static/icons/instrument_types/${group.icon}.svg`}
          />
          <span>{group.label}</span>
        </InstrumentGroup>
      ))}

      {subgroup.group.length > 0 && (
        <Subgroup
          subgroup={subgroup.group}
          top={subgroup.top}
          onClose={onClose}
        />
      )}
    </InstrumentGroupsBox>
  )
}

const mapStateToProps = (state: any) => ({
  types: availbleInstrumentTypes(state),
  isMobile: state.registry.isMobile,
  instruments: shortOpenInstruments(state),
})

export default connect(mapStateToProps)(InstrumentGroups)
