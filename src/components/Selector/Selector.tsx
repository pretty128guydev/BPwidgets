/**
 * Implements a language selector list
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import Backdrop from '../Backdrop'
import { List, ListItem } from 'react-md'
import styled from 'styled-components'
import { Colors } from '../../models/color'
import { actionSetActiveWallet } from '../../actions/wallets'

const SelectorWrapper = styled.div<any>`
  flex: 0 1 76px;
  position: relative;
  height: 40px;
  font-size: 13px;
  letter-spacing: -0.22px;
  cursor: default;

  border: 2px solid ${(props) => props.borderColor};
  cursor: pointer;
  border-radius: 4px;

  .selector-arrow-down {
    font-size: 16px;
    position: absolute;
    right: 10px;
    top: 8px;
  }
  .selector-toggle {
    height: 100%;
    padding: 10px;
    font-weight: 500;
    color: ${(props) => props.color};
  }
`
export const ListHolder = styled.div<any>`
    z-index: 81;
    position: absolute;
    border-radius: 3px;
    background-color: ${(props) => props.colors.tradebox.expiryBackground};
    color: ${(props) => props.colors.secondaryText};
    left: -2px;
    right: -2px;
    top: 40px;
    max-height: 300px;
    overflow: auto;

    .rmd-list-item {
      padding: 8px 10px !important;
      min-height: unset !important;

      .rmd-list-item__text {
        font-weight: 500;
        font-size: 13px;
        line-height: 15px;
        color: ${(props) => props.colors.secondaryText};
      }
    }
}
`
interface ISellectorProps {
  borderColor?: string
  backgroundColor?: string
  color?: string

  colors: any
  renderItem: (item: any) => React.ReactNode
  onChange: (item: any) => void

  items: any[]
  renderLabel: (item: any) => React.ReactNode
  value?: any
}

const Selector = (props: ISellectorProps) => {
  const [picker, setPicker] = useState<boolean>(false)
  const [value, setValue] = useState(props.value)

  return (
    <SelectorWrapper
      color={props.color}
      backgroundColor={props.backgroundColor}
      borderColor={props.borderColor}
      className="selector-wrapper"
    >
      <div onClick={() => setPicker(true)} className="selector-toggle">
        <span>{props.renderLabel(value)}</span>
        <span className="selector-arrow-down">▾</span>
      </div>

      {picker && (
        <>
          <Backdrop
            onClick={() => {
              setPicker(false)
            }}
          />
          <ListHolder colors={props.colors} className="scrollable">
            <List style={{ padding: 0 }}>
              {props.items.map((item: any, i) => {
                return (
                  <ListItem
                    className="select-percent-item"
                    key={i}
                    onClick={() => {
                      props.onChange(item)
                      setPicker(false)
                      setValue(item)
                    }}
                  >
                    {props.renderItem(item)}
                  </ListItem>
                )
              })}
            </List>
          </ListHolder>
        </>
      )}
    </SelectorWrapper>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
})

export default connect(mapStateToProps, {
  actionSetActiveWallet: actionSetActiveWallet,
})(Selector)
