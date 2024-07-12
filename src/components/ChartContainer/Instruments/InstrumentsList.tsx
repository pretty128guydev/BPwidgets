/**
 * Showing search box and Groups of instruments
 */

import React, { useState } from 'react'
import InstrumentSearch from './InstrumentSearch'
import Backdrop from '../../Backdrop'
import InstrumentsGroup from './InstrumentGroups'
import { InstrumentsGroupBox, Panel } from './styled'

interface InstrumentsListProps {
  onClose: () => void
}

const InstrumentsList = ({ onClose }: InstrumentsListProps) => {
  const [isSearch, setIsSearch] = useState<boolean>(false)

  return (
    <>
      <Backdrop onClick={onClose} />
      <Panel>
        <InstrumentSearch onSearch={setIsSearch} onClose={onClose} />
        {!isSearch && (
          <InstrumentsGroupBox>
            <InstrumentsGroup onClose={onClose} />
          </InstrumentsGroupBox>
        )}
      </Panel>
    </>
  )
}
export default InstrumentsList
