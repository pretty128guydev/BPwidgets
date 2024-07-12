/**
 * UI-kit tabs
 * Accept theme from redux
 */
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 41px;
  line-height: 41px;
`
const Tab = styled.span<{ colors: any; active: boolean }>`
  flex: 1;
  box-sizing: border-box;
  font-size: 12px;
  letter-spacing: -0.06px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  outline: none;

  color: ${(props) =>
    props.active ? props.colors.primaryText : props.colors.secondaryText};
  border-bottom: ${(props) =>
    props.active
      ? `2px solid ${props.colors.accentDefault}`
      : `1px solid ${props.colors.sidebarBorder}`};
`

interface ITabsProps {
  colors: any
  value: any
  tabs: any[]
  onChange: (index: number) => void
}

const Tabs = ({ value, colors, tabs, onChange }: ITabsProps) => (
  <TabsContainer>
    {tabs.map((tab: string, index: number) => (
      <Tab
        key={index}
        colors={colors}
        tabIndex={index + 1}
        active={value === index}
        onClick={() => onChange(index)}
      >
        {tab}
      </Tab>
    ))}
  </TabsContainer>
)

export default connect((state: any) => ({ colors: state.theme }))(Tabs)
