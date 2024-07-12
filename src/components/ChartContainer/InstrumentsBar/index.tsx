/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/**
 * Draw favorites assets, switcher and select assets
 */
import React, { useEffect, useRef, useState } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import { IInstrument, IUserInfo } from '../../../core/API'
import { actionSelectInstrument } from '../../../actions/trading'
import { defaultTopAssets } from '../../selectors/instruments'
import { isLoggedIn } from '../../selectors/loggedIn'
import AssetPlaceholder from './asset-placeholder.svg'
import {
  ArrowLeft,
  ArrowRight,
  FlexWrapper,
  Instrument,
  InstrumentCaption,
  Instruments,
  InstrumentsContainer,
  InstrumentsHolder,
  InstrumentTop,
  Panel,
} from './styled'
import ImageWrapper from '../../ui/ImageWrapper'
import { ContainerState } from '../../../reducers/container'
import { actionSetContainer } from '../../../actions/container'
import { ReactComponent as SearchIcon } from '../Instruments/search.svg'
import TopIcon from '../../ui/TopIcon'

export interface IShortInstrument {
  instrumentID: any
  name: string
  isOpen: boolean
  selected: boolean
  favorite: boolean
  tradingHours: any
  type: number
  description?: string
  starred: boolean
}

interface IInstrumentsBarProps {
  isLoggedIn: boolean
  userInfo: IUserInfo | null
  instruments: any[]
  assetsOpened: boolean
  colors: any
  selected: string
  actionSelectInstrument: (id: any) => void
  actionSetContainer: (state: ContainerState) => void
  defaultTopAssets: any[]
  isInAssets: boolean
  container: ContainerState
}

export enum InstrumentTypes {
  crypto = 6,
  forex = 1,
  stocks = 2,
  commodities = 3,
  indices = 4,
}

const SORTING_TYPES = [
  InstrumentTypes.crypto,
  InstrumentTypes.forex,
  InstrumentTypes.stocks,
  InstrumentTypes.commodities,
  InstrumentTypes.indices,
]

const FRAME_RATE = 15
/**
 * Create array of animation frames
 * Create FRAME_RATE linear frames
 */
const createAnimationFrames = (delta: number): number[] => {
  const result = []
  const chunk = delta / FRAME_RATE
  for (let index = 0; index < FRAME_RATE; index++) {
    result.push(chunk)
  }
  return result
}

const InstrumentsBar = (props: IInstrumentsBarProps) => {
  const [domWidth, setDomWidth] = useState<number>(30000)
  const [frames, setFrames] = useState<number[]>([])
  const [instruments, setInstruments] = useState<any>([])
  const scrollContainer: any = useRef(null)

  const userTopAssets = props.userInfo?.topAssets || []
  const topAssets = props.isLoggedIn
    ? userTopAssets.length > 0
      ? props.userInfo?.topAssets
      : props.defaultTopAssets.map(({ instrumentID }) => instrumentID)
    : props.defaultTopAssets.map(({ instrumentID }) => instrumentID)

  useEffect(() => {
    let instrumentsProps: IInstrument[] = !props.isLoggedIn
      ? props.defaultTopAssets
      : props.instruments.filter(({ instrumentID }: any) =>
          topAssets?.includes(instrumentID)
        )
    const openInstruments: IInstrument[] = []
    const closedInstruments: IInstrument[] = []

    SORTING_TYPES.forEach((instrumentType) => {
      const typeInstruments = instrumentsProps.filter(
        ({ type }) => Number(type) === instrumentType
      )
      typeInstruments.forEach((instrument) => {
        instrument.isOpen
          ? openInstruments.push(instrument)
          : closedInstruments.push(instrument)
      })
    })

    setInstruments([...openInstruments, ...closedInstruments])
  }, [props.isLoggedIn, props.userInfo?.topAssets])

  /**
   * Recalculate DOM width of all children of the scroll container
   */
  useEffect(() => {
    const elementsContainer = scrollContainer.current.firstChild
    const children = elementsContainer.children
    let totalWidth = 0

    for (var i = 0; i < children.length; i++) {
      totalWidth += children[i].offsetWidth
    }
    setDomWidth(totalWidth)
  }, [instruments, scrollContainer])

  /**
   * Animation will restart only when frames will reset
   */
  useEffect(() => {
    let timerDelay: any
    const delay = 1

    const onLoop = () => {
      const frame = frames.pop()
      if (frame) {
        window.requestAnimationFrame(() => {
          scrollContainer.current.scrollLeft += frame
          timerDelay = setTimeout(onLoop, delay)
        })
      } else {
        // clear timer
      }
    }

    timerDelay = setTimeout(onLoop, delay)

    return () => {
      clearTimeout(timerDelay)
    }
  }, [frames])

  const onMove = (delta: number) => setFrames(createAnimationFrames(delta))

  return (
    <Panel className="instrument-bar" colors={props.colors}>
      {props.container !== ContainerState.assets && (
        <InstrumentCaption
          colors={props.colors}
          selected={props.assetsOpened}
          onClick={() => props.actionSetContainer(ContainerState.assets)}
        >
          <SearchIcon width="24" height="24" />
          {t`All assets`}
        </InstrumentCaption>
      )}
      <InstrumentsContainer>
        <ArrowLeft colors={props.colors} onClick={() => onMove(-300)} />
        <InstrumentsHolder ref={scrollContainer}>
          <Instruments width={domWidth}>
            {instruments.map(
              ({ instrumentID, name, isOpen, favorite }: IShortInstrument) => {
                return (
                  <Instrument
                    colors={props.colors}
                    key={instrumentID}
                    isOpen={isOpen}
                    selected={instrumentID === props.selected}
                    onClick={() => {
                      props.actionSelectInstrument(instrumentID)
                      props.isInAssets &&
                        props.actionSetContainer(ContainerState.trade)
                    }}
                  >
                    <FlexWrapper>
                      <ImageWrapper
                        klass="asset_icon"
                        alt={`instrument ${instrumentID}`}
                        src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrumentID}.svg`}
                        placeholderSrc={AssetPlaceholder}
                      />
                      <span>{name}</span>
                      <InstrumentTop>
                        <TopIcon
                          isTop={userTopAssets.includes(instrumentID)}
                          instrumentId={instrumentID}
                        />
                      </InstrumentTop>
                    </FlexWrapper>
                  </Instrument>
                )
              }
            )}
          </Instruments>
        </InstrumentsHolder>
        <ArrowRight colors={props.colors} onClick={() => onMove(300)} />
      </InstrumentsContainer>
    </Panel>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  colors: state.theme,
  defaultTopAssets: defaultTopAssets(state),
  userInfo: state.account.userInfo,
  instruments: Object.values(state.instruments),
  selected: state.trading.selected,
  assetsOpened: state.container.content === ContainerState.assets,
  container: state.container.content,
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionSetContainer,
})(InstrumentsBar)
