/**
 * Generic dropdowns lists
 * Used in charts controls and in header
 */
import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../core/utils'

interface IListContainerProps {
  colors: any
  top?: any
  left?: any
  right?: any
  bottom?: number
  zIndex?: number
}
const ListContainer = styled.div<any>`
  position: fixed;
  ${(props: IListContainerProps) => (props.top ? `top: ${props.top}px` : '')};
  ${(props: IListContainerProps) =>
    props.left ? `left: ${props.left}px` : ''};
  ${(props: IListContainerProps) =>
    props.right ? `right: ${props.right}px` : ''};
  ${(props: IListContainerProps) =>
    props.bottom ? `bottom: ${props.bottom}px` : ''};
  z-index: ${(props: IListContainerProps) => props.zIndex ?? 41};
  max-height: ${(props) => (isMobileLandscape(props.isMobile) ? 200 : 400)}px;
  overflow-y: auto;

  padding-top: 8px;
  padding-bottom: 8px;

  width: 171px;
  border-radius: 2px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props: IListContainerProps) =>
    props.colors.backgroundHue1};
`

interface IListItemProps {
  colors: any
  active: boolean
}

const ListItem = styled.div<any>`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  height: 35px;
  line-height: 35px;
  font-size: 14px;
  letter-spacing: normal;

  img,
  div {
    margin-left: 10px;
    flex: 0 0 24px;
  }
  span {
    margin-left: 10px;
    flex: 1 1 auto;
  }
  cursor: pointer;

  &:hover {
    color: ${(props: IListItemProps) => props.colors.primaryText};
    background-color: ${(props: IListItemProps) =>
      props.colors.panelBackground};

    .themed_icon {
      svg {
        fill: ${(props: IListItemProps) => props.colors.primaryText};
        stroke: ${(props: IListItemProps) => props.colors.primaryText};
      }
    }
  }

  .themed_icon {
    svg {
      vertical-align: middle;

      ${(props) =>
        props.active
          ? css`
              fill: ${props.colors.primaryText};
              stroke: ${props.colors.primaryText};
            `
          : css``}
    }
  }

  color: ${(props: IListItemProps) =>
    props.active ? props.colors.primaryText : props.colors.secondaryText};
  background-color: ${(props: IListItemProps) =>
    props.active ? props.colors.listBackgroundNormal : 'transparent'};
`
export { ListContainer, ListItem }
