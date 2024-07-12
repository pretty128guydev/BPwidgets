/**
 * Implements a Tutorials panel
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import styled from 'styled-components'
import { SidebarCaption } from '..'
import ReactPlayer from 'react-player'
import CloseButton from '../CloseBtn'
import SidebarContentsPanel from '../SidebarContentsPanel'
import { ArticleList } from '../NewsPanel/styled'

const VideoContainer = styled.div<any>`
  display: block;
  box-sizing: border-box;
  width: 270px;
  margin: 0 auto;
  margin-bottom: 10px;

  span {
    display: block;
    box-sizing: border-box;
    width: 100%;
    font-size: 11px;
    padding-bottom: 6px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 12px;
    user-select: none;
    background-color: ${(props) => props.colors.tradebox.fieldBackground};
    color: ${(props) => props.colors.secondaryText};
  }
`
interface IVideoData {
  defaultLang: string
  enabled: boolean
  images: any
  length: any
  titles: any
  order: number[]
  wow: any
  videoList: {
    title: string
    source: string
    image: string
  }[]
}
interface ITutorialsPanelProps {
  colors: any
  data: IVideoData
  onClose: () => void
}

const TutorialsPanel = (props: ITutorialsPanelProps) => {
  const [playing, setPlaying] = useState(-1)
  const { data, colors } = props
  const { videoList, order } = data
  return (
    <SidebarContentsPanel colors={colors} adjustable={false} isMobile={false}>
      <SidebarCaption colors={colors}>{t`Tutorials`}</SidebarCaption>
      <CloseButton colors={colors} onClick={props.onClose} />
      <ArticleList className="scrollable">
        {order.map((key: number, index: number) => {
          return (
            <VideoContainer key={key} colors={colors}>
              {playing !== index && (
                <div
                  key={key}
                  onClick={() => setPlaying(index)}
                  style={{
                    width: 270,
                    height: 150,
                    background: `url(${videoList[key]?.image}) no-repeat`,
                    backgroundSize: 'cover',
                  }}
                />
              )}
              {playing === index && (
                <ReactPlayer
                  width="270"
                  height="150"
                  key={index}
                  url={videoList[key]?.source}
                  autoPlay
                  playing
                  controls
                />
              )}
              <span>
                {index + 1}. {videoList[key]?.title}
              </span>
            </VideoContainer>
          )
        })}
      </ArticleList>
    </SidebarContentsPanel>
  )
}

const mapStateToProps = (state: any) => ({
  data: state.registry.data.partnerConfig.leftPanel.videos,
})

export default connect(mapStateToProps)(TutorialsPanel)
