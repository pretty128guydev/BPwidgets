import React from 'react'

export const FavoritesIcon = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      viewBox="0 0 16 16"
      onClick={props.onClick}
    >
      <g fill="none" fillRule="evenodd">
        <g fillRule="nonzero" stroke={props.stroke} strokeWidth="1.5">
          <g>
            <g>
              <path
                d="M8 1.12l2.14 4.255 4.748.678-3.436 3.295.802 4.59-4.26-2.123-3.548 1.833.048-4.353-3.39-3.241 4.755-.679L8 1.12z"
                transform="translate(-626 -106) translate(247 94) translate(379 12)"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
