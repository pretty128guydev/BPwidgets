/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { AssetsSearchInput, AssetsSearchWrapper } from './styled'
import { ReactComponent as SearchIcon } from '../../../ChartContainer/Instruments/search.svg'
import { ReactComponent as CloseIcon } from './closeIcon.svg'
import { t } from 'ttag'

interface IAssetsSearchProps {
  colors: any
  onSearch: (value: string) => void
  onClickClose: () => void
}

const Search = ({ colors, onSearch, onClickClose }: IAssetsSearchProps) => {
  const [searchValue, setSearchValue] = useState<string>('')
  let timeout = useRef<any>(null)

  useEffect(() => {
    clearTimeout(timeout.current)

    timeout.current = setTimeout(() => {
      onSearch(searchValue)
    }, 1000)

    return () => clearTimeout(timeout.current)
  }, [searchValue])

  return (
    <AssetsSearchWrapper colors={colors}>
      <div className="title-container">
        <span className="title">{t`Select an asset`}</span>
        <span className="icon-full-mode" onClick={onClickClose}>
          <CloseIcon
            width="35"
            height="35"
            fill={colors.backgroundHue3}
            stroke={colors.defaultText}
          />
        </span>
      </div>
      <div className="input-container">
        <SearchIcon
          width="24"
          height="24"
          fill={colors.defaultText}
          stroke={colors.defaultText}
        />
        <AssetsSearchInput
          colors={colors}
          placeholder={t`Type asset name to search`}
          onChange={(e: any) => setSearchValue(e.target.value)}
          value={searchValue}
        />
      </div>
    </AssetsSearchWrapper>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
})

export default connect(mapStateToProps)(Search)
