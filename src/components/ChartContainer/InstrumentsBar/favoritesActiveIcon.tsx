import React from 'react'

export const FavoritesActiveIcon = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      viewBox="0 0 16 16"
      onClick={props.onClick}
    >
      <g fill="none" fillRule="evenodd">
        <g fill={props.fill} fillRule="nonzero">
          <g>
            <g>
              <path
                d="M16 5.813c0 .138-.083.29-.25.454l-3.49 3.345.827 4.726c.006.044.01.107.01.19 0 .314-.132.472-.395.472-.122 0-.25-.038-.385-.113L8 12.656l-4.317 2.23c-.141.076-.27.114-.385.114-.135 0-.236-.046-.303-.137-.067-.091-.1-.203-.1-.336 0-.037.006-.1.018-.189l.827-4.726-3.5-3.345C.08 6.097 0 5.945 0 5.813c0-.233.18-.378.538-.435l4.827-.69L7.53.388C7.65.129 7.808 0 8 0c.192 0 .35.13.471.388l2.164 4.3 4.827.69c.359.057.538.202.538.435z"
                transform="translate(-483 -106) translate(247 94) translate(236 12)"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
