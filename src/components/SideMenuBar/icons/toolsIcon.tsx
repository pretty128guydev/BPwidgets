import React from 'react'

const ToolsIcon = (props: any) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.31249 4.5415C6.56666 4.84706 7.49999 5.93039 7.49999 7.22206C7.49999 8.51373 6.56666 9.59706 5.31249 9.90262V17.6387C5.31249 18.0276 4.99166 18.3332 4.58332 18.3332C4.17499 18.3332 3.85416 18.0276 3.85416 17.6387V9.90262C2.59999 9.59706 1.66666 8.51373 1.66666 7.22206C1.66666 5.93039 2.59999 4.84706 3.85416 4.5415V2.36095C3.85416 1.97206 4.17499 1.6665 4.58332 1.6665C4.99166 1.6665 5.31249 1.97206 5.31249 2.36095V4.5415ZM3.12499 7.22206C3.12499 7.98595 3.78124 8.61095 4.58332 8.61095C5.38541 8.61095 6.04166 7.98595 6.04166 7.22206C6.04166 6.45817 5.38541 5.83317 4.58332 5.83317C3.78124 5.83317 3.12499 6.45817 3.12499 7.22206Z"
        fill={props.color || '#8491A3'}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1458 2.36095V11.4859C12.4 11.7915 13.3333 12.8748 13.3333 14.1665C13.3333 15.4582 12.4 16.5415 11.1458 16.8471V17.6387C11.1458 18.0276 10.825 18.3332 10.4167 18.3332C10.0083 18.3332 9.6875 18.0276 9.6875 17.6387V16.8471C8.43333 16.5415 7.5 15.4582 7.5 14.1665C7.5 12.8748 8.43333 11.7915 9.6875 11.4859V2.36095C9.6875 1.97206 10.0083 1.6665 10.4167 1.6665C10.825 1.6665 11.1458 1.97206 11.1458 2.36095ZM8.95833 14.1665C8.95833 14.9304 9.61458 15.5554 10.4167 15.5554C11.2188 15.5554 11.875 14.9304 11.875 14.1665C11.875 13.4026 11.2188 12.7776 10.4167 12.7776C9.61458 12.7776 8.95833 13.4026 8.95833 14.1665Z"
        fill={props.color || '#8491A3'}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.1458 3.15262C17.4 3.45817 18.3333 4.5415 18.3333 5.83317C18.3333 7.12484 17.4 8.20817 16.1458 8.51373V17.6387C16.1458 18.0276 15.825 18.3332 15.4167 18.3332C15.0083 18.3332 14.6875 18.0276 14.6875 17.6387V8.51373C13.4333 8.20817 12.5 7.12484 12.5 5.83317C12.5 4.5415 13.4333 3.45817 14.6875 3.15262V2.36095C14.6875 1.97206 15.0083 1.6665 15.4167 1.6665C15.825 1.6665 16.1458 1.97206 16.1458 2.36095V3.15262ZM13.9583 5.83317C13.9583 6.59706 14.6146 7.22206 15.4167 7.22206C16.2188 7.22206 16.875 6.59706 16.875 5.83317C16.875 5.06928 16.2188 4.44428 15.4167 4.44428C14.6146 4.44428 13.9583 5.06928 13.9583 5.83317Z"
        fill={props.color || '#8491A3'}
      />
    </svg>
  )
}

export default ToolsIcon