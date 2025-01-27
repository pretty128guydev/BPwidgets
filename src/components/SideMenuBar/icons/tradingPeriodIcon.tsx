import React from 'react'

const TradingPeriodIcon = (props: any) => {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 10 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 5H0.5M7 1V3M3 1V3M2.9 11H7.1C7.94008 11 8.36012 11 8.68099 10.8365C8.96323 10.6927 9.1927 10.4632 9.33651 10.181C9.5 9.86012 9.5 9.44008 9.5 8.6V4.4C9.5 3.55992 9.5 3.13988 9.33651 2.81901C9.1927 2.53677 8.96323 2.3073 8.68099 2.16349C8.36012 2 7.94008 2 7.1 2H2.9C2.05992 2 1.63988 2 1.31901 2.16349C1.03677 2.3073 0.8073 2.53677 0.66349 2.81901C0.5 3.13988 0.5 3.55992 0.5 4.4V8.6C0.5 9.44008 0.5 9.86012 0.66349 10.181C0.8073 10.4632 1.03677 10.6927 1.31901 10.8365C1.63988 11 2.05992 11 2.9 11Z"
        stroke={props.color || '#D2D2D2'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default TradingPeriodIcon
