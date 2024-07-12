import React from 'react'

const HelpIcon = (props: any) => {
  return (
    <svg
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          d="M5.68125 6.125C5.82819 5.70729 6.11822 5.35507 6.49997 5.13071C6.88172 4.90635 7.33056 4.82434 7.76699 4.8992C8.20341 4.97405 8.59926 5.20095 8.88442 5.53971C9.16959 5.87846 9.32566 6.3072 9.325 6.75C9.325 8 7.45 8.625 7.45 8.625M7.5 11.125H7.50625M13.75 8C13.75 11.4518 10.9518 14.25 7.5 14.25C4.04822 14.25 1.25 11.4518 1.25 8C1.25 4.54822 4.04822 1.75 7.5 1.75C10.9518 1.75 13.75 4.54822 13.75 8Z"
          stroke={props.color || 'white'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export default HelpIcon
