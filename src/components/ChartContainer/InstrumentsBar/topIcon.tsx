import React from 'react'

export const TopIcon = (props: any) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={props.onClick}
    >
      <rect x="3" y="7" width="10" height="2" fill={props.fill} />
      <circle cx="8" cy="8" r="7.5" stroke={props.stroke} />
    </svg>
  )
}
