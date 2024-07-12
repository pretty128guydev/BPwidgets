import React from 'react'

const ChallengeIcon = (props: any) => {
  return (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.7075 2.05528C22.6204 2.0154 22.5237 2.00138 22.4288 2.0149C22.334 2.02842 22.245 2.0689 22.1725 2.13153C18.4225 5.38153 15.1725 3.76653 11.7213 2.06153C8.13375 0.286528 4.42375 -1.54847 0.1725 2.13153C0.11871 2.17815 0.0754953 2.23573 0.0457468 2.3004C0.0159983 2.36507 0.000401672 2.43534 0 2.50653V23.5003C0 23.6329 0.0526785 23.7601 0.146447 23.8538C0.240215 23.9476 0.367392 24.0003 0.5 24.0003C0.632608 24.0003 0.759785 23.9476 0.853553 23.8538C0.947321 23.7601 1 23.6329 1 23.5003V17.734C4.67625 14.6853 7.885 16.2728 11.2788 17.9515C14.8663 19.7253 18.5763 21.5615 22.8275 17.8815C22.8813 17.8349 22.9245 17.7773 22.9543 17.7127C22.984 17.648 22.9996 17.5777 23 17.5065V2.50653C22.9993 2.41126 22.9714 2.31818 22.9196 2.23823C22.8678 2.15829 22.7942 2.09481 22.7075 2.05528ZM22 3.54028V10.2753C19.8862 12.0253 17.9275 12.2478 16 11.8003V4.83403C17.905 5.23778 19.8862 5.04653 22 3.54028ZM15 4.56903V11.5115C13.9125 11.1365 12.8263 10.6053 11.7213 10.0578C10.5013 9.45403 9.26625 8.84403 8 8.44528V1.50028C9.0875 1.87528 10.1737 2.40653 11.2788 2.95278C12.5 3.56153 13.7338 4.17153 15 4.56903ZM7 1.21653V8.18028C5.095 7.77653 3.11375 7.96903 1 9.47653V2.74153C3.11375 0.987778 5.0725 0.769028 7 1.21653ZM1 16.4728V10.7378C3.11375 8.98778 5.0725 8.76403 7 9.21153V15.1778C6.45103 15.0606 5.89133 15.0011 5.33 15.0003C3.94 15.0003 2.5 15.4003 1 16.4728ZM8 15.444V9.50028C9.08875 9.87528 10.1737 10.4078 11.2788 10.954C12.4988 11.5578 13.7338 12.1665 15 12.5653V18.5078C13.9113 18.1328 12.8263 17.6015 11.7213 17.0553C10.5 16.4515 9.26625 15.8415 8 15.444ZM16 18.7965V12.8315C16.5487 12.9508 17.1085 13.0124 17.67 13.0153C19.06 13.0153 20.4963 12.6065 22 11.534V17.2715C19.8862 19.024 17.9275 19.2503 16 18.7965Z"
        fill={props.color || '#8491a3'}
      />
    </svg>
  )
}

export default ChallengeIcon
