/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Panel = styled.div<{
  colors: any
  isMobile: boolean
  maxWidth: number
  minWidth: number
}>`
  display: flex;
  flex-direction: column;
  position: ${(props) => (props.isMobile ? 'fixed' : 'absolute')};
  z-index: 50;
  top: 0;
  bottom: 0;
  max-width: ${(props) => (props.isMobile ? 'auto' : `${props.maxWidth}px`)};
  min-width: ${(props) => (props.isMobile ? 'auto' : `${props.minWidth}px`)};
  left: ${(props) => (props.isMobile ? '0' : '87')}px;
  width: ${(props) => (props.isMobile ? ' 100%' : '300px')};
  box-shadow: 0 2px 15px 0 #031420;
  background-color: ${(props) => props.colors.backgroundHue1};
`

const PanelAdjuster = styled.div<{ colors: any }>`
  width: 8px;
  position: absolute;
  cursor: ew-resize;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: ${(props) => props.colors.backgroundHue1};

  &:after {
    content: '';
    width: 4px;
    height: 20px;
    position: absolute;
    cursor: ew-resize;
    top: 50%;
    border-left: 1px solid black;
    border-right: 1px solid black;
    transform: translate3d(0, -50%, 0);
    margin: 0 2px;
  }
`

interface ISidebarContentsPanelProps {
  colors: any
  adjustable: boolean
  children: any
  isMobile: boolean
  sidebarWidth?: (width: number) => void
}

interface IMoving {
  offset: number
  max: number
  min: number
}

const PANEL_MAX_WIDTH = 800
const PANEL_MIN_WIDTH = 300

const SidebarContentsPanel = ({
  colors,
  adjustable,
  children,
  isMobile,
  sidebarWidth,
}: ISidebarContentsPanelProps) => {
  const [moving, setMoving] = useState<IMoving | null>(null)
  const panel = useRef<HTMLDivElement | any>(null)

  document.onmouseup = () => stopMove()

  const stopMove = () => {
    document.onmousemove = null
    setMoving(null)
  }

  const startMove = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const offset = ev.pageX - Number(panel.current?.clientWidth)
    const max = offset + PANEL_MAX_WIDTH
    const min = offset + PANEL_MIN_WIDTH
    setMoving({ offset, max, min })
  }

  useEffect(() => {
    if (panel && sidebarWidth) {
      sidebarWidth(panel.current.clientWidth)
    }
    if (moving) {
      document.onmousemove = ({ pageX }: MouseEvent) => {
        if (pageX > moving.max || pageX < moving.min) {
          return
        }

        const width = pageX - moving.offset

        const animation = () => {
          if (panel.current && !isMobile) {
            panel.current.style.width = `${width}px`
          }
        }

        window.requestAnimationFrame(animation)
        if (sidebarWidth) {
          sidebarWidth(width)
        }
      }
    }
  }, [moving])

  return (
    <Panel
      ref={panel}
      minWidth={PANEL_MIN_WIDTH}
      maxWidth={PANEL_MAX_WIDTH}
      colors={colors}
      isMobile={isMobile}
    >
      {adjustable && (
        <PanelAdjuster colors={colors} onMouseDown={(ev) => startMove(ev)} />
      )}
      {children}
    </Panel>
  )
}

export default SidebarContentsPanel
