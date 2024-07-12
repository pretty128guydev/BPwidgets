import React, { useState } from 'react'
import styled from 'styled-components'

export const BackBtn = styled.div<{ top: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: 10px;
  cursor: pointer;
  z-index: 999;
`
const BackBtnRound = (props: any) => {
  return (
    <BackBtn
      id="back-btn__sidebar-panel"
      top={props.top ? props.top : 10}
      onClick={props.onClick}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="17" cy="17" r="17" fill="#263346" />
        <path
          d="M19 23L13 17L19 11"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BackBtn>
  )
}

export default BackBtnRound
