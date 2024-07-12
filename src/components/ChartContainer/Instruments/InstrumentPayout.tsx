import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getCurrentPayout } from '../../../core/currentPayout'
import { InstrumentPayoutItem } from './styled'
import { IInstrument } from '../../../core/API'

interface IInstrumentPayoutProps {
  gameType: number
  instrumentId: number
  instrument: IInstrument
  payoutDeltas: number
  maxClientPayouts: number
  color: any
}

const InstrumentPayout = ({
  gameType,
  instrument,
  payoutDeltas,
  maxClientPayouts,
  color,
}: IInstrumentPayoutProps) => {
  const [payout, setPayout] = useState<number | null>(null)

  const currentPayout = getCurrentPayout(
    gameType,
    instrument,
    payoutDeltas,
    maxClientPayouts
  )

  useEffect(() => {
    setPayout(currentPayout)
  }, [currentPayout])

  return payout ? (
    <InstrumentPayoutItem color={color}>{payout}%</InstrumentPayoutItem>
  ) : (
    <span>...</span>
  )
}

const mapStateToProps = (
  state: any,
  { instrumentId }: { instrumentId: number }
) => ({
  payoutDeltas: state.registry.data.payoutDeltas,
  maxClientPayouts: state.registry.data.maxClientPayouts,
  gameType: state.game?.gameType,
  instrument: state.instruments[instrumentId],
})

export default connect(mapStateToProps)(InstrumentPayout)
