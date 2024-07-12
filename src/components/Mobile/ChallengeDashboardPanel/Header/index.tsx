/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { HeaderWrapper } from './styled'
import { ReactComponent as CloseIcon } from '../icons/closeIcon.svg'
import { t } from 'ttag'

interface IHeaderSideModeProps {
  colors: any
  onClickClose: () => void
}

const HeaderSideMode = ({ colors, onClickClose }: IHeaderSideModeProps) => {
  return (
    <HeaderWrapper colors={colors}>
      <div className="title-container">
        <span className="title">{t`Trading challengers`}</span>
        <span>
          <span className="icon-close" onClick={onClickClose}>
            <CloseIcon width="30" height="30" fill="#9fabbd" />
          </span>
        </span>
      </div>
    </HeaderWrapper>
  )
}

export default HeaderSideMode
