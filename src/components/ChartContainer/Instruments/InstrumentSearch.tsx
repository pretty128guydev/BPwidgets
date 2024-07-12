/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Showing search Input and list of search result
 */

import React, { useEffect, useState } from 'react'
import { ReactComponent as SearchIcon } from './search.svg'
import { InstrumentGroup } from './styled'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../InstrumentsBar/asset-placeholder.svg'
import { connect } from 'react-redux'
import { actionSelectInstrument } from '../../../actions/trading'
import { shortOpenInstruments } from '../../selectors/instruments'
import { IShortInstrument } from '../InstrumentsBar'
import { searchInstruments } from '../../../shares/functions'

interface InstrumentSearchProps {
  instruments: IShortInstrument[]
  onSearch: (state: boolean) => void
  actionSelectInstrument: (id: any) => void
  onClose: () => void
}

const InstrumentSearch = ({
  instruments,
  onSearch,
  actionSelectInstrument,
  onClose,
}: InstrumentSearchProps) => {
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')

  const searchedItems = searchInstruments(instruments, searchValue)

  useEffect(() => {
    const isSearch = searchValue.length >= 2
    setIsSearch(isSearch)
    onSearch(isSearch)
  }, [searchValue])

  return (
    <>
      <div className="input__group">
        <SearchIcon width="24" height="24" fill="#9fabbd" />
        <input
          type="text"
          onChange={(e: any) => setSearchValue(e.target.value)}
          value={searchValue}
          placeholder="Search..."
        />
      </div>

      {isSearch &&
        searchedItems.map((item: IShortInstrument) => (
          <InstrumentGroup
            isOpen={(item.tradingHours as any).isOpen}
            key={item.instrumentID}
            onClick={() => {
              actionSelectInstrument(item.instrumentID)
              onClose()
            }}
          >
            <ImageWrapper
              alt={item.name}
              src={`${process.env.PUBLIC_URL}/static/icons/instruments/${item.instrumentID}.svg`}
              placeholderSrc={AssetPlaceholder}
            />
            <span>{item.name}</span>
          </InstrumentGroup>
        ))}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  instruments: shortOpenInstruments(state),
})

export default connect(mapStateToProps, { actionSelectInstrument })(
  InstrumentSearch
)
