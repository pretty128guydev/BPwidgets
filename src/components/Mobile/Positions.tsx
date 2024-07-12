/**
 * Component which acts like a drawer but contains a positions item from sidebar
 */
import React from 'react'
import styled from 'styled-components'
import PositionsPanel from '../Sidebar/PositionsPanel'
import { ThemeContextConsumer } from '../ThemeContext'
import MobilePositionsPanel from '../Sidebar/PositionsPanel/MobilePositionsPanel'

interface IDrawerProps {
  onClose: () => void
  onBack: () => void
  isMobile?: boolean
}

const Panel = styled.div<any>`
  position: fixed;
  top: 110px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.colors.backgroundDefault};
  display: flex;
  flex-direction: column;
  z-index: 999;
`

const Positions = (props: IDrawerProps) => (
  <ThemeContextConsumer>
    {(colors) => (
      <Panel colors={colors}>
        {props.isMobile ? (
          <MobilePositionsPanel
            colors={colors}
            isMobile={true}
            onClose={props.onClose}
            onBack={props.onBack}
          />
        ) : (
          <PositionsPanel
            colors={colors}
            isMobile={true}
            onClose={props.onClose}
          />
        )}
      </Panel>
    )}
  </ThemeContextConsumer>
)

export default Positions
