import styled from 'styled-components'

const HeaderWrapper = styled.div<{
  colors: any
}>`
  .title-container {
    display: flex;
    flex: 1;
    padding-bottom: 5px;
    justify-content: space-between;
    align-items: center;

    .title {
      color: ${(props) => props.colors.accentHue1};
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 600;
    }
  }

  .icon-full-mode {
    margin-bottom: -15px;
    margin-right: 5px;
    cursor: pointer;
  }

  .icon-close {
    margin-bottom: -15px;
    cursor: pointer;
  }
`

export { HeaderWrapper }
