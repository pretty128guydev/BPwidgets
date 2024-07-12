import React from 'react'

export const CallPayCreditCardIcon = (props: any) => {
  const { width, height, color = '#8491A3' } = props

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 55 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="card-icon">
        <rect
          id="Rectangle"
          x="0.5"
          y="0.5"
          width="54"
          height="34"
          rx="2.5"
          stroke={color}
        />
        <rect id="Rectangle_2" y="6" width="55" height="6" fill={color} />
        <rect
          id="Rectangle Copy 7"
          x="6"
          y="17"
          width="23"
          height="1"
          fill={color}
        />
        <rect
          id="Rectangle Copy 28"
          x="6"
          y="20"
          width="14"
          height="1"
          fill={color}
        />
        <rect
          id="Rectangle Copy 29"
          x="6"
          y="23"
          width="14"
          height="1"
          fill={color}
        />
        <rect
          id="Rectangle_3"
          x="37"
          y="20"
          width="12"
          height="9"
          rx="1"
          fill={color}
        />
      </g>
    </svg>
  )
}
