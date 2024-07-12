/**
 * UI-kit tabs
 * Accept theme from redux
 */
import React from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'

const TabsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
`

const Tab = styled.span<{ colors: any; active: boolean; disabled: boolean }>`
  flex: 1;
  box-sizing: border-box;
  letter-spacing: -0.06px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  outline: none;
  font-weight: 700;
  font-size: 12px;
  padding: 6px;
  color: ${(props) =>
    props.disabled
      ? '#263346'
      : props.active
      ? props.colors.secondaryText
      : props.colors.defaultText};
  ${(props) =>
    props.active
      ? css`
          border-bottom: 2px solid ${props.colors.accentDefault};
        `
      : ``};
`

interface ITabsProps {
  colors: any
  value: any
  tabs: any[]
  onChange: (index: number) => void
  disabledTabIndex?: number[]
}

const Tabs = ({
  value,
  colors,
  tabs,
  onChange,
  disabledTabIndex,
}: ITabsProps) => (
  <TabsContainer>
    {tabs.map((tab: string, index: number) => (
      <Tab
        key={index}
        colors={colors}
        tabIndex={index + 1}
        active={value === index}
        onClick={() =>
          disabledTabIndex && disabledTabIndex.includes(index)
            ? {}
            : onChange(index)
        }
        disabled={!!(disabledTabIndex && disabledTabIndex.includes(index))}
      >
        {tab}
      </Tab>
    ))}
  </TabsContainer>
)

export default connect((state: any) => ({ colors: state.theme }))(Tabs)
