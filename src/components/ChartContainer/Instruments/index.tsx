/**
 * Showing assets list button and showing instruments list onClick
 */
import { InstrumentsBox } from './styled'
import InstrumentsSelector from './InstrumentsSelector'
import InstrumentsList from './InstrumentsList'
import React, { useState } from 'react'

const InstrumentsPicker = (props: { colors?: any; isMobile?: boolean }) => {
  const [picker, setPicker] = useState<boolean>(false)

  return (
    <InstrumentsBox className="intrument-picker">
      <InstrumentsSelector onClick={() => setPicker(true)} />
      {picker && <InstrumentsList onClose={() => setPicker(false)} />}
    </InstrumentsBox>
  )
}

export default InstrumentsPicker
