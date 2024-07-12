import React from 'react'

const ProfitTargetIcon = (props: any) => {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.99998 3.5V2L9.49998 0.5L9.99998 1.5L11 2L9.49998 3.5H7.99998ZM7.99998 3.5L5.99999 5.49997M11 5.5C11 8.26142 8.76142 10.5 6 10.5C3.23858 10.5 1 8.26142 1 5.5C1 2.73858 3.23858 0.5 6 0.5M8.5 5.5C8.5 6.88071 7.38071 8 6 8C4.61929 8 3.5 6.88071 3.5 5.5C3.5 4.11929 4.61929 3 6 3"
        stroke={props.color || '#D2D2D2'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ProfitTargetIcon
